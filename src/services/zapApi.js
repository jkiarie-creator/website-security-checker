import axios from "axios";

// Use the proxy URL from environment variables or default to localhost:3001
const proxyUrl = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001';

// Create axios instance with default config
const zapApi = axios.create({
  baseURL: proxyUrl,
  timeout: 30000, // Increased timeout for proxy requests
  headers: { 
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to prefix all requests with /zap
zapApi.interceptors.request.use(config => {
  // Only modify the URL if it's not already prefixed with /zap
  if (!config.url.startsWith('/zap/')) {
    config.url = `/zap${config.url.startsWith('/') ? '' : '/'}${config.url}`;
  }
  return config;
});

const extractAxiosError = (error) => {
  if (error?.response) {
    const { status, statusText, data } = error.response;
    const details = typeof data === 'string' ? data : JSON.stringify(data);
    return `HTTP ${status} ${statusText}${details ? ` - ${details}` : ''}`;
  }
  if (error?.request) {
    return 'No response from ZAP (request made, no reply)';
  }
  return error?.message || 'Unknown error';
};

// Spider scan to discover URLs
const runSpiderScan = async (targetUrl) => {
  try {
    const response = await zapApi.get('/zap/JSON/spider/action/scan', {
      params: { url: targetUrl }
    });
    return response.data.scan;
  } catch (error) {
    console.error('Spider scan failed:', error);
    throw new Error(`Failed to start spider scan: ${extractAxiosError(error)}`);
  }
};

// Check spider scan status
const checkSpiderProgress = async (scanId) => {
  try {
    const response = await zapApi.get('/zap/JSON/spider/view/status', {
      params: { scanId },
      timeout: 5000 // 5 second timeout
    });
    return parseInt(response.data.status) || 0;
  } catch (error) {
    console.error('Error checking spider progress:', error);
    // If we get a 404, the scan might be complete but the status endpoint is no longer available
    if (error.response && error.response.status === 404) {
      return 100; // Assume scan is complete
    }
    return 0; // Return 0 on error to prevent getting stuck
  }
};

// Start active scan
const startActiveScan = async (targetUrl, params = { url: targetUrl }) => {
  try {
    const response = await zapApi.get('/zap/JSON/ascan/action/scan', {
      params: {
        url: targetUrl,
        ...params
      }
    });
    return response.data.scan;
  } catch (error) {
    console.error('Active scan failed to start:', error);
    throw new Error(`Failed to start active scan: ${extractAxiosError(error)}`);
  }
};

// Check active scan status
const checkActiveScanProgress = async (scanId) => {
  try {
    const response = await zapApi.get('/zap/JSON/ascan/view/status', {
      params: { scanId },
      timeout: 5000 // 5 second timeout
    });
    return parseInt(response.data.status) || 0;
  } catch (error) {
    console.error('Error checking scan progress:', error);
    // If we get a 404, the scan might be complete but the status endpoint is no longer available
    if (error.response && error.response.status === 404) {
      return 100; // Assume scan is complete
    }
    return 0; // Return 0 on error to prevent getting stuck
  }
};

// Get scan results
const getScanResults = async (targetUrl) => {
  try {
    const response = await zapApi.get('/zap/JSON/core/view/alerts', {
      params: { baseurl: targetUrl },
      timeout: 10000 // 10 second timeout
    });
    return response.data.alerts || [];
  } catch (error) {
    console.error('Failed to fetch scan results:', error);
    throw new Error(`Failed to fetch scan results: ${extractAxiosError(error)}`);
  }
};

// Main scan function
export const runSecurityScan = async (targetUrl, onProgressUpdate, isCancelled = () => false, isFullScan = false) => {
  // Normalize the target URL to ensure it's properly formatted
  const normalizeUrl = (url) => {
    try {
      const urlObj = new URL(url);
      // Ensure we have a protocol
      if (!urlObj.protocol) {
        urlObj.protocol = 'https:';
      }
      return urlObj.toString();
    } catch (e) {
      // If URL parsing fails, try to fix it
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url}`;
      }
      return url;
    }
  };

  targetUrl = normalizeUrl(targetUrl);
  // Maximum number of retries for each phase
  const MAX_RETRIES = 3;
  let retryCount = 0;
  
  try {
    // Check if proxy URL is available
    if (!proxyUrl) {
      throw new Error('Proxy configuration missing. Please check your environment variables.');
    }

    // Health check first to give clearer diagnostics
    try {
      await zapApi.get('/zap/JSON/core/view/version', { timeout: 10000 });
    } catch (healthErr) {
      throw new Error(`Cannot reach ZAP API via proxy at ${proxyUrl}: ${extractAxiosError(healthErr)}`);
    }

    // Only run spider scan for full scans
    if (isFullScan) {
      onProgressUpdate({ phase: 'spider', progress: 0, message: 'Starting spider scan...' });
      
      if (isCancelled()) {
        throw new Error('Scan was cancelled');
      }
      
      const spiderScanId = await runSpiderScan(targetUrl);
      
      // Monitor spider progress with timeout
      let progress = 0;
      let attempts = 0;
      const MAX_ATTEMPTS = 30; // 30 attempts * 2 seconds = 1 minute max
      
      while (progress < 100 && attempts < MAX_ATTEMPTS && !isCancelled()) {
        progress = await checkSpiderProgress(spiderScanId);
        onProgressUpdate({ 
          phase: 'spider', 
          progress, 
          message: `Spider scan in progress: ${progress}% (${attempts + 1}/${MAX_ATTEMPTS})` 
        });
        
        if (progress < 100) {
          await new Promise(r => setTimeout(r, 2000));
          attempts++;
        }
      }
      
      if (isCancelled()) {
        throw new Error('Scan was cancelled');
      }
      
      if (progress < 100) {
        console.warn(`Spider scan timed out after ${MAX_ATTEMPTS} attempts, continuing with active scan`);
        // Instead of failing, we'll continue with the active scan
        // This handles cases where the spider status endpoint becomes unavailable
      }
    } else {
      // For quick scans, we'll skip the direct URL check since it might fail due to CORS
      // and ZAP can handle scanning even if the direct request fails
      onProgressUpdate({ phase: 'verify', progress: 100, message: 'Skipping direct URL check (CORS may block it)' });
      await new Promise(r => setTimeout(r, 500)); // Small delay for UX
    }

    // Start active scan
    onProgressUpdate({ phase: 'scan', progress: 0, message: 'Starting active scan...' });
    
    if (isCancelled()) {
      throw new Error('Scan was cancelled');
    }
    
    // For quick scans, only scan the specific URL, not the whole context
    const scanParams = isFullScan 
      ? { 
          url: targetUrl,
          recurse: 'true',
          inScopeOnly: 'true',
          scanPolicyName: 'Default Policy'
        }
      : { 
          url: targetUrl,
          recurse: 'false',
          inScopeOnly: 'true',
          scanPolicyName: 'Default Policy'
        };
    
    const activeScanId = await startActiveScan(targetUrl, scanParams);
    
    // Monitor active scan progress with timeout
    let progress = 0;
    let attempts = 0;
    const MAX_SCAN_ATTEMPTS = isFullScan ? 300 : 60; // 10 minutes max for full, 2 minutes for quick scan
    
    while (progress < 100 && attempts < MAX_SCAN_ATTEMPTS && !isCancelled()) {
      progress = await checkActiveScanProgress(activeScanId);
      onProgressUpdate({ 
        phase: 'scan', 
        progress, 
        message: `Security scan in progress: ${progress}% (${attempts + 1}/${MAX_SCAN_ATTEMPTS})` 
      });
      
      if (progress < 100) {
        await new Promise(r => setTimeout(r, 2000));
        attempts++;
      }
    }
    
    if (isCancelled()) {
      try {
        await zapApi.get('/zap/JSON/ascan/action/stop/', {
          params: { scanId: activeScanId },
          timeout: 3000
        });
      } catch (e) {
        console.warn('Failed to stop active scan:', e);
      }
      throw new Error('Scan was cancelled');
    }
    
    if (progress < 100) {
      throw new Error(`Active scan timed out after ${MAX_SCAN_ATTEMPTS} attempts`);
    }

    // Get final results
    onProgressUpdate({ phase: 'results', progress: 100, message: 'Fetching results...' });
    const results = await getScanResults(targetUrl);
    
    return {
      success: true,
      results: results.map(alert => ({
        id: alert.id,
        title: alert.name,
        severity: alert.risk.toLowerCase(),
        description: alert.description,
        confidence: alert.confidence,
        url: alert.url
      }))
    };
  } catch (error) {
    console.error('Security scan failed:', error);
    // Connection layer hints
    if (
      error.code === 'ECONNREFUSED' ||
      (typeof error.message === 'string' && (
        error.message.includes('Network Error') ||
        error.message.includes('No response from ZAP') ||
        error.message.includes('ERR_EMPTY_RESPONSE')
      ))
    ) {
      throw new Error(`Cannot connect to ZAP API at ${baseURL}. Ensure ZAP is running, API is enabled, API key matches, and CORS allows your origin.`);
    }
    throw new Error(error.message || 'Security scan failed');
  }
};
