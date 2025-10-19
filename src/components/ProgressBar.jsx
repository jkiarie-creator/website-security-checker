import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ progress = 0 }) => {
  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div 
        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired
};

export default ProgressBar;
