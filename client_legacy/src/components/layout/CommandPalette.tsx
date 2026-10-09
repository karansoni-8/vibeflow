import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Play,
  Sparkles,
  GitBranch,
  Cpu,
  Wrench,
  ListChecks,
  Wand2,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onRun: () => void;
  onExplain: () => void;
  onFlowchart: () => void;
  onComplexity: () => void;
  onImprove: () => void;
  onTests: () => void;
  onVibe: () => void;
  onSettings: () => void;
  onToggleBeginner: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onRun,
  onExplain,
  onFlowchart,
  onComplexity,
  onImprove,
  onTests,
  onVibe,
  onSettings,
  onToggleBeginner,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = [
    { id: 'run', label: 'Run Program', shortcut: 'Ctrl+Enter', icon: Play, action: onRun },
    { id: 'vibe', label: 'Vibe Mode: Generate from Intent', shortcut: '', icon: Wand2, action: onVibe },
    { id: 'flowchart', label: 'Generate / Refresh Flowchart', shortcut: '', icon: GitBranch, action: onFlowchart },
    { id: 'complexity', label: 'Analyze Asymptotic & Input Complexity', shortcut: '', icon: Cpu, action: onComplexity },
    { id: 'explain', label: 'Explain Code Step-by-Step', shortcut: '', icon: Sparkles, action: onExplain },
    { id: 'improve', label: 'Improve & Optimize Code (Diff View)', shortcut: '', icon: Wrench, action: onImprove },
    { id: 'tests', label: 'Generate & Run Test Cases', shortcut: '', icon: ListChecks, action: onTests },
    { id: 'beginner', label: 'Toggle Beginner Mode', shortcut: '', icon: HelpCircle, action: onToggleBeginner },
    { id: 'settings', label: 'Open Settings', shortcut: '', icon: Settings, action: onSettings },
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-24 p-4"
      onClick={onClose}
    >
      <div
        className="bg-dark-900 border border-slate-700 w-full max-w-xl rounded-xl shadow-2xl overflow-hidden font-mono text-xs animate-in fade-in zoom-in duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-dark-850">
          <Search className="w-4 h-4 text-brand-cyan" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search action..."
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-xs font-mono"
          />
          <kbd className="px-2 py-0.5 rounded bg-dark-950 border border-white/10 text-[10px] text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-xs">No matching commands.</div>
          ) : (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-brand-cyan/15 text-brand-cyan font-bold border-l-2 border-brand-cyan'
                      : 'text-slate-300 hover:bg-dark-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-cyan' : 'text-slate-500'}`} />
                    <span>{cmd.label}</span>
                  </div>

                  {cmd.shortcut && (
                    <kbd className="px-1.5 py-0.5 rounded bg-dark-950 border border-white/10 text-[10px] text-slate-400 font-mono">
                      {cmd.shortcut}
                    </kbd>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
