import React from "react";
import ResultsDashboard from "../components/ResultsDashboard";
import { mockScanResults } from "../mockData";

const TestResultsDashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-6">Test Results Dashboard (Mock Data)</h1>
    <ResultsDashboard results={mockScanResults} />
  </div>
);

export default TestResultsDashboard;
