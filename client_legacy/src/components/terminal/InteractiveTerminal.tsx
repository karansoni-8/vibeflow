import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../api/client';
import { Terminal as TerminalIcon, CornerDownLeft, Trash2 } from 'lucide-react';

interface HistoryItem {
  id: string;
  type: 'command' | 'output' | 'error';
  text: string;
}

export function InteractiveTerminal() {
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'init-1',
      type: 'output',
      text: 'VibeFlow Developer Terminal v1.0.0 [Isolated Shell]\nType "help" for available commands (e.g. npm, pip, git, g++ --version, dir).',
    },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      if (!cmd) return;

      if (cmd === 'clear') {
        setHistory([]);
        setInput('');
        return;
      }

      // Add to command history
      setCommandHistory((prev) => [...prev, cmd]);
      setHistoryIndex(-1);

      // Append command to visual log
      setHistory((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, type: 'command', text: `$ ${cmd}` },
      ]);

      setInput('');
      setIsRunning(true);

      try {
        const res = await api.runTerminalCommand(cmd);
        if (res.stdout) {
          setHistory((prev) => [
            ...prev,
            { id: `out-${Date.now()}`, type: 'output', text: res.stdout },
          ]);
        }
        if (res.stderr) {
          setHistory((prev) => [
            ...prev,
            { id: `err-${Date.now()}`, type: 'error', text: res.stderr },
          ]);
        }
      } catch (err: any) {
        setHistory((prev) => [
          ...prev,
          { id: `err-${Date.now()}`, type: 'error', text: err.message || 'Execution failed.' },
        ]);
      } finally {
        setIsRunning(false);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    }
  };

  return (
    <div
      className="h-full flex flex-col bg-dark-950 font-mono text-xs overflow-hidden select-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Mini top bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-dark-900/60 border-b border-white/5 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Local Developer Terminal (cmd/sh)</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setHistory([]);
          }}
          className="p-1 hover:bg-dark-800 text-slate-400 hover:text-white rounded"
          title="Clear Terminal"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Terminal History */}
      <div className="flex-1 p-3 overflow-y-auto space-y-1">
        {history.map((item) => (
          <div
            key={item.id}
            className={`whitespace-pre-wrap leading-relaxed ${
              item.type === 'command'
                ? 'text-brand-cyan font-bold'
                : item.type === 'error'
                ? 'text-rose-400'
                : 'text-slate-300'
            }`}
          >
            {item.text}
          </div>
        ))}
        {isRunning && (
          <div className="flex items-center gap-2 text-slate-500 italic">
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
            Executing command...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Line */}
      <div className="flex items-center gap-2 px-3 py-2 bg-dark-900 border-t border-slate-800">
        <span className="text-brand-cyan font-bold select-none">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isRunning}
          placeholder={isRunning ? 'Waiting for process...' : 'Enter command (e.g. npm --version, pip list, git status)...'}
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none font-mono text-xs"
          autoFocus
        />
        <CornerDownLeft className="w-3.5 h-3.5 text-slate-500" />
      </div>
    </div>
  );
}
