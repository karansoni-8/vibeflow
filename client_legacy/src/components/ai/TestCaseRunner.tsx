import React, { useState } from 'react';
import { TestCase, ExecutionResult } from '../../types';
import { api } from '../../api/client';
import { ListChecks, Play, CheckCircle2, XCircle, Sparkles, AlertCircle, Clock } from 'lucide-react';

interface TestCaseRunnerProps {
  code: string;
  language: string;
  testCases: TestCase[];
  onGenerate: () => void;
  loading?: boolean;
}

interface TestRunStatus {
  [testId: string]: {
    running?: boolean;
    result?: ExecutionResult;
    passed?: boolean;
  };
}

export function TestCaseRunner({
  code,
  language,
  testCases,
  onGenerate,
  loading,
}: TestCaseRunnerProps) {
  const [runStatuses, setRunStatuses] = useState<TestRunStatus>({});
  const [isRunningAll, setIsRunningAll] = useState(false);

  const runSingleTest = async (tc: TestCase) => {
    setRunStatuses((prev) => ({
      ...prev,
      [tc.id]: { running: true },
    }));

    try {
      const res = await api.execute(language, code, tc.input);
      const passed = res.exitCode === 0;
      setRunStatuses((prev) => ({
        ...prev,
        [tc.id]: { running: false, result: res, passed },
      }));
    } catch (err) {
      setRunStatuses((prev) => ({
        ...prev,
        [tc.id]: { running: false, passed: false },
      }));
    }
  };

  const runAllTests = async () => {
    setIsRunningAll(true);
    for (const tc of testCases) {
      await runSingleTest(tc);
    }
    setIsRunningAll(false);
  };

  // Calculate totals
  const total = testCases.length;
  const executed = Object.values(runStatuses).filter((s) => s.result !== undefined);
  const passedCount = executed.filter((s) => s.passed).length;
  const failedCount = executed.length - passedCount;

  return (
    <div className="h-full flex flex-col font-mono text-xs overflow-hidden select-text">
      {/* Top Header & Run All Button */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-dark-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <ListChecks className="w-4 h-4 text-brand-cyan" />
          <span className="font-bold text-slate-200">Algorithmic Test Cases</span>
          {executed.length > 0 && (
            <div className="flex items-center gap-2 text-[11px] ml-2">
              <span className="text-emerald-400 font-bold">✓ {passedCount} passed</span>
              {failedCount > 0 && <span className="text-rose-400 font-bold">✗ {failedCount} failed</span>}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onGenerate}
            disabled={loading}
            className="px-3 py-1.5 rounded bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white border border-white/5 flex items-center gap-1.5 transition-colors text-[11px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
            {loading ? 'Generating...' : 'Regenerate Cases'}
          </button>
          <button
            onClick={runAllTests}
            disabled={isRunningAll || testCases.length === 0}
            className="px-4 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1.5 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-emerald-400" />
            {isRunningAll ? 'Running Tests...' : 'Run All Tests'}
          </button>
        </div>
      </div>

      {/* Test Cases List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {testCases.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
            <ListChecks className="w-8 h-8 opacity-40" />
            <div>No test cases generated yet. Click "Generate Cases" to create edge tests.</div>
          </div>
        ) : (
          testCases.map((tc) => {
            const status = runStatuses[tc.id];
            const badgeColor =
              tc.type === 'edge'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : tc.type === 'boundary'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                : tc.type === 'large'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                : 'bg-blue-500/20 text-blue-300 border-blue-500/30';

            return (
              <div
                key={tc.id}
                className="bg-dark-900/80 border border-slate-800 rounded-lg p-3.5 space-y-2.5 transition-all hover:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${badgeColor}`}>
                      {tc.type}
                    </span>
                    <span className="font-bold text-slate-200 text-xs">{tc.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {status?.running && (
                      <span className="text-[11px] text-brand-cyan animate-pulse">Running...</span>
                    )}
                    {status?.passed === true && (
                      <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Passed ({status.result?.executionTimeMs}ms)
                      </span>
                    )}
                    {status?.passed === false && (
                      <span className="flex items-center gap-1 text-rose-400 font-bold text-[11px]">
                        <XCircle className="w-3.5 h-3.5" /> Failed
                      </span>
                    )}
                    <button
                      onClick={() => runSingleTest(tc)}
                      disabled={status?.running}
                      className="p-1 px-2 rounded bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white border border-white/5 flex items-center gap-1 text-[11px]"
                    >
                      <Play className="w-3 h-3" /> Run
                    </button>
                  </div>
                </div>

                {/* Input & Output */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-dark-950 p-2 rounded border border-white/5">
                    <div className="text-[9px] text-slate-500 uppercase font-mono">Test Stdin:</div>
                    <pre className="text-slate-300 mt-1 whitespace-pre-wrap">{tc.input}</pre>
                  </div>
                  {status?.result?.stdout ? (
                    <div className="bg-dark-950 p-2 rounded border border-white/5">
                      <div className="text-[9px] text-slate-500 uppercase font-mono">Output:</div>
                      <pre className="text-emerald-300 mt-1 whitespace-pre-wrap">{status.result.stdout}</pre>
                    </div>
                  ) : (
                    <div className="bg-dark-950/50 p-2 rounded border border-white/5 flex items-center text-slate-500 text-[10px] italic">
                      Click Run to observe output
                    </div>
                  )}
                </div>

                {/* AI Explanation of Why this Edge Case Matters */}
                {tc.explanation && (
                  <div className="flex items-start gap-1.5 text-[11px] text-slate-400 font-sans bg-dark-950/40 p-2 rounded border border-white/5">
                    <AlertCircle className="w-3.5 h-3.5 text-brand-cyan shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-300">Why this matters: </strong>
                      {tc.explanation}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
