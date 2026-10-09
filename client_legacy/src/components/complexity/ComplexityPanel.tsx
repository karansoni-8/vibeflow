import React from 'react';
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
