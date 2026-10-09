import React, { useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  action: () => void;
  shortcut?: string;
  divider?: boolean;
  danger?: boolean;
}

export interface ContextMenuProps {
  items: ContextMenuItem[];
  children: ReactNode;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ items, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleClick = () => setIsOpen(false);
    const handleScroll = () => setIsOpen(false);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('click', handleClick);
      document.addEventListener('scroll', handleScroll, true);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    let x = e.clientX;
    let y = e.clientY;
    
    const menuWidth = 220;
    const menuHeight = items.length * 36;
    
    if (x + menuWidth > window.innerWidth) x -= menuWidth;
    if (y + menuHeight > window.innerHeight) y -= menuHeight;
    
    setPosition({ x, y });
    setIsOpen(true);
  };

  return (
    <>
      <div onContextMenu={handleContextMenu} className="w-full h-full">
        {children}
      </div>
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              style={{ top: position.y, left: position.x }}
              className="fixed z-[9999] min-w-[220px] py-1.5 rounded-lg bg-[#141c2b]/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {items.map((item, idx) => {
                if (item.divider) {
                  return <div key={`divider-${idx}`} className="h-px bg-white/10 my-1.5 mx-2" />;
                }
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      item.action();
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-1.5 text-sm transition-colors",
                      item.danger 
                        ? "text-red-400 hover:bg-red-500/10" 
                        : "text-slate-300 hover:bg-white/10 hover:text-slate-100"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon && <span className="opacity-70">{item.icon}</span>}
                      {item.label}
                    </div>
                    {item.shortcut && (
                      <span className="text-xs opacity-50 font-mono">{item.shortcut}</span>
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
