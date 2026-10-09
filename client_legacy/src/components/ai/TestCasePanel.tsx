import React from 'react';
import { TestTube, Play, X, Check, AlertCircle } from 'lucide-react';

export default function TestCasePanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-14 right-4 bottom-8 w-[400px] z-40 bg-[#0b0f17]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg flex flex-col overflow-hidden">
      <div className="p-3 border-b border-white/10 flex items-center justify-between bg-[#141c2b]">
        <h3 className="font-bold flex items-center gap-2 text-white">
          <TestTube className="text-[#10b981]" size={18} /> Test Cases
        </h3>
        <button onClick={onClose} className="text-white/50 hover:text-white p-1 rounded">
          <X size={16} />
        </button>
      </div>

      <div className="p-3 border-b border-white/10 flex justify-between items-center bg-[#06090e]">
        <span className="text-xs text-white/50">2 passed, 1 failed</span>
        <button className="flex items-center gap-1 bg-[#10b981]/20 text-[#10b981] px-2 py-1 rounded text-xs font-semibold">
          <Play size={12} /> Run All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar text-sm">
        <div className="border border-[#10b981]/30 bg-[#10b981]/5 rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-semibold text-white/90">
              <Check className="text-[#10b981]" size={14} /> Normal Input
            </div>
            <span className="text-[10px] uppercase bg-white/10 px-1.5 py-0.5 rounded text-white/50">Edge</span>
          </div>
          <div className="bg-[#06090e] p-2 rounded font-mono text-xs text-white/70 mb-2">
            sort([3, 1, 4, 1, 5])
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#10b981]">Passed</span>
            <button className="text-white/50 hover:text-white"><Play size={14} /></button>
          </div>
        </div>

        <div className="border border-[#f43f5e]/30 bg-[#f43f5e]/5 rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-semibold text-white/90">
              <AlertCircle className="text-[#f43f5e]" size={14} /> Empty Array
            </div>
            <span className="text-[10px] uppercase bg-white/10 px-1.5 py-0.5 rounded text-white/50">Boundary</span>
          </div>
          <div className="bg-[#06090e] p-2 rounded font-mono text-xs text-white/70 mb-2">
            sort([])
          </div>
          <div className="text-xs text-[#f43f5e] mb-2 font-mono">Error: Cannot read properties of undefined</div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#f43f5e]">Failed</span>
            <button className="text-white/50 hover:text-white"><Play size={14} /></button>
          </div>
        </div>
      </div>
      
      <div className="p-3 border-t border-white/10 bg-[#141c2b]">
        <button className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded font-semibold text-sm">Generate More Tests</button>
      </div>
    </div>
  );
}
