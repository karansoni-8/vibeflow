import React from 'react';
import { cn } from '../../lib/cn';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 24, className }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]", className)}
    >
      <defs>
        <linearGradient id="vibeGradient" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      
      {/* Outer abstract shape */}
      <path 
        d="M50 15L85 35V65L50 85L15 65V35L50 15Z" 
        stroke="url(#vibeGradient)" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Inner Flow/V shape */}
      <path 
        d="M30 40L50 65L70 40" 
        stroke="url(#vibeGradient)" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Nodes */}
      <circle cx="30" cy="40" r="5" fill="#38bdf8" />
      <circle cx="70" cy="40" r="5" fill="#a855f7" />
      <circle cx="50" cy="65" r="5" fill="#fff" />
    </svg>
  );
};

export const LogoFull: React.FC<LogoProps> = ({ size = 32, className }) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Logo size={size} />
      <span 
        className="font-bold tracking-tight text-white"
        style={{ fontSize: size * 0.75 }}
      >
        VibeFlow
      </span>
    </div>
  );
};
