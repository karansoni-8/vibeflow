import React, { useRef } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Wrench,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Code2,
  Loader2,
} from 'lucide-react';
import { useIdeStore } from '../../store/ideStore';
import { aiApi } from '../../lib/api';
import toast from 'react-hot-toast';

export const ErrorPanel: React.FC = () => {
  const {
    code,
    language,
    stderr,
    errorDoctorReport,
    isDiagnosingError,
    setErrorDoctorReport,
    setIsDiagnosingError,
    setCode,
  } = useIdeStore();

  const previousCodeRef = useRef<string>(code);

  const handleManualDiagnose = async () => {
    if (!stderr && !code) {
      toast('No active compiler or runtime error detected.', { icon: 'ℹ️' });
      return;
    }

    try {
      setIsDiagnosingError(true);
      const report = await aiApi.explainError(code, language, stderr || 'Syntax / Logic check requested');
      setErrorDoctorReport(report);
      toast.success('Error diagnosed in plain English!', { icon: '🩺' });
    } catch (err: any) {
      toast.error('Could not diagnose error.');
    } finally {
      setIsDiagnosingError(false);
    }
  };

  const handleApplyFix = () => {
    if (!errorDoctorReport?.correctedCodeSnippet) return;

    previousCodeRef.current = code;
    setCode(errorDoctorReport.correctedCodeSnippet);

    toast((t) => (
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="text-emerald-400 font-medium">Applied Error Doctor fix!</span>
        <button
          onClick={() => {
            setCode(previousCodeRef.current);
            toast.dismiss(t.id);
            toast('Reverted code fix.', { icon: '↩️' });
          }}
          className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-medium flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Undo
        </button>
      </div>
    ), {
      duration: 6000,
      style: { background: '#121e1a', border: '1px solid #34d399', color: '#f4f4f7' },
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d16] select-none overflow-y-auto">
      {/* Header bar */}
      <div className="h-10 bg-white/5 border-b border-white/10 px-3 flex items-center justify-between shrink-0 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-semibold text-[#f4f4f7]">Error Doctor</span>
          {errorDoctorReport && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {errorDoctorReport.errorType}
            </span>
          )}
        </div>

        <button
          onClick={handleManualDiagnose}
          disabled={isDiagnosingError}
          className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/15 rounded text-[11px] font-medium text-white transition disabled:opacity-50 cursor-pointer"
        >
          {isDiagnosingError ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
              <span>Diagnosing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 text-rose-400" />
              <span>Diagnose Error</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {isDiagnosingError && (
          <div className="p-6 text-center space-y-3 glass-panel animate-pulse">
            <Sparkles className="w-6 h-6 text-rose-400 mx-auto animate-spin" />
            <div className="text-xs font-medium text-rose-300 ai-shimmer">
              Error Doctor is translating raw compiler diagnostics into plain English...
            </div>
          </div>
        )}

        {!isDiagnosingError && !errorDoctorReport && (
          <div className="text-center py-12 px-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">No Active Errors</h4>
            <p className="text-xs text-[#9a9ab0] max-w-sm mx-auto leading-relaxed">
              When your program hits a compiler warning, runtime exception, or syntax failure, Error Doctor will automatically translate it into plain English with a 1-click fix.
            </p>
          </div>
        )}

        {!isDiagnosingError && errorDoctorReport && (
          <div className="space-y-4 animate-error-shake">
            {/* Plain-English Headline Card */}
            <div className="glass-panel p-4 border border-rose-500/30 bg-rose-500/5 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
                  Diagnosis Result
                </span>
                {errorDoctorReport.likelyLine && (
                  <span className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    Near Line {errorDoctorReport.likelyLine}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-white leading-snug">
                {errorDoctorReport.plainEnglishExplanation}
              </h3>
            </div>

            {/* Why It Happened Section */}
            <div className="glass-panel p-3.5 space-y-1.5 border border-white/10">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9a9ab0] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                Why This Happened (Root Cause)
              </div>
              <p className="text-xs text-[#f4f4f7] leading-relaxed">
                {errorDoctorReport.whyItHappened}
              </p>
            </div>

            {/* How To Fix It Section */}
            <div className="glass-panel p-3.5 space-y-1.5 border border-white/10">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9a9ab0] flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                Step-by-Step Fix
              </div>
              <p className="text-xs text-[#f4f4f7] leading-relaxed">
                {errorDoctorReport.suggestedFix}
              </p>
            </div>

            {/* 1-Click Apply Fix Button */}
            {errorDoctorReport.correctedCodeSnippet && (
              <div className="p-3.5 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    Verified Fix Available
                  </span>
                  <button
                    onClick={handleApplyFix}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition shadow-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Wrench className="w-3 h-3" /> Apply Fix to Editor
                  </button>
                </div>
                <div className="p-2 bg-black/40 rounded border border-white/5 font-mono text-[11px] text-white/80 max-h-32 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{errorDoctorReport.correctedCodeSnippet}</pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
