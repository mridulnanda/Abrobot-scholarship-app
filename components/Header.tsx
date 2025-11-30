import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-slate-100 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <a 
            href="https://www.abrobot.ai/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group flex items-center gap-3 focus:outline-none select-none"
            aria-label="Abrobot Home"
          >
            {/* Logo Icon Container */}
            <div className="relative w-12 h-12 flex items-center justify-center">
                {/* 1. Background Glow (Blue/Cyan) - Expands & Pulses on hover */}
                <div className="absolute inset-0 bg-cyan-500/10 rounded-full opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500 ease-out blur-lg group-hover:bg-blue-600/20 group-hover:animate-pulse"></div>

                {/* 2. Outer Rotating Ring (Dashed) - Cyan to Deep Blue */}
                <div className="absolute inset-0 border border-dashed border-cyan-400 rounded-full opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-110 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-180 group-hover:border-blue-600"></div>

                {/* 3. Inner Expanding Ring (Solid) - Blue to Darker Blue */}
                <div className="absolute inset-2 border border-blue-400 rounded-full opacity-0 group-hover:opacity-60 scale-50 group-hover:scale-100 transition-all duration-500 delay-75 ease-out group-hover:border-blue-800"></div>

                {/* 4. Main Icon - Hexagon Circuit */}
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-8 h-8 text-slate-700 group-hover:text-blue-800 transition-colors duration-300 z-10"
                >
                    {/* Hexagon Shape - Rotates on hover */}
                    <path 
                        d="M12 2l9 4.5v9l-9 4.5-9-4.5v-9z" 
                        className="origin-center transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-90 group-hover:scale-90 stroke-current"
                    />
                    
                    {/* Internal Circuit Lines - Sequentially appear on hover */}
                    <path d="M12 12v-4" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
                    <path d="M12 12l3.5 2" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150" />
                    <path d="M12 12l-3.5 2" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200" />
                    
                    {/* Center Node - Scales up */}
                    <circle cx="12" cy="12" r="2" className="fill-current opacity-0 group-hover:opacity-100 transition-all duration-300 delay-300 scale-0 group-hover:scale-100" stroke="none"/>
                    
                    {/* Decorative Dots on Hexagon Points - Subtle details */}
                    <circle cx="12" cy="2" r="1" className="fill-cyan-500 group-hover:fill-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-500 border-none" stroke="none" />
                    <circle cx="12" cy="22" r="1" className="fill-cyan-500 group-hover:fill-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-500 border-none" stroke="none" />
                </svg>
            </div>

            {/* Logo Text with Shimmer Gradient - Shifts to Deep Blue on Hover */}
            <div className="relative overflow-hidden">
                <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 via-cyan-500 to-slate-700 bg-[length:200%_auto] group-hover:bg-right transition-[background-position] duration-700 ease-in-out tracking-wide group-hover:via-blue-600">
                ABROBOT
                </span>
            </div>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;