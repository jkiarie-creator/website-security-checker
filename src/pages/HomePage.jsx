import { useState } from "react";
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
    <section className="p-8">
      {!scanComplete ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold font-orbitron mb-2">Website Security Scanner</h2>
          <p className="text-gray-300 mb-8">Enter a URL to scan for security vulnerabilities</p>
          <div className="max-w-2xl mx-auto">
            <ScanForm onStartScan={handleStartScan} isScanning={isScanning} />
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold font-orbitron">Scan Results</h2>
            <button
              onClick={handleNewScan}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Start New Scan
            </button>
          </div>
          <ResultsDashboard results={scanResults} />
        </div>
      )}
    </section>
  );
};

export default HomePage;
