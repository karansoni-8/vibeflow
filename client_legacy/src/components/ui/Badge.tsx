import React from 'react';
import { cn } from '@/lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'default', 
  children, 
  className,
  ...props 
}) => {
  const variants = {
    default: "bg-slate-500/10 text-slate-300 border-slate-500/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
    info: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
