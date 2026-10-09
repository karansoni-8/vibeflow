import React from 'react';
import { Code2, Copy, Loader2, FileCode, Sparkles, CheckCheck } from 'lucide-react';
import { useIdeStore } from '../../store/ideStore';
import { aiApi } from '../../lib/api';
import toast from 'react-hot-toast';

export const PseudocodePanel: React.FC = () => {
  const {
    code,
    language,
    pseudocode,
    isGeneratingPseudocode,
    setPseudocode,
    setIsGeneratingPseudocode,
  } = useIdeStore();

  const [copied, setCopied] = React.useState(false);

  const handleGenerate = async () => {
    if (!code.trim()) {
      toast('Write or paste code in the editor first.', { icon: '✍️' });
      return;
    }
    try {
      setIsGeneratingPseudocode(true);
      const res = await aiApi.getPseudocode(code, language);
      setPseudocode(res.pseudocode);
      toast.success('Pseudocode generated!', { icon: '📄' });
    } catch (err: any) {
      toast.error('Failed to generate pseudocode.');
      setIsGeneratingPseudocode(false);
    }
  };

  const handleCopy = async () => {
    if (!pseudocode) return;
    try {
      await navigator.clipboard.writeText(pseudocode);
      setCopied(true);
      toast.success('Pseudocode copied to clipboard!', { icon: '📋' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy.');
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d16] overflow-y-auto">
      {/* Header */}
      <div className="h-10 bg-white/5 border-b border-white/10 px-3 flex items-center justify-between shrink-0 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-[#f4f4f7]">Pseudocode Generator</span>
        </div>
        <div className="flex items-center gap-2">
          {pseudocode && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded text-[11px] font-medium text-[#f4f4f7] transition cursor-pointer"
            >
              {copied ? (
                <><CheckCheck className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Copied!</span></>
              ) : (
                <><Copy className="w-3 h-3" /><span>Copy</span></>
              )}
            </button>
          )}
          <button
            onClick={handleGenerate}
            disabled={isGeneratingPseudocode}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-indigo-600 to-violet-500 hover:opacity-90 rounded text-[11px] font-medium text-white transition shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isGeneratingPseudocode ? (
              <><Loader2 className="w-3 h-3 animate-spin" /><span>Generating...</span></>
            ) : (
              <><Sparkles className="w-3 h-3" /><span>Generate Pseudocode</span></>
            )}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Loading State */}
        {isGeneratingPseudocode && (
          <div className="p-6 text-center space-y-3 rounded-xl border border-white/10 bg-white/5 animate-pulse">
            <Code2 className="w-6 h-6 text-indigo-400 mx-auto animate-spin" />
            <div className="text-xs font-medium text-indigo-300">
              Translating code logic into academic pseudocode...
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isGeneratingPseudocode && !pseudocode && (
          <div className="text-center py-12 px-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-indigo-400">
              <FileCode className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">No Pseudocode Generated Yet</h4>
            <p className="text-xs text-[#9a9ab0] max-w-sm mx-auto leading-relaxed">
              Click <strong className="text-indigo-400">Generate Pseudocode</strong> to convert your code into language-agnostic academic pseudocode — perfect for reports and presentations.
            </p>
            <button
              onClick={handleGenerate}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 hover:opacity-90 text-xs font-medium text-white inline-flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Generate Now
            </button>
          </div>
        )}

        {/* Pseudocode Output */}
        {!isGeneratingPseudocode && pseudocode && (
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 overflow-hidden">
            {/* Output header bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
                  Generated Pseudocode
                </span>
              </div>
              <span className="text-[10px] text-[#9a9ab0]">Language-agnostic · Academic format</span>
            </div>

            {/* Code block */}
            <pre className="p-4 text-[12px] leading-6 font-mono text-[#e2e8f0] whitespace-pre-wrap overflow-x-auto">
              {pseudocode}
            </pre>

            {/* Footer hint */}
            <div className="px-3 py-2 border-t border-white/5 bg-white/5 flex items-center justify-between">
              <span className="text-[10px] text-[#9a9ab0]">
                ✓ Uses standard ALGORITHM / INPUT / OUTPUT / RETURN conventions
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 transition cursor-pointer font-medium"
              >
                {copied ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy for report'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
