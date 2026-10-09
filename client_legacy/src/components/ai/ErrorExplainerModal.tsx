import React from 'react';
import { ErrorExplanation } from '../../types';
import { AlertCircle, Check, Wrench, X, Sparkles, HelpCircle } from 'lucide-react';

interface ErrorExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: ErrorExplanation | null;
  onApplyFix: (correctedCode: string) => void;
}

export function ErrorExplainerModal({
  isOpen,
  onClose,
  error,
  onApplyFix,
}: ErrorExplainerModalProps) {
  if (!isOpen || !error) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-rose-800/60 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-rose-950/40 border-b border-rose-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
                {error.type}
              </span>
              <h3 className="text-base font-bold text-white mt-1">{error.title}</h3>
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
        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh] font-mono text-xs">
          {/* What Happened */}
          <div className="bg-dark-850 p-3.5 rounded-lg border border-slate-800 space-y-1">
            <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-brand-cyan" />
              What Happened?
            </div>
            <p className="text-slate-200 leading-relaxed font-sans">{error.whatHappened}</p>
          </div>

          {/* Why It Happened */}
          <div className="bg-dark-850 p-3.5 rounded-lg border border-slate-800 space-y-1">
            <div className="text-[11px] font-bold text-slate-300">Why It Happened:</div>
            <p className="text-slate-300 leading-relaxed font-sans">{error.whyItHappened}</p>
          </div>

          {/* Where It Happened */}
          {error.whereItHappened?.line && (
            <div className="bg-dark-950 p-3 rounded-lg border border-white/5 space-y-1.5">
              <div className="text-[11px] text-slate-400">
                Location: <strong className="text-rose-400">Line {error.whereItHappened.line}</strong>
              </div>
              {error.whereItHappened.snippet && (
                <pre className="p-2 rounded bg-dark-900 border border-slate-800 text-rose-300 font-mono text-[11px] overflow-x-auto">
                  {error.whereItHappened.snippet}
                </pre>
              )}
            </div>
          )}

          {/* How to Fix It */}
          <div className="bg-emerald-950/30 border border-emerald-800/40 p-3.5 rounded-lg space-y-1.5">
            <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" />
              How to Fix:
            </div>
            <p className="text-emerald-200 leading-relaxed font-sans">{error.howToFix}</p>
          </div>

          {/* Beginner Friendly Encouragement */}
          {error.beginnerNote && (
            <div className="text-[11px] text-slate-400 italic bg-dark-850/60 p-2.5 rounded border border-white/5 font-sans">
              💡 {error.beginnerNote}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-dark-850 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Dismiss
          </button>
          {error.correctedCode && (
            <button
              onClick={() => {
                onApplyFix(error.correctedCode);
                onClose();
              }}
              className="px-5 py-2 text-xs font-bold text-dark-950 bg-gradient-to-r from-brand-cyan to-brand-blue hover:opacity-90 rounded-lg shadow-glow-cyan flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              1-Click Apply Fix
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
