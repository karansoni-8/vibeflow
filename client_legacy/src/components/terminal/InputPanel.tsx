import React from 'react';
import { Keyboard, ArrowDownToLine, Sparkles } from 'lucide-react';

interface InputPanelProps {
  input: string;
  onChange: (val: string) => void;
  onSetPreset?: (preset: string) => void;
}

export function InputPanel({ input, onChange }: InputPanelProps) {
  const presets = [
    { label: 'Binary Search (n=5, target=30)', value: '5\n10 20 30 40 50\n30' },
    { label: 'Binary Search (target=10, Best)', value: '5\n10 20 30 40 50\n10' },
    { label: 'Merge Sort (n=6 random)', value: '6\n45 12 89 23 7 60' },
    { label: 'N-Queens (n=4)', value: '4' },
    { label: 'Fibonacci (n=15)', value: '15' },
  ];

  return (
    <div className="h-full flex flex-col bg-dark-950 font-mono text-xs overflow-hidden">
      {/* Presets Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-dark-900 border-b border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <Keyboard className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Standard Input (stdin)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-500 mr-1">Quick Presets:</span>
          {presets.slice(0, 3).map((p, idx) => (
            <button
              key={idx}
              onClick={() => onChange(p.value)}
              className="px-2 py-0.5 rounded bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-brand-cyan text-[10px] transition-colors border border-white/5"
            >
              {p.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Multiline Textarea */}
      <div className="flex-1 p-3">
        <textarea
          value={input}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter program input for stdin here...\nExample:\n5\n10 20 30 40 50\n30`}
          className="w-full h-full bg-dark-900/70 border border-slate-800 rounded-md p-3 text-slate-200 font-mono text-xs focus:outline-none focus:border-brand-cyan/50 resize-none"
        />
      </div>

      <div className="px-3 py-1.5 bg-dark-900/60 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center gap-1.5">
        <ArrowDownToLine className="w-3 h-3 text-slate-400" />
        This content is piped directly to <code className="text-cyan-400 font-bold">cin / sys.stdin</code> during program execution.
      </div>
    </div>
  );
}
