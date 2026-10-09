import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top', 
  delay = 300,
  className 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  let timeout: NodeJS.Timeout;

  const show = () => {
    timeout = setTimeout(() => setIsVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timeout);
    setIsVisible(false);
  };

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "bottom-[-4px] left-1/2 -translate-x-1/2 border-t-[#141c2b] border-l-transparent border-r-transparent border-b-transparent",
    bottom: "top-[-4px] left-1/2 -translate-x-1/2 border-b-[#141c2b] border-l-transparent border-r-transparent border-t-transparent",
    left: "right-[-4px] top-1/2 -translate-y-1/2 border-l-[#141c2b] border-t-transparent border-b-transparent border-r-transparent",
    right: "left-[-4px] top-1/2 -translate-y-1/2 border-r-[#141c2b] border-t-transparent border-b-transparent border-l-transparent",
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 px-2.5 py-1.5 text-xs font-medium text-slate-200 whitespace-nowrap bg-[#141c2b] border border-white/10 rounded shadow-xl",
              positionClasses[position],
              className
            )}
          >
            {content}
            <div className={cn(
              "absolute w-0 h-0 border-[5px]",
              arrowClasses[position]
            )} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
