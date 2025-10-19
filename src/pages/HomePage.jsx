import { useState } from "react";
import ScanForm from "../components/ScanForm";
import ResultsDashboard from "../components/ResultsDashboard";
import { mockScanResults } from "../mockData";

const HomePage = () => {
  const [scanComplete, setScanComplete] = useState(false);
  const [scanResults, setScanResults] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  const handleStartScan = async (url) => {
    console.log("Starting scan for:", url);
    setIsScanning(true);
    
    // Simulate API call with mock data
    try {
      // Actual API call made here 
      // const results = await api.scanWebsite(url);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      
      // For now, use mock data
      setScanResults(mockScanResults);
      setScanComplete(true);
    } catch (error) {
      console.error("Scan failed:", error);
      // Handle error state here
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
