import React, { useState, useEffect } from 'react';
import { UserCircleIcon } from './Icons';

const ContactPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup after a short delay to ensure the page has loaded visually
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-slideUp border border-slate-100">
        <div className="relative p-8 text-center">
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1"
            aria-label="Close popup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mx-auto w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
            <UserCircleIcon />
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Start Your Journey Right!
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Need personalized advice on universities, scholarships, or visa processes? Connect with our expert consultants today.
          </p>

          <div className="space-y-3">
            <a 
              href="https://www.abrobot.ai/contactus" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full py-3.5 px-6 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Contact Our Experts
            </a>
            <button 
              onClick={() => setIsVisible(false)}
              className="block w-full py-3 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
            >
              No thanks, I'll browse first
            </button>
          </div>
        </div>
        <div className="bg-slate-50 px-8 py-3 text-xs text-center text-slate-400 border-t border-slate-100">
          Trusted by thousands of students globally.
        </div>
      </div>
    </div>
  );
};

export default ContactPopup;