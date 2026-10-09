import React from 'react';
import { ExecutionResult } from '../../types';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Terminal as TerminalIcon } from 'lucide-react';

interface ConsoleOutputProps {
  result: ExecutionResult | null;
  isRunning?: boolean;
}

export function ConsoleOutput({ result, isRunning }: ConsoleOutputProps) {
  if (isRunning) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 font-mono text-xs gap-3">
        <div className="w-6 h-6 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin" />
        <div>Compiling & executing in isolated runner...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 font-mono text-xs gap-2">
        <TerminalIcon className="w-8 h-8 opacity-40 text-slate-400" />
        <div>Program has not been run yet. Click "Run" or press Ctrl+Enter.</div>
      </div>
    );
  }

  const isSuccess = result.status === 'success';
  const isTimeout = result.status === 'timeout';

  return (
    <div className="h-full flex flex-col font-mono text-xs overflow-hidden">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-dark-900 border-b border-slate-800 text-[11px]">
        <div className="flex items-center gap-3">
          {isSuccess ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Process exited with code {result.exitCode}
            </span>
          ) : isTimeout ? (
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              Execution Timed Out (5s limit)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-rose-400 font-bold">
              <XCircle className="w-3.5 h-3.5" />
              Process failed with code {result.exitCode}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock className="w-3 h-3 text-brand-cyan" />
          <span>Execution time: <strong className="text-slate-200">{result.executionTimeMs}ms</strong></span>
        </div>
      </div>

      {/* Output Console Log */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed space-y-2 select-text">
        {result.stdout && (
          <div className="text-slate-200 whitespace-pre-wrap">{result.stdout}</div>
        )}

        {result.stderr && (
          <div className="text-rose-300 bg-rose-950/30 p-2.5 rounded border border-rose-800/40 whitespace-pre-wrap">
            {result.stderr}
          </div>
        )}

        {!result.stdout && !result.stderr && (
          <div className="text-slate-500 italic">Program produced no console output.</div>
        )}
      </div>
    </div>
  );
}
