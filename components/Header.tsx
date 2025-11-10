import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <a 
            href="https://abrobot.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-3xl font-extrabold text-cyan-600 hover:text-cyan-700 transition tracking-wider"
          >
            ABROBOT
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;