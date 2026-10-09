import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Zap, BarChart3, GitBranch, TestTube } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  selectedText: string;
  onClose: () => void;
}

export default function ContextActionMenu({ x, y, selectedText, onClose }: ContextMenuProps) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        style={{ left: Math.min(x, window.innerWidth - 350), top: Math.max(10, y - 60) }}
        className="fixed z-50 bg-[#141c2b]/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl shadow-black/50 p-1.5 flex gap-1"
      >
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-white/10 text-xs font-semibold text-[#38bdf8] transition-colors">
          <BookOpen size={14} /> Explain
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-white/10 text-xs font-semibold text-[#f97316] transition-colors">
          <Zap size={14} /> Optimize
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-white/10 text-xs font-semibold text-[#a855f7] transition-colors">
          <BarChart3 size={14} /> Complexity
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-white/10 text-xs font-semibold text-white/80 transition-colors">
          <GitBranch size={14} /> Flowchart
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-white/10 text-xs font-semibold text-[#10b981] transition-colors">
          <TestTube size={14} /> Tests
        </button>
      </motion.div>
    </>
  );
}
