import React from 'react';
import PropTypes from 'prop-types';
import IssueCard from './IssueCard';

const ResultsDashboard = ({ results = [] }) => {
  // Group issues by severity (normalize to lowercase)
  const groupedIssues = results.reduce((acc, issue) => {
    const severity = issue.severity.toLowerCase();
    // Create a new issue object with normalized severity
    const normalizedIssue = { ...issue, severity };
    
    if (!acc[severity]) {
      acc[severity] = [];
    }
    acc[severity].push(normalizedIssue);
    return acc;
  }, {});

  // Order of severity levels
  const severityOrder = ['high', 'medium', 'low'];
  const totals = {
    high: groupedIssues.high?.length || 0,
    medium: groupedIssues.medium?.length || 0,
    low: groupedIssues.low?.length || 0,
  };
  const totalFindings = results.length;

  return (
    <div className="space-y-8 p-6">
      {totalFindings > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Scan Summary</h2>
              <p className="text-sm text-gray-500">{totalFindings} total findings</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
                High: {totals.high}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
                Medium: {totals.medium}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                Low: {totals.low}
              </span>
            </div>
          </div>
        </div>
      )}

      {severityOrder.map((severity) => {
        const issues = groupedIssues[severity] || [];
        if (issues.length === 0) return null;

        return (
          <div key={severity} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              {severity} Severity Issues ({issues.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.map((issue, index) => (
                <IssueCard key={`${severity}-${index}`} issue={issue} />
              ))}
            </div>
          </div>
        );
      })}
      
      {results.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600">No scan results yet</h2>
          <p className="text-gray-500 mt-2">Run a scan to view security issues grouped by severity.</p>
        </div>
      )}
    </div>
  );
};

ResultsDashboard.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      severity: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      confidence: PropTypes.string,
      url: PropTypes.string.isRequired
    })
  )
};

export default ResultsDashboard;
