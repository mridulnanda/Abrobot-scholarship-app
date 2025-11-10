import React from 'react';

const AnimatedLogo: React.FC = () => {
  return (
    <svg width="32" height="32" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <style>
        {`
          .ring {
            stroke: #0891b2; /* cyan-600 */
            stroke-width: 3;
            transform-origin: 50% 50%;
            animation: rotate 4s linear infinite;
          }
          .letter {
            font-family: monospace, sans-serif;
            font-size: 24px;
            font-weight: bold;
            fill: #06b6d4; /* cyan-500 */
            animation: fade-in 2s ease-in-out;
          }
          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
      </style>
      <circle className="ring" cx="20" cy="20" r="17" fill="none" strokeDasharray="80 25" />
      <text x="50%" y="50%" dy=".3em" textAnchor="middle" className="letter">
        A
      </text>
    </svg>
  );
};

export default AnimatedLogo;
