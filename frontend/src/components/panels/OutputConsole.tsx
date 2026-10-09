import React, { useState } from 'react';
import {
  Terminal as TerminalIcon,
  ChevronDown,
  ChevronRight,
  Trash2,
  Clock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useIdeStore } from '../../store/ideStore';

export const OutputConsole: React.FC = () => {
  const { stdout, stderr, exitCode, durationMs, stdin, setStdin, isExecuting } = useIdeStore();
  const [showStdin, setShowStdin] = useState(false);

  return (
    <div className="w-full h-full flex flex-col bg-[#07070d] text-[#f4f4f7] font-mono select-text overflow-hidden">
      {/* Console Toolbar */}
      <div className="h-8 bg-[#0d0d16] border-b border-white/5 px-3 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2 text-xs">
          <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-white/90">Program Output Console</span>

          {exitCode !== null && (
            <div className="flex items-center gap-1.5 ml-2">
              {exitCode === 0 ? (
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Exited with code 0
                </span>
              ) : (
                <span className="text-[10px] text-rose-400 flex items-center gap-1 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                  <AlertCircle className="w-2.5 h-2.5" /> Exit Code {exitCode}
                </span>
              )}

              {durationMs !== null && (
                <span className="text-[10px] text-[#9a9ab0] flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" /> {durationMs}ms
                </span>
              )}
            </div>
          )}
        </div>

        {/* Stdin Toggle & Clear */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStdin(!showStdin)}
            className="text-[11px] text-[#9a9ab0] hover:text-white flex items-center gap-1 px-2 py-0.5 rounded hover:bg-white/5 transition"
          >
            {showStdin ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            <span>Input (stdin)</span>
            {stdin.trim() && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
          </button>
        </div>
      </div>

      {/* Collapsible Stdin Area */}
      {showStdin && (
        <div className="p-2 bg-[#0c0c16] border-b border-white/10 shrink-0">
          <div className="text-[10px] font-sans font-semibold text-[#9a9ab0] mb-1">
            Standard Input (stdin) for programs that read interactive inputs:
          </div>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Enter input lines here (e.g. 5\n10 20 30 40 50)..."
            rows={2}
            className="w-full bg-black/40 border border-white/10 rounded p-1.5 text-xs text-emerald-300 font-mono focus:outline-none focus:border-cyan-400 resize-none"
          />
        </div>
      )}

      {/* Main Output Content */}
      <div className="flex-1 p-3 overflow-y-auto text-xs space-y-2 select-text">
        {isExecuting ? (
          <div className="text-cyan-400 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>Running program in isolated execution sandbox...</span>
          </div>
        ) : !stdout && !stderr && exitCode === null ? (
          <div className="text-[#9a9ab0] text-xs italic py-2">
            Press &quot;Run&quot; (Ctrl+Enter) to compile and execute your code. Standard output and errors will appear here.
          </div>
        ) : (
          <>
            {stdout && (
              <pre className="text-[#f4f4f7] whitespace-pre-wrap leading-relaxed">
                {stdout}
              </pre>
            )}

            {stderr && (
              <div className="mt-2 p-2.5 rounded bg-rose-950/30 border border-rose-500/20 text-rose-300 whitespace-pre-wrap leading-relaxed">
                {stderr}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
