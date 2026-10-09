import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  GitFork,
  HelpCircle,
  Terminal,
  FileCode,
  Sparkles,
  Zap,
  Activity,
  X,
} from 'lucide-react';
import { useIdeStore } from '../../store/ideStore';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveTabRight,
    setActiveTabBottom,
    setLanguage,
    loadSnippet,
  } = useIdeStore();

  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const actions = [
    {
      category: 'Actions',
      items: [
        {
          id: 'flowchart',
          label: 'Show Control Flowchart',
          icon: <GitFork className="w-4 h-4 text-violet-400" />,
          action: () => {
            setActiveTabRight('flowchart');
            setIsCommandPaletteOpen(false);
          },
        },
        {
          id: 'explain',
          label: 'Explain Code & Complexity',
          icon: <HelpCircle className="w-4 h-4 text-cyan-400" />,
          action: () => {
            setActiveTabRight('explain');
            setIsCommandPaletteOpen(false);
          },
        },
        {
          id: 'chat',
          label: 'Open AI Coding Tutor Chat',
          icon: <Sparkles className="w-4 h-4 text-pink-400" />,
          action: () => {
            setActiveTabRight('chat');
            setIsCommandPaletteOpen(false);
          },
        },
        {
          id: 'complexity',
          label: 'Run Empirical Complexity Sweep',
          icon: <Activity className="w-4 h-4 text-emerald-400" />,
          action: () => {
            setActiveTabRight('complexity');
            setIsCommandPaletteOpen(false);
          },
        },
        {
          id: 'terminal',
          label: 'Open Real Shell Terminal',
          icon: <Terminal className="w-4 h-4 text-amber-400" />,
          action: () => {
            setActiveTabBottom('terminal');
            setIsCommandPaletteOpen(false);
          },
        },
      ],
    },
    {
      category: 'DSA Problem Library',
      items: [
        {
          id: 'load_binsearch',
          label: 'Load: Binary Search (C++)',
          icon: <FileCode className="w-4 h-4 text-blue-400" />,
          action: () => {
            loadSnippet('c++');
            setIsCommandPaletteOpen(false);
          },
        },
        {
          id: 'load_mergesort',
          label: 'Load: Merge Sort (JavaScript)',
          icon: <FileCode className="w-4 h-4 text-yellow-400" />,
          action: () => {
            loadSnippet('javascript');
            setIsCommandPaletteOpen(false);
          },
        },
        {
          id: 'load_fibonacci',
          label: 'Load: Fibonacci Memoization (Python)',
          icon: <FileCode className="w-4 h-4 text-emerald-400" />,
          action: () => {
            loadSnippet('python');
            setIsCommandPaletteOpen(false);
          },
        },
        {
          id: 'load_nqueens',
          label: 'Load: N-Queens Backtracking with Pruning',
          icon: <Zap className="w-4 h-4 text-purple-400" />,
          action: () => {
            loadSnippet('nqueens');
            setIsCommandPaletteOpen(false);
          },
        },
        {
          id: 'load_jobseq',
          label: 'Load: Greedy Job Sequencing with Deadlines',
          icon: <Zap className="w-4 h-4 text-rose-400" />,
          action: () => {
            loadSnippet('jobsequencing');
            setIsCommandPaletteOpen(false);
          },
        },
      ],
    },
    {
      category: 'Languages',
      items: [
        {
          id: 'lang_py',
          label: 'Switch to Python',
          icon: <span className="text-xs font-mono font-bold text-yellow-400">PY</span>,
          action: () => {
            setLanguage('python');
            setIsCommandPaletteOpen(false);
          },
        },
        {
          id: 'lang_cpp',
          label: 'Switch to C++',
          icon: <span className="text-xs font-mono font-bold text-blue-400">C++</span>,
          action: () => {
            setLanguage('c++');
            setIsCommandPaletteOpen(false);
          },
        },
        {
          id: 'lang_js',
          label: 'Switch to JavaScript',
          icon: <span className="text-xs font-mono font-bold text-amber-300">JS</span>,
          action: () => {
            setLanguage('javascript');
            setIsCommandPaletteOpen(false);
          },
        },
      ],
    },
  ];

  const filtered = actions
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-xl glass-panel bg-[#0d0d16]/95 overflow-hidden shadow-2xl border border-white/15 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center px-4 py-3 border-b border-white/10 gap-3">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search algorithms..."
            className="flex-1 bg-transparent text-sm text-[#f4f4f7] placeholder-[#9a9ab0] focus:outline-none"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="text-[#9a9ab0] hover:text-white p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action list */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-6 text-xs text-[#9a9ab0]">
              No matching commands found.
            </div>
          ) : (
            filtered.map((cat) => (
              <div key={cat.category}>
                <div className="text-[10px] font-semibold text-[#9a9ab0] uppercase px-3 py-1 tracking-wider">
                  {cat.category}
                </div>
                <div className="space-y-0.5">
                  {cat.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className="w-full px-3 py-2 text-xs rounded-lg hover:bg-white/10 flex items-center justify-between text-[#f4f4f7] transition text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[10px] text-[#9a9ab0]">Select ↵</span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between text-[10px] text-[#9a9ab0]">
          <span>Navigation: Up/Down</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
};
