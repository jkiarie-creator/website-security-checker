import React from 'react';
import PropTypes from 'prop-types';

const SeverityBadge = ({ severity }) => {
  const severityColors = {
    high: 'bg-danger-50 text-danger-700',
    medium: 'bg-warning-50 text-warning-700',
    low: 'bg-success-50 text-success-700'
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${severityColors[severity] || 'bg-muted-200 text-muted-700'}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
};

const IssueCard = ({ issue }) => (
  <div className="bg-card rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-lg font-semibold text-muted-700">{issue.title}</h3>
      <SeverityBadge severity={issue.severity} />
    </div>
    <div className="space-y-3">
      <p className="text-muted-500">{issue.description}</p>
      {issue.confidence && (
        <p className="text-sm text-muted-500">
          <span className="font-medium">Confidence:</span> {issue.confidence}
        </p>
      )}
      <p className="text-sm text-muted-500">
        <span className="font-medium">URL:</span>{' '}
        <a href={issue.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
          {issue.url}
        </a>
      </p>
    </div>
  </div>
);

SeverityBadge.propTypes = {
  severity: PropTypes.string.isRequired
};

IssueCard.propTypes = {
  issue: PropTypes.shape({
    title: PropTypes.string.isRequired,
    severity: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    confidence: PropTypes.string,
    url: PropTypes.string.isRequired
  }).isRequired
};

export default IssueCard;