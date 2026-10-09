import React from 'react';
import { BookOpen, X, Info, Layers, Beaker, GitCommit } from 'lucide-react';
import { cn } from '@/lib/cn';

export default function CodeExplainerPanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-14 right-4 bottom-8 w-[400px] z-40 bg-[#0b0f17]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg flex flex-col overflow-hidden">
      <div className="p-3 border-b border-white/10 flex items-center justify-between bg-[#141c2b]">
        <h3 className="font-bold flex items-center gap-2 text-white">
          <BookOpen className="text-[#38bdf8]" size={18} /> Code Explainer
        </h3>
        <button onClick={onClose} className="text-white/50 hover:text-white p-1 rounded">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar text-sm">
        <section>
          <h4 className="font-semibold text-white/80 mb-2 flex items-center gap-2"><Info size={14}/> Overview</h4>
          <p className="text-white/70 leading-relaxed bg-white/5 p-3 rounded">
            This code implements a merge sort algorithm to efficiently sort an array of objects. It runs in O(n log n) time.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-white/80 mb-2 flex items-center gap-2"><GitCommit size={14}/> Step-by-step</h4>
          <ol className="list-decimal list-inside space-y-2 text-white/70">
            <li>Check if the array length is less than 2. If so, it's already sorted.</li>
            <li>Find the middle index of the array.</li>
            <li>Split the array into two halves: left and right.</li>
            <li>Recursively call mergeSort on both halves.</li>
            <li>Merge the sorted halves back together in the correct order.</li>
          </ol>
        </section>

        <section>
          <h4 className="font-semibold text-white/80 mb-2 flex items-center gap-2"><Layers size={14}/> Variables</h4>
          <div className="border border-white/10 rounded overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-3 py-2 text-white/50 font-medium">Name</th>
                  <th className="px-3 py-2 text-white/50 font-medium">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="px-3 py-2 text-[#38bdf8] font-mono">mid</td>
                  <td className="px-3 py-2 text-white/70">Middle index for splitting</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-[#38bdf8] font-mono">left</td>
                  <td className="px-3 py-2 text-white/70">Left half of array</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
