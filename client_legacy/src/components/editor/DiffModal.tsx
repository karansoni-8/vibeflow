import React from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { CodeImprovement } from '../../types';
import { Sparkles, Check, X, ArrowRight, Zap } from 'lucide-react';

interface DiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalCode: string;
  improvement: CodeImprovement | null;
  language: string;
  onApply: (newCode: string) => void;
}

export function DiffModal({
  isOpen,
  onClose,
  originalCode,
  improvement,
  language,
  onApply,
}: DiffModalProps) {
  if (!isOpen || !improvement) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-slate-700 w-full max-w-5xl h-[85vh] rounded-xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-dark-850">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20">
              <Sparkles className="w-5 h-5 text-brand-cyan" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {improvement.title}
                <span className="text-xs font-mono uppercase bg-brand-cyan/20 text-brand-cyan px-2 py-0.5 rounded border border-brand-cyan/30">
                  {improvement.category}
                </span>
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                <span className="text-rose-400">Current: {improvement.currentComplexity}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-emerald-400 font-bold">Optimized: {improvement.improvedComplexity}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Improvement Justification Banner */}
        <div className="px-6 py-3 bg-dark-950/80 border-b border-slate-800 flex items-start gap-3">
          <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300">
            <span className="font-semibold text-white">Why this improvement matters: </span>
            {improvement.reason}
          </div>
        </div>

        {/* Monaco Diff Viewer */}
        <div className="flex-1 w-full bg-dark-950">
          <DiffEditor
            height="100%"
            language={language === 'cpp' ? 'cpp' : language === 'python' ? 'python' : 'javascript'}
            original={originalCode}
            modified={improvement.improvedCode}
            theme="vs-dark"
            options={{
              readOnly: true,
              renderSideBySide: true,
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-dark-850">
          <div className="text-xs font-mono text-slate-400">
            Left: Current Code • Right: AI Improved Code
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onApply(improvement.improvedCode);
                onClose();
              }}
              className="px-5 py-2 text-xs font-bold text-dark-950 bg-gradient-to-r from-brand-cyan to-brand-blue hover:opacity-90 rounded-lg shadow-glow-cyan flex items-center gap-2 transition-all"
            >
              <Check className="w-4 h-4" />
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
