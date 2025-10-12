import React from "react";
import IssueCard from "../components/IssueCard";
import { mockScanResults } from "../mockData";

const TestIssueCard = () => (
  <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {mockScanResults.map((issue) => (
      <IssueCard key={issue.id} issue={issue} />
    ))}
  </div>
);

export default TestIssueCard;
