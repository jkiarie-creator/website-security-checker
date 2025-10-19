import { useState } from "react";
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck } from 'lucide-react';
import ScanForm from "../components/ScanForm";
import ResultsDashboard from "../components/ResultsDashboard";
import { addScanToHistory } from "../services/history";

const HomePage = () => {
  const [scanComplete, setScanComplete] = useState(false);
  const [scanResults, setScanResults] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  const handleStartScan = async (url, scanResult) => {
    console.log("Starting scan for:", url);
    setIsScanning(true);
    
    try {
      if (scanResult && scanResult.success) {
        // Use real ZAP API results
        setScanResults(scanResult.results);
        setScanComplete(true);
        console.log("Scan completed with results:", scanResult.results);

        // Save to history
        const counts = scanResult.results.reduce(
          (acc, r) => {
            const sev = (r.severity || '').toLowerCase();
            if (sev === 'high') acc.high += 1; else if (sev === 'medium') acc.medium += 1; else acc.low += 1;
            return acc;
          },
          { high: 0, medium: 0, low: 0 }
        );
        addScanToHistory({ url, timestamp: Date.now(), counts });
      }
    } catch (error) {
      console.error("Scan failed:", error);
      // Handle error state here - could show error message to user
      setScanResults([]);
    } finally {
      setIsScanning(false);
    }
  };

  const handleNewScan = () => {
    setScanComplete(false);
    setScanResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {!scanComplete ? (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-cyan-900/20 text-cyan-400 text-sm font-medium mb-6 border border-cyan-500/30">
              <ShieldCheck className="w-5 h-5 mr-2" />
              Web Security Scanner
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
              Website Security Scanner
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Enter a URL to scan for security vulnerabilities and protect your online presence.
            </p>
          </div>
          
          <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 shadow-lg">
            <ScanForm onStartScan={handleStartScan} isScanning={isScanning} />
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-4">Looking to learn more about our security scanner?</p>
            <Link 
              to="/about" 
              className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Learn more about our features
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                Scan Results
              </h2>
              <p className="text-gray-400">Detailed analysis of your website's security</p>
            </div>
            <button
              onClick={handleNewScan}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <Zap className="w-5 h-5 mr-2" />
              New Scan
            </button>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <ResultsDashboard results={scanResults} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
