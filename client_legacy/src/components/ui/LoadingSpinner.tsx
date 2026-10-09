import React from 'react';
import { cn } from '@/lib/cn';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text, 
  className 
}) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div 
        className={cn(
          "rounded-full border-white/10 border-t-cyan-500 animate-spin",
          sizes[size]
        )}
      />
      {text && (
        <span className="text-sm font-medium text-slate-400 animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
};
