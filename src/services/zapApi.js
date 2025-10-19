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
    // Ensure we have all required parameters with defaults
    const scanParams = {
      url: targetUrl,
      recurse: 'false',
      inScopeOnly: 'false',
      scanPolicyName: 'Default Policy',
      method: 'GET',
      postData: '',
      contextId: '',
      ...params
    };

    console.log('Sending active scan request with params:', scanParams);
    
    const response = await zapApi.get('/zap/JSON/ascan/action/scan', {
      params: scanParams,
      timeout: 30000 // 30 second timeout for starting the scan
    });
    
    if (!response.data || !response.data.scan) {
      throw new Error('Invalid response from ZAP API when starting active scan');
    }
    
    return response.data.scan;
  } catch (error) {
    console.error('Active scan failed to start:', error);
    
    // Try to get more detailed error information
    let errorDetails = extractAxiosError(error);
    
    // If it's a 404, the URL might not be in the scan tree
    if (error.response && error.response.status === 404) {
      errorDetails += ' (URL not found in scan tree. Make sure to access the URL through ZAP first)';
    }
    
    throw new Error(`Failed to start active scan: ${errorDetails}`);
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
    console.log('Fetching alerts for URL:', targetUrl);
    const response = await zapApi.get('/zap/JSON/core/view/alerts', {
      params: { 
        baseurl: targetUrl, 
        start: 0, 
        count: 1000, // Increased limit to get all alerts
        riskId: '1,2,3' // Get all risk levels (High, Medium, Low)
      },
      timeout: 15000 // Increased timeout
    });
    
    if (!response.data || !response.data.alerts) {
      console.warn('No alerts found in response:', response.data);
      return [];
    }
    
    console.log(`Found ${response.data.alerts.length} security alerts`);
    return response.data.alerts;
  } catch (error) {
    console.error('Failed to fetch scan results:', error);
    
    // If we can't get alerts, at least return an empty array instead of failing
    if (error.response && error.response.status === 404) {
      console.warn('Alerts endpoint returned 404 - no alerts found');
      return [];
    }
    
    console.error('Error details:', extractAxiosError(error));
    throw new Error(`Failed to fetch scan results: ${extractAxiosError(error)}`);
  }
};

// Add URL to ZAP's context
const addUrlToContext = async (url) => {
  try {
    // First, check if the URL is already in a context
    try {
      const contextResponse = await zapApi.get('/zap/JSON/context/view/contextList/');
      const contextList = contextResponse.data.contextList || [];
      
      // Try to find an existing context
      for (const contextName of contextList) {
        try {
          // Add URL to the existing context
          await zapApi.get('/zap/JSON/context/action/includeInContext/', {
            params: { 
              contextName,
              regex: `${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*`
            }
          });
          return contextName;
        } catch (e) {
          // Continue to next context
          continue;
        }
      }
      
      // If no context found, create a new one
      const contextName = `scan-context-${Date.now()}`;
      await zapApi.get('/zap/JSON/context/action/newContext/', {
        params: { contextName }
      });
      
      // Add the URL to the new context
      await zapApi.get('/zap/JSON/context/action/includeInContext/', {
        params: { 
          contextName,
          regex: `${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*`
        }
      });
      
      return contextName;
    } catch (error) {
      console.warn('Error managing context, using default scan parameters:', error);
      return null;
    }
  } catch (error) {
    console.warn('Failed to add URL to context, using default scan parameters:', error);
    return null;
  }
};

// Main scan function
export const runSecurityScan = async (targetUrl, onProgressUpdate, isCancelled = () => false, isFullScan = false) => {
  // Normalize the target URL to ensure it's properly formatted
  const normalizeUrl = (url) => {
    try {
      // First clean the URL by removing any fragments
      let cleanUrl = url.split('#')[0];
      
      // Parse the URL
      const urlObj = new URL(cleanUrl);
      
      // Ensure we have a protocol
      if (!urlObj.protocol) {
        urlObj.protocol = 'https:';
      }
      
      // For scanning purposes, we'll use just the origin + pathname
      // This avoids issues with tracking parameters and session IDs
      const baseUrl = `${urlObj.origin}${urlObj.pathname}`;
      
      console.log('Normalized URL:', { original: url, normalized: baseUrl });
      return baseUrl;
    } catch (e) {
      console.warn('Error normalizing URL, using as-is:', url, e);
      // If URL parsing fails, try to fix common issues
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url.split('?')[0].split('#')[0]}`;
      }
      return url.split('?')[0].split('#')[0];
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

    // Register the target URL with ZAP first
    onProgressUpdate({ phase: 'setup', progress: 5, message: 'Registering URL with ZAP...' });
    
    // Extract base URL for scanning (without query parameters)
    const urlObj = new URL(targetUrl);
    const baseScanUrl = `${urlObj.origin}${urlObj.pathname}`;
    
    // First try to access the URL through ZAP
    const accessUrl = async (url) => {
      try {
        console.log('Accessing URL to add it to the scan tree:', url);
        const response = await zapApi.get('/zap/JSON/core/action/accessUrl/', {
          params: { 
            url: url,
            followRedirects: 'true',
            handleParameters: 'IGNORE_VALUE'
          },
          timeout: 15000
        });
        console.log('Successfully accessed URL:', url);
        return true;
      } catch (error) {
        console.warn('Failed to access URL through ZAP:', url, error);
        return false;
      }
    };
    
    // Try with the full URL first, then fall back to base URL
    let urlAdded = await accessUrl(targetUrl);
    if (!urlAdded && targetUrl !== baseScanUrl) {
      console.log('Trying with base URL instead...');
      urlAdded = await accessUrl(baseScanUrl);
    }
    
    if (!urlAdded) {
      console.warn('Could not access URL through ZAP, scan might fail');
    }
    
    // Start active scan
    onProgressUpdate({ phase: 'scan', progress: 10, message: 'Starting active scan...' });
    
    if (isCancelled()) {
      throw new Error('Scan was cancelled');
    }
    
    // For quick scans, only scan the specific URL, not the whole context
    const scanParams = {
      url: baseScanUrl, // Use the base URL without query parameters
      recurse: isFullScan ? 'true' : 'false',
      inScopeOnly: 'false', // Set to false to avoid context issues
      scanPolicyName: 'Default Policy',
      method: 'GET',
      postData: '',
      contextId: '',
      handleParameters: 'IGNORE_VALUE', // Ignore parameter values
      scanHeadersAllRequests: 'true',
      delayInMs: '0',
      threadPerHost: '2'
    };
    
    console.log('Starting scan with parameters:', {
      ...scanParams,
      url: baseScanUrl // Log the actual URL being scanned
    });
    
    // Only try to use context for full scans
    if (isFullScan) {
      onProgressUpdate({ phase: 'setup', progress: 15, message: 'Preparing scan context...' });
      try {
        const contextName = await addUrlToContext(targetUrl);
        if (contextName) {
          scanParams.contextId = contextName;
        }
      } catch (error) {
        console.warn('Proceeding without custom context:', error);
      }
    }
    
    // Add retry logic for starting the scan
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let activeScanId = null;
    
    while (retryCount < MAX_RETRIES && !activeScanId) {
      try {
        console.log(`Starting active scan (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        activeScanId = await startActiveScan(baseScanUrl, scanParams);
        console.log('Active scan started with ID:', activeScanId);
      } catch (error) {
        retryCount++;
        if (retryCount >= MAX_RETRIES) {
          throw error; // Re-throw if we've exhausted all retries
        }
        
        console.warn(`Attempt ${retryCount} failed, retrying in 2 seconds...`, error);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Try to access the URL again before retrying
        await accessUrl(baseScanUrl);
      }
    }
    
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
