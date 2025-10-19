import PropTypes from 'prop-types';

const ProgressBar = ({ progress = 0 }) => {
  return (
    <div className="w-full max-w-md mx-auto p-4">
      {/* Container with cyber theme border */}
      <div className="relative border-2 border-cyan-400 bg-gray-900 p-1 rounded-lg 
                    shadow-[0_0_10px_rgba(34,211,238,0.3)] backdrop-blur-sm">
        {/* Progress bar background with grid effect */}
        <div className="h-8 bg-gray-800 rounded overflow-hidden 
                      bg-[linear-gradient(90deg,rgba(16,24,39,0.8)_2px,transparent_2px),linear-gradient(rgba(16,24,39,0.8)_2px,transparent_2px)]
                      bg-[size:20px_20px]">
          {/* Animated progress fill */}
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 
                     transition-all duration-500 ease-out relative
                     shadow-[0_0_20px_rgba(34,211,238,0.5)]"
            style={{ width: `${progress}%` }}
          >
            {/* Scanning line effect */}
            <div className="absolute top-0 right-0 w-1 h-full 
                          bg-white opacity-75 animate-[scan_1.5s_ease-in-out_infinite]" />
          </div>
        </div>

        {/* Percentage display */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="font-orbitron text-lg text-cyan-400 font-bold 
                         tracking-wider drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number
};

export default ProgressBar;
