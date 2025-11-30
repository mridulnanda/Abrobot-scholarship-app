import React, { useState, useEffect } from 'react';
import { ExternalLinkIcon } from './Icons';

const ContactPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup shortly after the component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500); // Reduced delay for faster appearance

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-slideUp border border-slate-100 relative">
        
        {/* Decorative Header with Gradient */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 h-28 flex items-center justify-center relative">
             {/* Floating Logo Badge - Text Based */}
             <div className="absolute -bottom-6 bg-white rounded-full shadow-xl border-4 border-white px-8 py-2 flex items-center justify-center">
                <span className="text-xl font-extrabold tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 to-blue-600">
                    ABROBOT
                </span>
             </div>
             
             {/* Close Button */}
             <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 transition-colors backdrop-blur-md"
                aria-label="Close popup"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div className="pt-12 pb-8 px-8 text-center">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-1 mt-2">
            Get Perfect Guidance
          </h2>
          <p className="text-cyan-600 font-semibold text-sm mb-4 uppercase tracking-wide">
            For Your Study Abroad Journey
          </p>
          
          <p className="text-slate-600 mb-8 text-sm leading-relaxed">
            You are one step closer to your dream university. For a comprehensive experience, AI-driven insights, and personalized mentorship, connect with us today.
          </p>

          <div className="flex flex-col gap-3">
            {/* Primary Action: Contact Us */}
            <a 
              href="https://www.abrobot.ai/contactus" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-full py-3.5 px-6 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>Contact Our Experts</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            
            {/* Secondary Action: Visit Website */}
            <a 
              href="https://www.abrobot.ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full py-3.5 px-6 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:border-cyan-500 hover:text-cyan-600 transition-all duration-300"
            >
              Visit AbroBot.ai <ExternalLinkIcon />
            </a>
          </div>
          
          <button 
            onClick={() => setIsVisible(false)}
            className="mt-6 text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactPopup;