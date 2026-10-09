import os

base_dir = r"C:\Users\devel\.gemini\antigravity\scratch\vibeflow\client\src"

files = {
    "components/complexity/ComplexityPanel.tsx": """import React from 'react';
import { useIdeStore } from '@/store/ideStore';
import { Loader2, Clock, HardDrive, Info } from 'lucide-react';

export default function ComplexityPanel() {
  const { complexityData, isAnalyzingComplexity, settings } = useIdeStore();

  if (isAnalyzingComplexity) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-[#38bdf8] bg-[#0b0f17]">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p>Analyzing complexity...</p>
      </div>
    );
  }

  if (!complexityData) {
    return (
      <div className="h-full flex items-center justify-center text-white/50 px-8 text-center bg-[#0b0f17]">
        Click "Analyze Complexity" to analyze your code
      </div>
    );
  }

  const getComplexityColor = (comp: string) => {
    if (comp.includes('1') || comp.includes('log')) return 'text-[#10b981]';
    if (comp.includes('n')) return 'text-[#eab308]';
    if (comp.includes('^2') || comp.includes('^3')) return 'text-[#f97316]';
    return 'text-[#f43f5e]';
  };

  return (
    <div className="h-full flex flex-col bg-[#0b0f17] overflow-y-auto custom-scrollbar p-4 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Algorithm Identification</h2>
        <p className="text-[#38bdf8] font-medium">{complexityData.algorithm}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#141c2b] border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4 text-white/80 border-b border-white/10 pb-2">
            <Clock size={18} />
            <h3 className="font-semibold">Time Complexity</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Best Case</span>
              <span className={`font-mono font-bold ${getComplexityColor(complexityData.time.best)}`}>{complexityData.time.best}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Average Case</span>
              <span className={`font-mono font-bold ${getComplexityColor(complexityData.time.average)}`}>{complexityData.time.average}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Worst Case</span>
              <span className={`font-mono font-bold ${getComplexityColor(complexityData.time.worst)}`}>{complexityData.time.worst}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#141c2b] border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4 text-white/80 border-b border-white/10 pb-2">
            <HardDrive size={18} />
            <h3 className="font-semibold">Space Complexity</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Best Case</span>
              <span className={`font-mono font-bold ${getComplexityColor(complexityData.space.best)}`}>{complexityData.space.best}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Average Case</span>
              <span className={`font-mono font-bold ${getComplexityColor(complexityData.space.average)}`}>{complexityData.space.average}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Worst Case</span>
              <span className={`font-mono font-bold ${getComplexityColor(complexityData.space.worst)}`}>{complexityData.space.worst}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#141c2b] border border-white/10 rounded-lg p-4">
        <h3 className="font-semibold text-white/80 mb-2">Analysis</h3>
        <p className="text-sm text-white/70 leading-relaxed">{complexityData.explanation}</p>
      </div>

      <div className="bg-[#141c2b] border border-white/10 rounded-lg p-4">
        <h3 className="font-semibold text-white/80 mb-2">Input Sensitivity</h3>
        <p className="text-sm text-white/70 leading-relaxed">{complexityData.inputSensitivity}</p>
      </div>

      {settings?.beginnerMode && (
        <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2 text-[#10b981]">
            <Info size={18} />
            <h3 className="font-semibold">Beginner Explanation</h3>
          </div>
          <p className="text-sm text-[#10b981]/80 leading-relaxed">
            Time complexity is like asking "how much longer does this take if I give it more data?" 
            Space complexity asks "how much more memory does this need if I give it more data?"
            <br/><br/>
            O(1) means it's instant no matter what. O(n) means if you double the data, it takes twice as long.
          </p>
        </div>
      )}
    </div>
  );
}
""",
    "components/terminal/OutputPanel.tsx": """import React, { useState } from 'react';
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
"""
}

for path, content in files.items():
    full_path = os.path.join(base_dir, path.replace('/', os.sep))
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
