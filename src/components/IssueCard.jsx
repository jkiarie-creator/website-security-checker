import React from 'react';
import PropTypes from 'prop-types';

const SeverityBadge = ({ severity }) => {
  const severityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-orange-100 text-orange-800',
    low: 'bg-green-100 text-green-800'
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${severityColors[severity] || 'bg-gray-100 text-gray-800'}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
};

const IssueCard = ({ issue }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
      <SeverityBadge severity={issue.severity} />
    </div>
    <div className="space-y-3">
      <p className="text-gray-600">{issue.description}</p>
      {issue.confidence && (
        <p className="text-sm text-gray-500">
          <span className="font-medium">Confidence:</span> {issue.confidence}
        </p>
      )}
      <p className="text-sm text-gray-500">
        <span className="font-medium">URL:</span>{' '}
        <a href={issue.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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