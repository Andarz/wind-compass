
import React from 'react';

interface CompassProps {
  direction: number;
}

const Compass: React.FC<CompassProps> = ({ direction }) => {
  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Compass Base */}
        <circle cx="100" cy="100" r="98" fill="none" stroke="#4a5568" strokeWidth="2" />
        <circle cx="100" cy="100" r="90" fill="#1a202c" />

        {/* Cardinal Directions */}
        <text x="100" y="22" textAnchor="middle" fill="#e2e8f0" fontSize="16" fontWeight="bold" className="font-mono">N</text>
        <text x="180" y="105" textAnchor="middle" fill="#a0aec0" fontSize="16" className="font-mono">E</text>
        <text x="100" y="188" textAnchor="middle" fill="#a0aec0" fontSize="16" className="font-mono">S</text>
        <text x="20" y="105" textAnchor="middle" fill="#a0aec0" fontSize="16" className="font-mono">W</text>

         {/* Tick marks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = i * 30;
          const isCardinal = i % 3 === 0;
          return (
            <line
              key={i}
              x1="100"
              y1="10"
              x2="100"
              y2={isCardinal ? "20" : "15"}
              stroke="#4a5568"
              strokeWidth="2"
              transform={`rotate(${angle} 100 100)`}
            />
          );
        })}

        {/* Needle Group */}
        <g 
          style={{ transform: `rotate(${direction}deg)` }} 
          className="transform-origin-center transition-transform duration-1000 ease-in-out"
        >
          {/* Red part of needle (points direction) */}
          <polygon points="100,15 108,100 92,100" fill="#ef4444" />
          {/* Grey part of needle */}
          <polygon points="100,185 108,100 92,100" fill="#a0aec0" />
          {/* Center circle */}
          <circle cx="100" cy="100" r="5" fill="#e2e8f0" stroke="#1a202c" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
};

export default Compass;
