import React from 'react';
import { 
  Play, Square, Sparkles, BookOpen, Zap, BarChart3, 
  GitBranch, TestTube, AlignLeft, GraduationCap, Wand2, Settings, User
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useIdeStore } from '@/store/ideStore';

export default function Toolbar() {
  const { isRunning, runCode, stopCode, settings, toggleBeginnerMode, toggleVibeMode } = useIdeStore();

  const ActionButton = ({ icon: Icon, label, onClick, active = false, color = "text-white", disabled = false, bg = "" }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={cn(
        "p-2 rounded-md transition-all flex items-center justify-center relative group",
        active ? "bg-white/10 text-[#38bdf8]" : "hover:bg-white/5",
        color,
        bg,
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <Icon size={18} />
      <span className="absolute -bottom-8 bg-[#141c2b] border border-white/10 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">
        {label}
      </span>
    </button>
  );

  return (
    <div className="h-12 border-b border-white/10 bg-[#0b0f17]/80 backdrop-blur flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2 font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#a855f7]">
        <Sparkles size={20} className="text-[#38bdf8]" />
        VibeFlow
      </div>

      <div className="flex items-center gap-1 border border-white/10 rounded-lg p-1 bg-black/20">
        {!isRunning ? (
          <ActionButton icon={Play} label="Run (Ctrl+Enter)" onClick={runCode} color="text-[#10b981]" bg="hover:bg-[#10b981]/10" />
        ) : (
          <ActionButton icon={Square} label="Stop" onClick={stopCode} color="text-[#f43f5e]" bg="hover:bg-[#f43f5e]/10" />
        )}
        <div className="w-px h-5 bg-white/10 mx-1" />
        <ActionButton icon={Sparkles} label="AI Generate (Ctrl+K)" color="text-[#a855f7]" bg="hover:bg-[#a855f7]/10" />
        <ActionButton icon={BookOpen} label="Explain Code" />
        <ActionButton icon={Zap} label="Improve Code" />
        <ActionButton icon={BarChart3} label="Complexity Analysis" />
        <ActionButton icon={GitBranch} label="Generate Flowchart" />
        <ActionButton icon={TestTube} label="Generate Tests" />
        <ActionButton icon={AlignLeft} label="Format Document" />
      </div>

      <div className="flex items-center gap-2">
        <ActionButton 
          icon={GraduationCap} 
          label="Beginner Mode" 
          active={settings?.beginnerMode} 
          onClick={toggleBeginnerMode}
          color={settings?.beginnerMode ? "text-[#10b981]" : "text-white/70"}
        />
        <ActionButton 
          icon={Wand2} 
          label="Vibe Mode" 
          active={settings?.vibeMode} 
          onClick={toggleVibeMode}
          color={settings?.vibeMode ? "text-[#a855f7]" : "text-white/70"}
        />
        <div className="w-px h-5 bg-white/10 mx-1" />
        <ActionButton icon={Settings} label="Settings" />
        <ActionButton icon={User} label="Profile" />
      </div>
    </div>
  );
}
