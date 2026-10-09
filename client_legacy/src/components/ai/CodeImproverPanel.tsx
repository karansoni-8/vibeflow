import React from 'react';
import { Zap, X, CheckCircle, AlertTriangle } from 'lucide-react';

export default function CodeImproverPanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-14 right-4 bottom-8 w-[450px] z-40 bg-[#0b0f17]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg flex flex-col overflow-hidden">
      <div className="p-3 border-b border-white/10 flex items-center justify-between bg-[#141c2b]">
        <h3 className="font-bold flex items-center gap-2 text-white">
          <Zap className="text-[#f97316]" size={18} /> Code Improvements
        </h3>
        <button onClick={onClose} className="text-white/50 hover:text-white p-1 rounded">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-sm">
        <div className="bg-white/5 border border-white/10 p-3 rounded flex justify-between items-center">
          <div>
            <div className="text-xs text-white/50 mb-1">Current Complexity</div>
            <div className="font-mono text-[#f43f5e]">O(n²)</div>
          </div>
          <Zap className="text-white/20" size={16} />
          <div className="text-right">
            <div className="text-xs text-white/50 mb-1">Improved Complexity</div>
            <div className="font-mono text-[#10b981]">O(n log n)</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="border border-[#f97316]/30 bg-[#f97316]/10 p-3 rounded">
            <div className="flex items-center gap-2 text-[#f97316] font-semibold mb-1">
              <AlertTriangle size={14} /> Performance Warning
            </div>
            <p className="text-white/70 mb-2">Nested loops found. This can be optimized using a hash map.</p>
            <button className="bg-[#f97316] text-[#06090e] px-3 py-1 rounded text-xs font-semibold w-full">Apply Fix</button>
          </div>

          <div className="border border-[#38bdf8]/30 bg-[#38bdf8]/10 p-3 rounded">
            <div className="flex items-center gap-2 text-[#38bdf8] font-semibold mb-1">
              <CheckCircle size={14} /> Best Practice
            </div>
            <p className="text-white/70 mb-2">Consider using const instead of let for variables that are never reassigned.</p>
            <button className="bg-[#38bdf8] text-[#06090e] px-3 py-1 rounded text-xs font-semibold w-full">Apply Fix</button>
          </div>
        </div>
      </div>
      <div className="p-3 border-t border-white/10 bg-[#141c2b]">
        <button className="w-full bg-[#10b981] text-white py-2 rounded font-semibold text-sm">Apply All Changes</button>
      </div>
    </div>
  );
}
