import React, { useState } from 'react';
import { useIdeStore } from '@/store/ideStore';
import { Terminal as TermIcon, Play, AlertCircle, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export default function OutputPanel() {
  const [activeTab, setActiveTab] = useState<'output' | 'terminal' | 'errors' | 'ai'>('output');
  const { executionResult, isRunning, runCode, stopCode } = useIdeStore();
  const [stdin, setStdin] = useState('');
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<{cmd: string, out: string}[]>([]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && command.trim()) {
      setHistory([...history, { cmd: command, out: 'Command execution not implemented in mock' }]);
      setCommand('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0b0f17]">
      <div className="flex items-center border-b border-white/10 shrink-0 bg-[#06090e]">
        {[
          { id: 'output', label: 'OUTPUT', icon: Play },
          { id: 'terminal', label: 'TERMINAL', icon: TermIcon },
          { id: 'errors', label: 'ERRORS', icon: AlertCircle },
          { id: 'ai', label: 'AI ASSISTANT', icon: Sparkles },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors",
              activeTab === tab.id
                ? "text-white border-[#38bdf8] bg-white/5"
                : "text-white/50 border-transparent hover:text-white/80 hover:bg-white/5"
            )}
          >
            <tab.icon size={14} className={activeTab === tab.id ? "text-[#38bdf8]" : ""} />
            {tab.label}
          </button>
        ))}
        <div className="flex-1" />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        {activeTab === 'output' && (
          <div className="p-4 flex flex-col h-full font-mono text-sm">
            <div className="mb-4">
              <label className="text-xs text-white/50 uppercase block mb-1">Standard Input (stdin)</label>
              <textarea 
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                className="w-full bg-[#141c2b] border border-white/10 rounded p-2 text-white resize-none h-16 focus:border-[#38bdf8] focus:outline-none"
                placeholder="Enter input for your program here..."
              />
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <button onClick={runCode} disabled={isRunning} className="bg-[#10b981] hover:bg-[#10b981]/90 text-white px-3 py-1 rounded text-xs font-semibold disabled:opacity-50 flex items-center gap-1">
                <Play size={12} /> Run
              </button>
              {isRunning && (
                <button onClick={stopCode} className="bg-[#f43f5e] hover:bg-[#f43f5e]/90 text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1">
                  <X size={12} /> Stop
                </button>
              )}
            </div>

            <div className="flex-1 bg-[#06090e] border border-white/10 rounded p-3 text-white/90 overflow-y-auto">
              {isRunning ? (
                <span className="text-[#38bdf8] animate-pulse">Running...</span>
              ) : executionResult ? (
                <div>
                  <div className="text-white/50 mb-2">$ ./program</div>
                  {executionResult.stdout && <div className="whitespace-pre-wrap text-white">{executionResult.stdout}</div>}
                  {executionResult.stderr && <div className="whitespace-pre-wrap text-[#f43f5e] mt-2">{executionResult.stderr}</div>}
                  <div className={cn("mt-4 text-xs", executionResult.exitCode === 0 ? "text-[#10b981]" : "text-[#f43f5e]")}>
                    Process exited with code {executionResult.exitCode}
                    <span className="text-white/50 ml-2">({executionResult.executionTimeMs}ms)</span>
                  </div>
                </div>
              ) : (
                <span className="text-white/30 italic">No output yet. Run your code to see results.</span>
              )}
            </div>
          </div>
        )}

        {activeTab === 'terminal' && (
          <div className="p-4 font-mono text-sm h-full flex flex-col bg-[#06090e]">
            <div className="flex-1 overflow-y-auto space-y-1">
              <div className="text-white/50 mb-4">VibeFlow Terminal (Mock)</div>
              {history.map((h, i) => (
                <div key={i}>
                  <div className="text-white"><span className="text-[#38bdf8] mr-2">&gt;</span>{h.cmd}</div>
                  <div className="text-white/70 ml-4 mb-2">{h.out}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center mt-2 shrink-0">
              <span className="text-[#38bdf8] mr-2">&gt;</span>
              <input 
                type="text" 
                value={command}
                onChange={e => setCommand(e.target.value)}
                onKeyDown={handleCommand}
                className="flex-1 bg-transparent text-white outline-none"
                placeholder="Type a command..."
                autoFocus
              />
            </div>
          </div>
        )}

        {activeTab === 'errors' && (
          <div className="p-4 flex items-center justify-center h-full text-white/50 text-sm">
            No errors detected.
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="p-4 flex items-center justify-center h-full text-white/50 text-sm">
            AI Assistant Chat (Select text in editor to trigger actions)
          </div>
        )}
      </div>
    </div>
  );
}
