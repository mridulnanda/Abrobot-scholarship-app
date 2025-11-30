import React from 'react';

const AnimatedLogo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-20 h-20 flex items-center justify-center mb-2 group cursor-default">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-cyan-400 rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>
        
        {/* Main Icon */}
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-full h-full text-cyan-600 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform group-hover:rotate-180 group-hover:text-blue-500 z-10 drop-shadow-sm"
        >
            {/* Central Hub */}
            <circle cx="12" cy="12" r="3" className="fill-transparent group-hover:fill-cyan-50 transition-colors duration-500" strokeWidth="1.5"></circle>
            
            {/* Outer Gear Mechanism */}
            <path d="M19.4 15a1.1 1.1 0 0 0 .33 1.21l1.11 1.11a1.21 1.21 0 0 1-1.72 1.72l-1.11-1.11A1.1 1.1 0 0 0 16.82 18a9.02 9.02 0 0 1-9.64 0 1.1 1.1 0 0 0-1.21.33l-1.11 1.11a1.21 1.21 0 0 1-1.72-1.72l1.11-1.11A1.1 1.1 0 0 0 4.6 15a9.02 9.02 0 0 1 0-9.64 1.1 1.1 0 0 0-.33-1.21L3.16 3.04a1.21 1.21 0 0 1 1.72-1.72l1.11 1.11A1.1 1.1 0 0 0 7.18 2.18a9.02 9.02 0 0 1 9.64 0 1.1 1.1 0 0 0 1.21-.33l1.11-1.11a1.21 1.21 0 0 1 1.72 1.72l-1.11 1.11A1.1 1.1 0 0 0 19.4 6a9.02 9.02 0 0 1 0 9Z"></path>
        </svg>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 tracking-wider mb-1">
            ABROBOT
        </h1>
        <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
            Scholarship Finder
        </p>
      </div>
    </div>
  );
};

export default AnimatedLogo;