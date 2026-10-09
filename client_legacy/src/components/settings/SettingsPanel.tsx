import React from 'react';
import { useIdeStore } from '@/store/ideStore';
import { X, Settings as SettingsIcon, Monitor, Sparkles, Zap, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { settings, updateSettings } = useIdeStore();

  if (!isOpen || !settings) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#0b0f17] border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[80vh]"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#141c2b]">
          <h2 className="text-lg font-bold flex items-center gap-2 text-white">
            <SettingsIcon className="text-white/70" /> Settings
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-white p-1 rounded-md hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          <section>
            <h3 className="text-[#38bdf8] font-semibold flex items-center gap-2 mb-4">
              <Monitor size={18} /> Editor
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/80">Font Size</label>
                <input 
                  type="range" min="12" max="24" 
                  value={settings.fontSize} 
                  onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                  className="w-48 accent-[#38bdf8]"
                />
                <span className="text-xs font-mono text-white/50 w-8 text-right">{settings.fontSize}px</span>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/80">Tab Size</label>
                <select 
                  value={settings.tabSize}
                  onChange={(e) => updateSettings({ tabSize: parseInt(e.target.value) })}
                  className="bg-[#141c2b] border border-white/10 rounded p-1 text-sm text-white w-24"
                >
                  <option value="2">2 spaces</option>
                  <option value="4">4 spaces</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/80">Word Wrap</label>
                <input 
                  type="checkbox" 
                  checked={settings.wordWrap}
                  onChange={(e) => updateSettings({ wordWrap: e.target.checked })}
                  className="accent-[#38bdf8] w-4 h-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/80">Minimap</label>
                <input 
                  type="checkbox" 
                  checked={settings.minimap}
                  onChange={(e) => updateSettings({ minimap: e.target.checked })}
                  className="accent-[#38bdf8] w-4 h-4"
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[#a855f7] font-semibold flex items-center gap-2 mb-4">
              <Sparkles size={18} /> AI & Modes
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm text-white/80 block">Beginner Mode</label>
                  <span className="text-xs text-white/50">Simpler explanations, educational focus</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.beginnerMode}
                  onChange={(e) => updateSettings({ beginnerMode: e.target.checked })}
                  className="accent-[#10b981] w-4 h-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm text-white/80 block">Vibe Mode</label>
                  <span className="text-xs text-white/50">Experimental AI features and proactive suggestions</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.vibeMode}
                  onChange={(e) => updateSettings({ vibeMode: e.target.checked })}
                  className="accent-[#a855f7] w-4 h-4"
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[#10b981] font-semibold flex items-center gap-2 mb-4">
              <Zap size={18} /> Execution
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm text-white/80 block">Execution Timeout</label>
                  <span className="text-xs text-white/50">Maximum time a program can run before being killed</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="range" min="1" max="30" 
                    value={settings.execTimeout} 
                    onChange={(e) => updateSettings({ execTimeout: parseInt(e.target.value) })}
                    className="w-32 accent-[#10b981]"
                  />
                  <span className="text-xs font-mono text-white/50 w-8 text-right">{settings.execTimeout}s</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </motion.div>
    </div>
  );
}
