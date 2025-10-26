import axios from 'axios';

// ZAP API configuration
const ZAP_BASE_URL = 'http://localhost:3001/zap';
const POLL_INTERVAL = 2000; // 2 seconds
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Create Axios instance with base configuration
const zapApi = axios.create({
  baseURL: ZAP_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Custom error for cancelled scans
class ScanCancelledError extends Error {
  constructor(message = 'Scan was cancelled') {
    super(message);
    this.name = 'ScanCancelledError';
  }
}

/**
 * Helper function to poll a status endpoint until completion
 */
async function pollUntilComplete({
  checkStatus,
  onProgress,
  onError,
  isCancelled = () => false,
  maxAttempts = 0 // 0 = no limit
}) {
  let attempts = 0;
  let lastProgress = 0;
  
  while (true) {
    if (isCancelled()) {
      throw new Error('Scan was cancelled');
    }

    try {
      const { progress, done } = await checkStatus();
      
      // Update progress if it has changed
      if (progress !== lastProgress) {
        lastProgress = progress;
        onProgress?.(progress);
      }
      
      // Check if we're done
      if (done) {
        return { success: true, progress: 100 };
      }
    
      // Check max attempts
      if (maxAttempts > 0 && ++attempts >= maxAttempts) {
        throw new Error('Maximum polling attempts reached');
      }
      
      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
      
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        throw error;
      }
    }
  }
}

/**
 * Check ZAP connectivity
 */
async function checkZapConnectivity() {
  try {
    const response = await zapApi.get('/JSON/core/view/version');
    return response.data?.version !== undefined;
  } catch (error) {
    console.error('Failed to connect to ZAP API:', error.message);
    throw new Error(`ZAP connection failed: ${error.message}`);
  }
}

/**
 * Start a Quick Scan and wait for completion
 */
async function runQuickScan(targetUrl, onProgress, isCancelled = () => false, isFullScan = false) {
  // Only use traditional spider and active scan
  async function startSpider(url) {
    const res = await zapApi.get('/JSON/spider/action/scan', {
      params: { url, recurse: true }
    });
    const scanId = res.data?.scan || res.data?.scanId || null;
    await pollUntilComplete({
      checkStatus: async () => {
        const statusRes = await zapApi.get('/JSON/spider/view/status', { params: { scanId } });
        const status = parseInt(statusRes.data?.status || '0');
        return { progress: status, done: status >= 100 };
      },
      onProgress: (p) => onProgress?.({ phase: 'spider', progress: p, message: `Spider: ${p}%`, state: 'scanning' }),
      isCancelled,
      maxAttempts: 0
    });
    return scanId;
  }

  async function startActiveScan(url) {
    const res = await zapApi.get('/JSON/ascan/action/scan', { params: { url, recurse: true, inScopeOnly: false } });
    const scanId = res.data?.scan || res.data?.scanId || null;
    await pollUntilComplete({
      checkStatus: async () => {
        const statusRes = await zapApi.get('/JSON/ascan/view/status', { params: { scanId } });
        const status = parseInt(statusRes.data?.status || '0');
        return { progress: status, done: status >= 100 };
      },
      onProgress: (p) => onProgress?.({ phase: 'active-scan', progress: p, message: `Active Scan: ${p}%`, state: 'scanning' }),
      isCancelled,
      maxAttempts: 0
    });
    return scanId;
  }

  // Orchestrate the steps
  onProgress?.({ phase: 'scan-start', progress: 1, message: 'Starting spider...' });
  await startSpider(targetUrl);
  onProgress?.({ phase: 'scan-progress', progress: 50, message: 'Spider finished' });
  if (isFullScan) {
    onProgress?.({ phase: 'scan-progress', progress: 55, message: 'Starting active scan...' });
    await startActiveScan(targetUrl);
    onProgress?.({ phase: 'scan-complete', progress: 90, message: 'Active scan finished.' });
  } else {
    onProgress?.({ phase: 'scan-complete', progress: 90, message: 'Quick scan completed (spider only).' });
  }
  return true;
}

/**
 * Fetch alerts for the target URL
 */
async function fetchAlerts(targetUrl) {
  try {
    const { data } = await zapApi.get('/JSON/core/view/alerts', {
      params: {
        baseurl: targetUrl,
        start: 0,
        count: 1000
      }
    });

    // Transform alerts to consistent format
    return (data.alerts || []).map(alert => ({
      id: alert.id,
      name: alert.name,
      risk: alert.risk,
      confidence: alert.confidence,
      url: alert.url,
      description: alert.description || '',
      solution: alert.solution || '',
      reference: alert.reference || ''
    }));
  } catch (error) {
    console.error('Failed to fetch alerts:', error.message);
    return [];
  }
}

/**
 * Main function to run a security scan using ZAP Quick Scan
 * @param {string} targetUrl - The target URL to scan
 * @param {function} onProgress - Callback for progress updates
 * @param {object} options - For backward compatibility (not used in this implementation)
 * @returns {Promise<Array>} - Array of alerts
 */
export async function runSecurityScan(
  targetUrl,
  onProgress = () => {},
  isCancelled = () => false,
  isFullScan = false
) {
  try {
    // Normalize URL
    const cleanUrl = new URL(targetUrl);
    cleanUrl.hash = '';
    cleanUrl.search = '';
    const normalizedUrl = cleanUrl.toString();
    
    console.log('Starting security scan for:', normalizedUrl);
    
    // Check ZAP connectivity
    onProgress({
      state: 'scanning',
      phase: 'setup',
      progress: 0,
      message: 'Connecting to ZAP...',
      canCancel: true
    });
    
    await checkZapConnectivity();
    
    // Run Quick Scan (includes both spider and active scan)
    onProgress({
      state: 'scanning',
      phase: 'setup',
      progress: 5,
      message: 'Starting scan...',
      canCancel: true
    });
    
    await runQuickScan(normalizedUrl, (progress) => {
      onProgress({
        ...progress,
        state: 'scanning',
        canCancel: true
      });
    }, isCancelled, isFullScan);
    
    // Fetch and return results
    onProgress({
      state: 'scanning',
      phase: 'results',
      progress: 95,
      message: 'Scan complete, fetching results...',
      canCancel: false
    });
    
    const alerts = await fetchAlerts(normalizedUrl);
    console.log(`Scan completed. Found ${alerts.length} alerts.`);
    
    onProgress({
      state: 'completed',
      phase: 'complete',
      progress: 100,
      message: 'Scan completed successfully!',
      canCancel: false
    });
    
    return alerts;
    
  } catch (error) {
    console.error('Security scan failed:', error);
    onProgress({
      state: 'error',
      phase: 'error',
      progress: 0,
      message: `Scan failed: ${error.message}`,
      canCancel: false
    });
    throw new Error(`Security scan failed: ${error.message}`);
  }
}