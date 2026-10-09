import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Clock,
  HardDrive,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';
import { useIdeStore } from '../../store/ideStore';
import { aiApi } from '../../lib/api';
import toast from 'react-hot-toast';

export const ExplainPanel: React.FC = () => {
  const {
    code,
    language,
    explanation,
    isExplaining,
    setExplanation,
    setIsExplaining,
    setActiveTabRight,
    addChatMessage,
  } = useIdeStore();

  const [expandedLine, setExpandedLine] = useState<string | null>(null);

  const handleRunExplain = async () => {
    if (!code.trim()) {
      toast('Write or paste code in the editor first.', { icon: '✍️' });
      return;
    }

    try {
      setIsExplaining(true);
      const res = await aiApi.explainCode(code, language);
      setExplanation(res);
      toast.success('Algorithmic breakdown complete!', { icon: '✨' });
    } catch (err: any) {
      toast.error('Failed to generate code explanation.');
    } finally {
      setIsExplaining(false);
    }
  };

  const handleRequestEnhancement = (enhancementTitle: string, description: string) => {
    setActiveTabRight('chat');
    addChatMessage({
      role: 'user',
      text: `Can you implement this enhancement for my code: "${enhancementTitle}"? Details: ${description}`,
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d16] select-none overflow-y-auto">
      {/* Header bar */}
      <div className="h-10 bg-white/5 border-b border-white/10 px-3 flex items-center justify-between shrink-0 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-[#f4f4f7]">Algorithm Explainer & Complexity</span>
        </div>

        <button
          onClick={handleRunExplain}
          disabled={isExplaining}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 rounded text-[11px] font-medium text-white transition shadow-sm disabled:opacity-50 cursor-pointer"
        >
          {isExplaining ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3" />
              <span>Explain Algorithm</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {isExplaining && (
          <div className="p-6 text-center space-y-3 glass-panel animate-pulse">
            <Sparkles className="w-6 h-6 text-cyan-400 mx-auto animate-spin" />
            <div className="text-xs font-medium ai-shimmer">
              VibeFlow is deriving time bounds and step-by-step logic...
            </div>
          </div>
        )}

        {!isExplaining && !explanation && (
          <div className="text-center py-12 px-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-cyan-400">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">No Explanation Generated Yet</h4>
            <p className="text-xs text-[#9a9ab0] max-w-sm mx-auto leading-relaxed">
              Click <strong className="text-cyan-400">Explain Algorithm</strong> to receive an educational summary, Best/Average/Worst Big-O complexity breakdown, and optimization tips.
            </p>
            <button
              onClick={handleRunExplain}
              className="px-4 py-1.5 rounded-lg gradient-btn text-xs font-medium inline-flex items-center gap-1.5 shadow-glow-violet cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Explain Code Now
            </button>
          </div>
        )}

        {!isExplaining && explanation && (
          <>
            {/* Plain English Summary */}
            <div className="glass-panel p-3.5 space-y-1.5 border border-white/10">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                Algorithmic Overview
              </div>
              <p className="text-xs text-[#f4f4f7] leading-relaxed font-sans">
                {explanation.summary}
              </p>
            </div>

            {/* Asymptotic Complexity Row (Best, Average, Worst, Space) */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9a9ab0] mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-violet-400" />
                Asymptotic Time & Space Bounds
              </div>
              <div className="grid grid-cols-3 gap-2">
                {/* Best Case */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 text-center">
                  <div className="text-[10px] uppercase font-semibold text-emerald-400">Best Case</div>
                  <div className="text-sm font-mono font-bold text-emerald-300 mt-0.5">
                    {explanation.timeComplexity.best}
                  </div>
                </div>

                {/* Average Case */}
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 text-center">
                  <div className="text-[10px] uppercase font-semibold text-amber-400">Average Case</div>
                  <div className="text-sm font-mono font-bold text-amber-300 mt-0.5">
                    {explanation.timeComplexity.average}
                  </div>
                </div>

                {/* Worst Case */}
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-2 text-center">
                  <div className="text-[10px] uppercase font-semibold text-rose-400">Worst Case</div>
                  <div className="text-sm font-mono font-bold text-rose-300 mt-0.5">
                    {explanation.timeComplexity.worst}
                  </div>
                </div>
              </div>

              {/* Space Complexity Card */}
              <div className="mt-2 bg-violet-500/10 border border-violet-500/20 rounded-lg p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-xs text-[#9a9ab0]">Auxiliary Space:</span>
                  <span className="text-xs font-mono font-bold text-violet-300">
                    {explanation.spaceComplexity.value}
                  </span>
                </div>
                <span className="text-[11px] text-[#9a9ab0] text-right truncate max-w-[180px]">
                  {explanation.spaceComplexity.reasoning}
                </span>
              </div>

              {/* Complexity Reasoning */}
              <div className="mt-2 p-2.5 bg-white/5 rounded-lg border border-white/5 text-[11px] text-[#9a9ab0] leading-relaxed">
                <strong className="text-white/90">Why it varies: </strong>
                {explanation.timeComplexity.reasoning}
              </div>
            </div>

            {/* Line-by-Line Breakdown Accordion */}
            {explanation.lineByLine && explanation.lineByLine.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9a9ab0] mb-2">
                  Line-by-Line Breakdown
                </div>
                <div className="space-y-1.5">
                  {explanation.lineByLine.map((item, idx) => {
                    const isOpen = expandedLine === item.lines || (!expandedLine && idx === 0);
                    return (
                      <div
                        key={idx}
                        className="border border-white/10 rounded-lg overflow-hidden bg-white/5"
                      >
                        <button
                          onClick={() => setExpandedLine(isOpen ? null : item.lines)}
                          className="w-full px-3 py-2 text-left flex items-center justify-between text-xs text-[#f4f4f7] hover:bg-white/5 transition"
                        >
                          <span className="font-mono text-cyan-400 font-semibold text-[11px]">
                            Lines {item.lines}
                          </span>
                          {isOpen ? (
                            <ChevronDown className="w-3.5 h-3.5 text-[#9a9ab0]" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-[#9a9ab0]" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-3 pb-2.5 text-[11px] text-[#9a9ab0] border-t border-white/5 pt-1.5 leading-relaxed">
                            {item.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Enhancements / Optimizations */}
            {explanation.enhancements && explanation.enhancements.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9a9ab0] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  Suggested Enhancements
                </div>
                <div className="space-y-2">
                  {explanation.enhancements.map((enh, i) => (
                    <div
                      key={i}
                      className="p-3 glass-panel border border-yellow-500/20 bg-yellow-500/5 rounded-lg space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-xs text-yellow-300">{enh.title}</div>
                        {enh.improvedComplexity && (
                          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-yellow-400/20 text-yellow-200">
                            {enh.improvedComplexity}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#9a9ab0] leading-relaxed">
                        {enh.description}
                      </p>
                      <button
                        onClick={() => handleRequestEnhancement(enh.title, enh.description)}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition cursor-pointer pt-1"
                      >
                        <span>Ask AI to implement this</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
