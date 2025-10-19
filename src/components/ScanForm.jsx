import { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import ProgressBar from './ProgressBar';
import { runSecurityScan } from '../services/zapApi';

// Simple in-memory cache for scan results
const scanCache = new Map();

// Generate a cache key from URL and scan type
const getCacheKey = (url, isFullScan) => `${url}::${isFullScan ? 'full' : 'quick'}`;

const ScanForm = ({ onStartScan, isScanning: externalIsScanning }) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState('');
  const [scanMessage, setScanMessage] = useState('');
  const [isFullScan, setIsFullScan] = useState(false);
  const [cachedScans, setCachedScans] = useState({});
  
  // Ref to track if scan was cancelled
  const isCancelled = useRef(false);
  
  // Use external isScanning if provided, otherwise use local state
  const scanning = externalIsScanning !== undefined ? externalIsScanning : isScanning;
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Reset cancellation state when component unmounts
      isCancelled.current = false;
    };
  }, []);

  // URL validation function
  const isValidUrl = (urlString) => {
    try {
      const url = new URL(urlString);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleCancel = () => {
    isCancelled.current = true;
    setScanMessage('Cancelling scan...');
    // The actual cleanup will happen in the catch block of runSecurityScan
  };

  const resetScanState = () => {
    const setScanningState = externalIsScanning !== undefined ? onStartScan : setIsScanning;
    setScanningState(false);
    setScanProgress(0);
    setScanPhase('');
    setScanMessage('');
    isCancelled.current = false;
  };

  // Check if URL has been scanned before
  const checkCache = useCallback((url) => {
    const key = getCacheKey(url, isFullScan);
    return scanCache.get(key);
  }, [isFullScan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    isCancelled.current = false; // Reset cancellation state at the start of a new scan

    // Normalize URL
    const normalizeUrl = (url) => {
      // Remove any trailing slashes
      url = url.trim().replace(/\/+$/, '');
      // Add https:// if no protocol is specified
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      return url;
    };

    const normalizedUrl = normalizeUrl(url);
    
    // Validate URL
    if (!normalizedUrl) {
      setError("Please enter a URL");
      return;
    }

    if (!isValidUrl(normalizedUrl)) {
      setError("Please enter a valid URL (e.g., example.com or https://example.com)");
      return;
    }

    // Check cache first
    const cachedResult = checkCache(normalizedUrl);
    if (cachedResult) {
      setScanMessage('Loading cached scan results...');
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UX
      onStartScan(normalizedUrl, cachedResult);
      setScanMessage('Loaded from cache');
      setTimeout(() => setScanMessage(''), 2000);
      return;
    }

    // Use the correct state setter based on whether we're using external or internal state
    const setScanningState = externalIsScanning !== undefined ? onStartScan : setIsScanning;
    
    try {
      setScanningState(true);
      setScanProgress(0);
      setScanPhase('');
      setScanMessage('Initializing scan...');
      
      // Force a re-render to show the initial state
      await new Promise(resolve => setTimeout(resolve, 0));

      // Progress update callback for ZAP API
      const onProgressUpdate = ({ phase, progress, message }) => {
        setScanPhase(phase);
        setScanProgress(progress);
        setScanMessage(message);
      };

      // Run the actual ZAP security scan
      try {
        const scanResult = await runSecurityScan(
          normalizedUrl, 
          onProgressUpdate, 
          () => isCancelled.current,
          isFullScan // Pass scan type
        );
        
        if (isCancelled.current) {
          setScanMessage('Scan was cancelled');
          return;
        }
        
        // Cache the result
        const cacheKey = getCacheKey(normalizedUrl, isFullScan);
        scanCache.set(cacheKey, scanResult);
        setCachedScans(prev => ({
          ...prev,
          [cacheKey]: new Date().toISOString()
        }));
        
        // Call the parent's onStartScan with the results if it exists
        if (typeof onStartScan === 'function') {
          await onStartScan(normalizedUrl, scanResult);
        }
        
        setScanProgress(100);
        setScanMessage('Scan completed successfully!');
      } catch (error) {
        if (!isCancelled.current) {
          // Only show error if it wasn't a cancellation
          throw error;
        }
        return; // Exit early if cancelled
      } finally {
        // Reset after a short delay, but only if we're not in a cancelled state
        if (!isCancelled.current) {
          setTimeout(resetScanState, 2000);
        } else {
          resetScanState();
        }
      }

    } catch (err) {
      console.error('Scan failed:', err);
      
      // More specific error messages based on error type
      let errorMessage = "Failed to start scan. Please try again.";
      
      if (err.message.includes('Failed to start spider scan')) {
        errorMessage = "Spider scan failed. The website might be blocking automated scans.";
      } else if (err.message.includes('Failed to start active scan')) {
        errorMessage = "Security scan failed to start. The website might have security measures that block automated scans.";
      } else if (err.message.includes('Failed to fetch scan results')) {
        errorMessage = "Scan completed but some results might be incomplete.";
      } else if (err.message.includes('Network Error') || err.message.includes('ECONNREFUSED')) {
        errorMessage = "Cannot connect to ZAP API. Please ensure the ZAP proxy server is running.";
      } else if (err.message.includes('timeout')) {
        errorMessage = "The scan took too long to complete. The website might be slow or blocking our requests.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      resetScanState();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {error && (
        <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm">{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-xs underline hover:opacity-80"
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="relative">
            {/* URL Input with validation styling */}
            <input 
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              disabled={scanning}
              placeholder="https://example.com"
              className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white border-2 
                        ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-cyan-500'} 
                        transition-colors duration-200
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 
                        ${error ? 'focus:ring-red-500/50' : 'focus:ring-cyan-500/50'}`}
              aria-invalid={error ? "true" : "false"}
              aria-busy={scanning ? "true" : "false"}
            />
                        
            {/* Help text */}
            <p className="mt-2 text-gray-400 text-sm">
              Enter the complete URL including http:// or https://
            </p>
          </div>

          {/* Scan Type Toggle */}
          <div className="flex items-start justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="font-medium text-white mb-1">Scan Type</h3>
              <p className="text-sm text-gray-400 break-words">
                {isFullScan 
                  ? 'Full Scan: Comprehensive security check (spider + active scan)'
                  : 'Quick Scan: Fast check of the main page only'}
              </p>
              {checkCache(url) && (
                <p className="text-xs text-green-400 mt-1">
                  Previously scanned - will load from cache
                </p>
              )}
            </div>
            <div className="flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsFullScan(!isFullScan)}
                disabled={scanning}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                  isFullScan ? 'bg-cyan-600' : 'bg-gray-600'
                }`}
                aria-pressed={isFullScan}
              >
                <span className="sr-only">Toggle scan type</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                    isFullScan ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Submit button with loading state */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            type="submit"
            disabled={scanning}
            className={`flex-1 px-6 py-3 rounded-lg font-orbitron font-semibold
                      transition-all duration-200 ease-in-out
                      ${scanning 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25'
                      } 
                      text-white`}
          >
            {scanning ? 'Scanning...' : 'Start Security Scan'}
          </button>
          
          {scanning && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 rounded-lg font-orbitron font-semibold
                        bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600
                        text-white hover:shadow-lg hover:shadow-red-500/25
                        transition-all duration-200 ease-in-out"
            >
              Cancel Scan
            </button>
          )}
        </div>
      </form>

      {/* Progress bar */}
      {scanning && (
        <div className="mt-8">
          <ProgressBar progress={scanProgress} />
          <div className="mt-4 text-center">
            <p className="text-cyan-400 text-sm font-medium">
              {scanPhase && scanPhase.charAt(0).toUpperCase() + scanPhase.slice(1)} Phase
            </p>
            <p className="text-gray-400 text-sm mt-1">{scanMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

ScanForm.propTypes = {
  onStartScan: PropTypes.func.isRequired,
  isScanning: PropTypes.bool,
};

export default ScanForm;
