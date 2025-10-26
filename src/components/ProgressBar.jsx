import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const ProgressBar = ({ progress = 0, state = 'scanning' }) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const isScanning = state === 'scanning';

  // Smooth progress animation
  useEffect(() => {
    const animateProgress = () => {
      setDisplayProgress(prev => {
        const diff = progress - prev;
        // If the difference is small, jump to the target
        if (Math.abs(diff) < 0.5) return progress;
        // Otherwise, animate smoothly
        return prev + diff * 0.3;
      });
    };

    const animationFrame = requestAnimationFrame(animateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [progress]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 transition-all duration-300">
      {/* Container with cyber theme border */}
      <div className={`relative border-2 ${isScanning ? 'border-cyan-400' : 'border-green-400'} 
                    bg-gray-900 p-1 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300
                    ${isScanning ? 'shadow-cyan-500/20' : 'shadow-green-500/20'}`}>
        
        {/* Progress bar background with grid effect */}
        <div className="h-8 bg-gray-800 rounded overflow-hidden 
                      bg-[linear-gradient(90deg,rgba(16,24,39,0.8)_2px,transparent_2px),linear-gradient(rgba(16,24,39,0.8)_2px,transparent_2px)]
                      bg-[size:20px_20px] relative">
          
          {/* Animated progress fill */}
          <div 
            className={`h-full transition-all duration-300 ease-out relative overflow-hidden
                      ${isScanning 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_20px_rgba(34,211,238,0.5)]' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]'}`}
            style={{ width: `${displayProgress}%` }}
          >
            {/* Scanning line effect */}
            {isScanning && (
              <div className="absolute top-0 right-0 w-1 h-full 
                          bg-white/80 animate-pulse" />
            )}
            
            {/* Pulsing glow effect when scanning */}
            {isScanning && (
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            )}
          </div>
          
          {/* Progress text with animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`font-orbitron text-lg font-bold tracking-wider 
                           ${isScanning ? 'text-cyan-300' : 'text-green-300'} 
                           drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-colors duration-300`}>
              {Math.round(displayProgress)}%
              {isScanning && (
                <span className="ml-2 text-xs font-normal">
                  Scanning...
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
      
      {/* Additional status indicators */}
      {progress > 0 && progress < 100 && (
        <div className="mt-3 text-center">
          <div className="text-xs text-gray-400">
            {progress < 20 && 'Initializing scanner...'}
            {progress >= 20 && progress < 40 && 'Crawling website structure...'}
            {progress >= 40 && progress < 60 && 'Analyzing security headers...'}
            {progress >= 60 && progress < 80 && 'Testing for vulnerabilities...'}
            {progress >= 80 && progress < 100 && 'Finalizing scan results...'}
          </div>
        </div>
      )}
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number,
  state: PropTypes.oneOf(['scanning', 'completed', 'error'])
};

export default ProgressBar;
