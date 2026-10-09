import React, { useState } from 'react';
import { api } from '../../api/client';
import { Sparkles, Wand2, ArrowRight, X, Check, Code, GitBranch, Cpu, ListChecks } from 'lucide-react';

interface VibeModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
  onApplyVibeCode: (code: string) => void;
}

export function VibeModeModal({
  isOpen,
  onClose,
  currentLanguage,
  onApplyVibeCode,
}: VibeModeModalProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'idle' | 'generating' | 'ready'>('idle');
  const [generatedCode, setGeneratedCode] = useState('');
  const [selectedLang, setSelectedLang] = useState(currentLanguage || 'cpp');

  if (!isOpen) return null;

  const vibeTemplates = [
    'Create a program that takes student marks, calculates average, and displays grades',
    'Implement Dijkstra shortest path algorithm with priority queue',
    'Build a LRU cache data structure with O(1) get and put operations',
    'Solve the 0/1 knapsack problem using dynamic programming with a traceback',
  ];

  const handleGenerate = async (preset?: string) => {
    const p = preset || prompt;
    if (!p.trim()) return;

    setLoading(true);
    setStep('generating');

    try {
      const res = await api.aiGenerateCode(
        `Write a complete, runnable ${selectedLang} program for: "${p}". Include sample input reading and friendly console outputs.`,
        selectedLang
      );
      setGeneratedCode(res.code);
      setStep('ready');
    } catch (err: any) {
      alert(`Generation failed: ${err.message}`);
      setStep('idle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-brand-purple/40 w-full max-w-3xl rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-950/50 via-dark-850 to-dark-900 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-purple-600 to-cyan-500 rounded-lg text-white shadow-glow-purple">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Vibe Coding Mode</h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                  Intent to Architecture
                </span>
              </div>
              <p className="text-xs text-slate-400">Describe your idea in natural language. VibeFlow handles the rest.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto font-sans text-xs">
          {step !== 'ready' ? (
            <>
              {/* Language Selection */}
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-mono text-xs">Target Language:</span>
                {(['cpp', 'python', 'javascript'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`px-3 py-1 rounded-md font-mono text-xs uppercase border transition-all ${
                      selectedLang === lang
                        ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan font-bold shadow-glow-cyan'
                        : 'bg-dark-850 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang === 'cpp' ? 'C++' : lang === 'python' ? 'Python' : 'JavaScript'}
                  </button>
                ))}
              </div>

              {/* Prompt Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Describe what you want to build:</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. I want a program that reads an array of integers, finds the maximum subarray sum using Kadane's algorithm, and prints the subarray indices..."
                  rows={4}
                  className="w-full bg-dark-950 border border-slate-800 rounded-lg p-3 text-slate-100 font-sans text-xs focus:outline-none focus:border-brand-cyan/50 resize-none"
                />
              </div>

              {/* Inspiration Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-500 font-mono">Popular Vibe Ideas:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {vibeTemplates.map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setPrompt(t);
                        handleGenerate(t);
                      }}
                      className="p-2.5 text-left rounded-lg bg-dark-850 hover:bg-dark-800 border border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white text-[11px] transition-all"
                    >
                      💡 {t}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Ready Preview */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono text-xs">
                  <Check className="w-4 h-4" /> Vibe Code Generated Successfully
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Applying will also trigger flowchart & complexity analysis
                </span>
              </div>

              <pre className="p-4 bg-dark-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs max-h-[350px] overflow-y-auto whitespace-pre-wrap">
                {generatedCode}
              </pre>

              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-400">
                <div className="p-2 rounded bg-dark-850 border border-white/5 flex items-center gap-2">
                  <GitBranch className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Flowchart Ready</span>
                </div>
                <div className="p-2 rounded bg-dark-850 border border-white/5 flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  <span>Complexity Auto-derived</span>
                </div>
                <div className="p-2 rounded bg-dark-850 border border-white/5 flex items-center gap-2">
                  <ListChecks className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Test cases ready</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-dark-850 border-t border-slate-800">
          <button
            onClick={() => {
              if (step === 'ready') setStep('idle');
              else onClose();
            }}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            {step === 'ready' ? 'Back' : 'Cancel'}
          </button>

          {step !== 'ready' ? (
            <button
              onClick={() => handleGenerate()}
              disabled={loading || !prompt.trim()}
              className="px-5 py-2 text-xs font-bold text-dark-950 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 hover:opacity-90 rounded-lg shadow-glow-purple flex items-center gap-2 transition-all disabled:opacity-30"
            >
              <Wand2 className="w-4 h-4" />
              {loading ? 'Synthesizing Architecture...' : 'Generate with Vibe Mode'}
            </button>
          ) : (
            <button
              onClick={() => {
                onApplyVibeCode(generatedCode);
                onClose();
              }}
              className="px-6 py-2 text-xs font-bold text-dark-950 bg-gradient-to-r from-brand-cyan to-brand-blue hover:opacity-90 rounded-lg shadow-glow-cyan flex items-center gap-2 transition-all"
            >
              <Check className="w-4 h-4" />
              Apply to Workspace
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
