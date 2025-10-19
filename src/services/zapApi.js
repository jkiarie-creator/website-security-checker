import axios from "axios";

const baseURL = import.meta.env.VITE_ZAP_BASE_URL;
const apiKey = import.meta.env.VITE_ZAP_API_KEY;

// Create axios instance with default config
const zapApi = axios.create({
  baseURL,
  params: {
    apikey: apiKey
  }
});

// Spider scan to discover URLs
const runSpiderScan = async (targetUrl) => {
  try {
    const response = await zapApi.get('/JSON/spider/action/scan/', {
      params: { url: targetUrl }
    });
    return response.data.scan;
  } catch (error) {
    console.error('Spider scan failed:', error);
    throw new Error('Failed to start spider scan');
  }
};

// Check spider scan status
const checkSpiderProgress = async (scanId) => {
  const response = await zapApi.get('/JSON/spider/view/status/', {
    params: { scanId }
  });
  return parseInt(response.data.status);
};

// Start active scan
const startActiveScan = async (targetUrl) => {
  try {
    const response = await zapApi.get('/JSON/ascan/action/scan/', {
      params: { url: targetUrl }
    });
    return response.data.scan;
  } catch (error) {
    console.error('Active scan failed:', error);
    throw new Error('Failed to start active scan');
  }
};

// Check active scan status
const checkActiveScanProgress = async (scanId) => {
  const response = await zapApi.get('/JSON/ascan/view/status/', {
    params: { scanId }
  });
  return parseInt(response.data.status);
};

// Get scan results
const getScanResults = async (targetUrl) => {
  try {
    const response = await zapApi.get('/JSON/core/view/alerts/', {
      params: { baseurl: targetUrl }
    });
    return response.data.alerts || [];
  } catch (error) {
    console.error('Failed to fetch scan results:', error);
    throw new Error('Failed to fetch scan results');
  }
};

// Main scan function
export const runSecurityScan = async (targetUrl, onProgressUpdate) => {
  try {
    // Start spider scan
    onProgressUpdate({ phase: 'spider', progress: 0, message: 'Starting spider scan...' });
    const spiderScanId = await runSpiderScan(targetUrl);
    
    // Monitor spider progress
    let progress = 0;
    while (progress < 100) {
      progress = await checkSpiderProgress(spiderScanId);
      onProgressUpdate({ 
        phase: 'spider', 
        progress, 
        message: `Spider scan in progress: ${progress}%` 
      });
      await new Promise(r => setTimeout(r, 2000));
    }

    // Start active scan
    onProgressUpdate({ phase: 'scan', progress: 0, message: 'Starting active scan...' });
    const activeScanId = await startActiveScan(targetUrl);
    
    // Monitor active scan progress
    progress = 0;
    while (progress < 100) {
      progress = await checkActiveScanProgress(activeScanId);
      onProgressUpdate({ 
        phase: 'scan', 
        progress, 
        message: `Security scan in progress: ${progress}%` 
      });
      await new Promise(r => setTimeout(r, 2000));
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
    throw new Error(error.message || 'Security scan failed');
  }
};
