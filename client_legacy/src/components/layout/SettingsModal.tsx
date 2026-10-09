import React from 'react';
import { Settings, X, Key, Sliders, Sparkles, Check, HelpCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  tabSize: number;
  setTabSize: (size: number) => void;
  wordWrap: 'on' | 'off';
  setWordWrap: (wrap: 'on' | 'off') => void;
  minimap: boolean;
  setMinimap: (enabled: boolean) => void;
  beginnerMode: boolean;
  setBeginnerMode: (enabled: boolean) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  fontSize,
  setFontSize,
  tabSize,
  setTabSize,
  wordWrap,
  setWordWrap,
  minimap,
  setMinimap,
  beginnerMode,
  setBeginnerMode,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-slate-700 w-full max-w-xl rounded-xl shadow-2xl overflow-hidden font-sans text-xs animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-dark-850 border-b border-slate-800">
          <div className="flex items-center gap-2.5 text-white font-bold text-base">
            <Settings className="w-5 h-5 text-brand-cyan" />
            <span>IDE Settings</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-dark-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Section: Editor Preferences */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-200 font-bold uppercase tracking-wider text-[11px] font-mono">
              <Sliders className="w-4 h-4 text-brand-cyan" />
              <span>Editor Configuration</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-400">Font Size (px)</label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full bg-dark-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-brand-cyan/50"
                >
                  {[12, 13, 14, 15, 16, 18].map((s) => (
                    <option key={s} value={s}>{s}px</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">Tab Size</label>
                <select
                  value={tabSize}
                  onChange={(e) => setTabSize(Number(e.target.value))}
                  className="w-full bg-dark-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-brand-cyan/50"
                >
                  <option value={2}>2 Spaces</option>
                  <option value={4}>4 Spaces</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-dark-850 rounded-lg border border-white/5">
              <div>
                <div className="text-slate-200 font-medium">Word Wrap</div>
                <div className="text-slate-500 text-[11px]">Wrap long lines inside the Monaco code view</div>
              </div>
              <button
                onClick={() => setWordWrap(wordWrap === 'on' ? 'off' : 'on')}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${
                  wordWrap === 'on'
                    ? 'bg-brand-cyan text-dark-950 shadow-glow-cyan'
                    : 'bg-dark-750 text-slate-400 hover:text-white'
                }`}
              >
                {wordWrap.toUpperCase()}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-dark-850 rounded-lg border border-white/5">
              <div>
                <div className="text-slate-200 font-medium">Minimap</div>
                <div className="text-slate-500 text-[11px]">Show miniature code overview scrollbar on the right</div>
              </div>
              <button
                onClick={() => setMinimap(!minimap)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${
                  minimap
                    ? 'bg-brand-cyan text-dark-950 shadow-glow-cyan'
                    : 'bg-dark-750 text-slate-400 hover:text-white'
                }`}
              >
                {minimap ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Section: Learning Mode */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-slate-200 font-bold uppercase tracking-wider text-[11px] font-mono">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Pedagogy & Learning Mode</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-dark-850 rounded-lg border border-white/5">
              <div>
                <div className="text-slate-200 font-medium">Beginner Mode</div>
                <div className="text-slate-400 text-[11px]">
                  Simplifies compiler error explanations, avoids intimidating jargon, and provides intuitive analogies.
                </div>
              </div>
              <button
                onClick={() => setBeginnerMode(!beginnerMode)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${
                  beginnerMode
                    ? 'bg-amber-400 text-dark-950 shadow-sm'
                    : 'bg-dark-750 text-slate-400 hover:text-white'
                }`}
              >
                {beginnerMode ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>

          {/* Section: Gemini API Configuration */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-slate-200 font-bold uppercase tracking-wider text-[11px] font-mono">
              <Key className="w-4 h-4 text-purple-400" />
              <span>Google Gemini AI Integration</span>
            </div>

            <div className="p-3.5 bg-dark-950 rounded-lg border border-purple-900/40 text-slate-300 space-y-2 text-[11px]">
              <p>
                VibeFlow is powered by Google Gemini with automatic local AST fallback. To configure your personal key:
              </p>
              <div className="p-2 rounded bg-dark-900 font-mono text-[10px] text-purple-300 border border-white/5 select-all">
                server/.env &rarr; GEMINI_API_KEY=YOUR_GEMINI_API_KEY
              </div>
              <p className="text-slate-400">
                You can obtain a free Gemini API key from{' '}
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-cyan underline"
                >
                  Google AI Studio
                </a>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-dark-850 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-brand-cyan hover:bg-cyan-300 text-dark-950 font-bold rounded-lg text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
