import React from 'react';
import {
  Activity,
  Zap,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Loader2,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useIdeStore } from '../../store/ideStore';
import { aiApi } from '../../lib/api';
import toast from 'react-hot-toast';

export const ComplexityChartPanel: React.FC = () => {
  const {
    code,
    language,
    explanation,
    empiricalData,
    isBenchmarking,
    setEmpiricalData,
    setIsBenchmarking,
  } = useIdeStore();

  const handleRunBenchmark = async () => {
    if (!code.trim()) {
      toast('Write or load an algorithm in the editor first.', { icon: '✍️' });
      return;
    }

    try {
      setIsBenchmarking(true);
      const theoretical = explanation?.timeComplexity?.worst || 'O(N^2)';
      const res = await aiApi.getEmpiricalComplexity(code, language, theoretical);
      setEmpiricalData(res);
      toast.success('Empirical scaling benchmark complete!', { icon: '📈' });
    } catch (err: any) {
      toast.error('Failed to run empirical benchmark.');
    } finally {
      setIsBenchmarking(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d16] select-none overflow-y-auto">
      {/* Header bar */}
      <div className="h-10 bg-white/5 border-b border-white/10 px-3 flex items-center justify-between shrink-0 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-[#f4f4f7]">Empirical Scaling & Case Variation</span>
        </div>

        <button
          onClick={handleRunBenchmark}
          disabled={isBenchmarking}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-cyan-500 hover:opacity-90 rounded text-[11px] font-medium text-white transition shadow-sm disabled:opacity-50 cursor-pointer"
        >
          {isBenchmarking ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Sweeping Inputs...</span>
            </>
          ) : (
            <>
              <TrendingUp className="w-3 h-3" />
              <span>Analyze How This Scales</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {isBenchmarking && (
          <div className="p-6 text-center space-y-3 glass-panel animate-pulse">
            <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto animate-bounce" />
            <div className="text-xs font-medium text-emerald-300 ai-shimmer">
              Executing input-size sweep across multiple runs to collect wall-clock timings...
            </div>
          </div>
        )}

        {!isBenchmarking && !empiricalData && (
          <div className="text-center py-12 px-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
              <Activity className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">Empirical Benchmark Not Yet Run</h4>
            <p className="text-xs text-[#9a9ab0] max-w-sm mx-auto leading-relaxed">
              Click <strong className="text-emerald-400">Analyze How This Scales</strong> to execute an automated multi-size input sweep (benchmarking wall-clock runtime) and see how pruning, sorted inputs, or branch feasibility change real performance.
            </p>
            <button
              onClick={handleRunBenchmark}
              className="px-4 py-1.5 rounded-lg gradient-btn text-xs font-medium inline-flex items-center gap-1.5 shadow-glow-violet cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5" /> Run Empirical Sweep
            </button>
          </div>
        )}

        {!isBenchmarking && empiricalData && (
          <>
            {/* Recharts Wall-Clock Graph Card */}
            <div className="glass-panel p-3 border border-white/10 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#9a9ab0]">
                <span className="font-semibold text-white uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  Wall-Clock Time (ms) vs. Input Size (N)
                </span>
                <span className="text-[10px] text-cyan-400">Piston & Native Sandbox Execution</span>
              </div>

              <div className="w-full h-56 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={empiricalData.timingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="inputSize"
                      stroke="#9a9ab0"
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#9a9ab0"
                      fontSize={10}
                      tickLine={false}
                      unit="ms"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#12121e',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        fontSize: '11px',
                        color: '#f4f4f7',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line
                      type="monotone"
                      dataKey="durationMs"
                      name="Observed Runtime (ms)"
                      stroke="#22d3ee"
                      strokeWidth={2.5}
                      dot={{ fill: '#22d3ee', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="theoreticalNormalized"
                      name="Theoretical Asymptotic Curve"
                      stroke="#8b5cf6"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Empirical Trend Narrative */}
            <div className="glass-panel p-3.5 space-y-1.5 border border-cyan-500/20 bg-cyan-500/5 rounded-xl">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Empirical Growth Analysis
              </div>
              <p className="text-xs text-[#f4f4f7] leading-relaxed">
                {empiricalData.empiricalTrendDescription}
              </p>
            </div>

            {/* Case Variation Narrative (The flagship differentiator) */}
            <div className="glass-panel p-3.5 space-y-1.5 border border-white/10 rounded-xl">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                Input Sensitivity & Real-World Divergence
              </div>
              <p className="text-xs text-[#f4f4f7] leading-relaxed">
                {empiricalData.caseVariationExplanation}
              </p>
            </div>

            {/* Best Case & Worst Case Input Vectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-3 glass-panel border border-emerald-500/20 rounded-lg space-y-1">
                <div className="text-[10px] uppercase font-bold text-emerald-400">
                  Best-Case Trigger Input
                </div>
                <p className="text-[11px] text-[#9a9ab0] leading-relaxed">
                  {empiricalData.bestCaseInputExample}
                </p>
              </div>

              <div className="p-3 glass-panel border border-rose-500/20 rounded-lg space-y-1">
                <div className="text-[10px] uppercase font-bold text-rose-400">
                  Worst-Case Trigger Input
                </div>
                <p className="text-[11px] text-[#9a9ab0] leading-relaxed">
                  {empiricalData.worstCaseInputExample}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
