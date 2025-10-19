import { useState } from "react";
import PropTypes from 'prop-types';
import ProgressBar from './ProgressBar';
import TestIssueCard from "../pages/TestResultsDashboard";

const ScanForm = ({ onStartScan, isScanning: externalIsScanning }) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  
  // Use external isScanning if provided, otherwise use local state
  const scanning = externalIsScanning !== undefined ? externalIsScanning : isScanning;

  // URL validation function
  const isValidUrl = (urlString) => {
    try {
      const url = new URL(urlString);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate URL
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    if (!isValidUrl(url)) {
      setError("Please enter a valid URL (starting with http:// or https://)");
      return;
    }

    try {
      setIsScanning(true);
      // Simulate progress updates (replace with actual scan progress)
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 1000);

      await onStartScan(url);
      setScanProgress(100);
      setTimeout(() => {
        setIsScanning(false);
        setScanProgress(0);
      }, 1000);

    } catch (err) {
      setError("Failed to start scan. Please try again.");
      setIsScanning(false);
      setScanProgress(0);
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
          />
          
          {/* Error message */}
          {error && (
            <p className="mt-2 text-red-500 text-sm font-medium">{error}</p>
          )}
          
          {/* Help text */}
          <p className="mt-2 text-gray-400 text-sm">
            Enter the complete URL including http:// or https://
          </p>
        </div>

        {/* Submit button with loading state */}
        <button 
          type="submit"
          disabled={scanning}
          className={`w-full md:w-auto px-6 py-3 rounded-lg font-orbitron font-semibold
                    transition-all duration-200 ease-in-out
                    ${scanning 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25'
                    } 
                    text-white`}
        >
          {scanning ? 'Scanning...' : 'Start Security Scan'}
        </button>
      </form>

      {/* Progress bar */}
      {scanning && (
        <div className="mt-8">
          <ProgressBar progress={scanProgress} />
          <p className="mt-2 text-gray-400 text-sm text-center">Scanning in progress...</p>
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
