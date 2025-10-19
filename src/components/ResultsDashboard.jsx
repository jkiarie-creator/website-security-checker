import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import IssueCard from './IssueCard';

const ResultsDashboard = ({ results = [] }) => {
  // Group issues by severity
  const groupedIssues = results.reduce((acc, issue) => {
    const severity = issue.severity.toLowerCase();
    if (!acc[severity]) {
      acc[severity] = [];
    }
    acc[severity].push(issue);
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

  // Filters and collapsible state
  const [activeFilter, setActiveFilter] = useState('all');
  const [collapsed, setCollapsed] = useState({ high: false, medium: false, low: false });

  const visibleSeverities = useMemo(() => {
    if (activeFilter === 'all') return severityOrder;
    return severityOrder.filter((s) => s === activeFilter);
  }, [activeFilter]);

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
              <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">High: {totals.high}</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">Medium: {totals.medium}</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">Low: {totals.low}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {['all', ...severityOrder].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveFilter(key)}
                className={`px-3 py-1 rounded-full text-sm border transition ${activeFilter === key ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                aria-pressed={activeFilter === key}
              >
                {key === 'all' ? 'All' : key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {visibleSeverities.map((severity) => {
        const issues = groupedIssues[severity] || [];
        if (issues.length === 0) return null;

        return (
          <div key={severity} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {severity} Severity Issues ({issues.length})
              </h2>
              <button
                type="button"
                onClick={() => setCollapsed((c) => ({ ...c, [severity]: !c[severity] }))}
                className="text-sm text-cyan-700 hover:text-cyan-800"
                aria-expanded={!collapsed[severity]}
                aria-controls={`section-${severity}`}
              >
                {collapsed[severity] ? 'Expand' : 'Collapse'}
              </button>
            </div>
            {!collapsed[severity] && (
              <div id={`section-${severity}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {issues.map((issue, index) => (
                  <IssueCard key={`${severity}-${index}`} issue={issue} />
                ))}
              </div>
            )}
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
