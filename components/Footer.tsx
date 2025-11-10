import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white p-4 sticky bottom-0 z-10 shadow-inner-top">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
        <p className="text-sm text-slate-400 mb-2 sm:mb-0">
          Need expert guidance? Let Abrobot help you on your journey.
        </p>
        <a
          href="https://abrobot.com/contact-us"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
        >
          Contact Us
        </a>
      </div>
    </footer>
  );
};

export default Footer;
