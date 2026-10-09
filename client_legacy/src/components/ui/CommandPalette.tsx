import React, { useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command as CommandIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { create } from 'zustand';

export interface Command {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string[];
  action: () => void;
}

interface CommandStore {
  commands: Command[];
  isOpen: boolean;
  registerCommand: (cmd: Command) => void;
  unregisterCommand: (id: string) => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useCommandStore = create<CommandStore>((set) => ({
  commands: [],
  isOpen: false,
  registerCommand: (cmd) => set((state) => ({ commands: [...state.commands.filter(c => c.id !== cmd.id), cmd] })),
  unregisterCommand: (id) => set((state) => ({ commands: state.commands.filter(c => c.id !== id) })),
  setIsOpen: (isOpen) => set({ isOpen }),
}));

export const CommandPaletteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isOpen, setIsOpen, commands } = useCommandStore();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <>
      {children}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-[#06090e]/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="relative z-50 w-full max-w-2xl rounded-xl bg-[#0b0f17]/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="flex items-center border-b border-white/10 px-4 py-3">
                  <Search className="text-slate-400 mr-3" size={20} />
                  <input
                    autoFocus
                    placeholder="Type a command or search..."
                    className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none text-lg"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="hidden sm:flex text-xs text-slate-500 gap-1 font-mono bg-white/5 px-2 py-1 rounded">
                    <span>esc</span> to close
                  </div>
                </div>
                <div className="max-h-[60vh] overflow-y-auto py-2">
                  {filteredCommands.length === 0 ? (
                    <div className="px-4 py-8 text-center text-slate-500">
                      No commands found.
                    </div>
                  ) : (
                    filteredCommands.map((cmd, idx) => (
                      <div
                        key={cmd.id}
                        onClick={() => {
                          cmd.action();
                          setIsOpen(false);
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 cursor-pointer select-none transition-colors",
                          idx === selectedIndex ? "bg-cyan-500/10 text-cyan-400" : "text-slate-300 hover:bg-white/5"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {cmd.icon ? cmd.icon : <CommandIcon size={16} />}
                          <span className="font-medium">{cmd.label}</span>
                        </div>
                        {cmd.shortcut && (
                          <div className="flex gap-1">
                            {cmd.shortcut.map(key => (
                              <kbd key={key} className="px-1.5 py-0.5 text-xs font-mono bg-white/10 rounded text-slate-400">
                                {key}
                              </kbd>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
