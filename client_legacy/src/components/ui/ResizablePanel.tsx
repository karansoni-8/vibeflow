import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

export interface ResizablePanelProps {
  direction?: 'horizontal' | 'vertical';
  initialSize?: number;
  minSize?: number;
  maxSize?: number;
  panelA: React.ReactNode;
  panelB: React.ReactNode;
  className?: string;
  onSizeChange?: (size: number) => void;
}

export const ResizablePanel: React.FC<ResizablePanelProps> = ({
  direction = 'horizontal',
  initialSize = 50,
  minSize = 10,
  maxSize = 90,
  panelA,
  panelB,
  className,
  onSizeChange
}) => {
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      let newSize = 0;
      
      if (direction === 'horizontal') {
        const x = e.clientX - rect.left;
        newSize = (x / rect.width) * 100;
      } else {
        const y = e.clientY - rect.top;
        newSize = (y / rect.height) * 100;
      }
      
      newSize = Math.max(minSize, Math.min(newSize, maxSize));
      setSize(newSize);
      if (onSizeChange) onSizeChange(newSize);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isDragging, direction, minSize, maxSize, onSizeChange]);

  const isHorizontal = direction === 'horizontal';

  return (
    <div 
      ref={containerRef}
      className={cn("flex w-full h-full overflow-hidden", isHorizontal ? "flex-row" : "flex-col", className)}
    >
      <div 
        style={{ [isHorizontal ? 'width' : 'height']: `${size}%` }}
        className="relative flex-shrink-0"
      >
        {panelA}
      </div>
      
      <div
        onMouseDown={() => setIsDragging(true)}
        className={cn(
          "relative flex items-center justify-center transition-colors hover:bg-cyan-500/30 active:bg-cyan-500/50 z-10",
          isHorizontal ? "w-1 cursor-col-resize" : "h-1 cursor-row-resize",
          isDragging ? "bg-cyan-500/50" : "bg-white/10"
        )}
      >
        <div className={cn("absolute", isHorizontal ? "inset-y-0 -inset-x-2" : "inset-x-0 -inset-y-2")} />
      </div>
      
      <div 
        style={{ [isHorizontal ? 'width' : 'height']: `${100 - size}%` }}
        className="relative flex-1"
      >
        {panelB}
      </div>
    </div>
  );
};
