import React, { useState } from 'react';
import { X, Sparkles, Loader2, Play, GitBranch, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';

export default function AIGenerateModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedCode('// Generated code based on: ' + prompt + '\nconsole.log("Hello AI");');
      setIsGenerating(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#0b0f17] border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#141c2b]">
          <h2 className="text-lg font-bold flex items-center gap-2 text-white">
            <Sparkles className="text-[#a855f7]" /> AI Code Generation
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-white p-1 rounded-md hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          <div>
            <label className="block text-sm text-white/70 mb-1">Describe what you want to build</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A function that sorts an array of objects by a specific key using merge sort..."
              className="w-full h-32 bg-[#141c2b] border border-white/10 rounded-md p-3 text-white focus:border-[#a855f7] focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm text-white/70 mb-1">Language</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#141c2b] border border-white/10 rounded-md p-2 text-white focus:border-[#a855f7] focus:outline-none"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>
            <div className="flex items-end pb-1">
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="bg-[#a855f7] hover:bg-[#a855f7]/90 disabled:opacity-50 text-white px-6 py-2 rounded-md font-semibold flex items-center gap-2 transition-colors"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                Generate
              </button>
            </div>
          </div>

          {isGenerating && (
            <div className="py-8 flex flex-col items-center justify-center text-[#a855f7]">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p>Generating optimal code...</p>
            </div>
          )}

          {generatedCode && !isGenerating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 mt-4 pt-4 border-t border-white/10">
              <h3 className="text-sm font-semibold text-white/80">Generated Result</h3>
              <div className="bg-[#06090e] border border-white/10 rounded-md p-4 font-mono text-sm text-white whitespace-pre-wrap">
                {generatedCode}
              </div>
              <div className="flex gap-2 justify-end">
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md text-sm font-semibold transition-colors flex items-center gap-2">
                  <GitBranch size={16} /> Generate Flowchart
                </button>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md text-sm font-semibold transition-colors flex items-center gap-2">
                  <BarChart3 size={16} /> Analyze Complexity
                </button>
                <button className="px-4 py-2 bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-[#06090e] rounded-md text-sm font-semibold transition-colors flex items-center gap-2">
                  <Play size={16} /> Insert into Editor
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
