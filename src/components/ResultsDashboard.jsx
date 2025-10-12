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

  return (
    <div className="space-y-8 p-6">
      {severityOrder.map((severity) => {
        const issues = groupedIssues[severity] || [];
        
        if (results.length === 0) {
          return (
            <div key="no-results" className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-600">No scan results available</h2>
              <p className="text-gray-500 mt-2">Run a scan to see security issues</p>
            </div>
          );
        }

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
          <h2 className="text-2xl font-semibold text-gray-600">No scan results available</h2>
          <p className="text-gray-500 mt-2">Run a scan to see security issues</p>
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
