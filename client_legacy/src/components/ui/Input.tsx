import React, { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  textarea?: boolean;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ className, label, error, icon, textarea = false, ...props }, ref) => {
    const Component = textarea ? 'textarea' : 'input';
    
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {icon}
            </div>
          )}
          <Component
            ref={ref as any}
            className={cn(
              "w-full rounded-md bg-[#0b0f17]/50 backdrop-blur-sm border border-white/10 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500/50 transition-colors shadow-inner",
              icon && "pl-10",
              textarea && "min-h-[80px] resize-y",
              error && "border-red-500/50 focus:ring-red-500 focus:border-red-500/50",
              className
            )}
            {...(props as any)}
          />
        </div>
        {error && (
          <span className="text-xs text-red-400 mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
