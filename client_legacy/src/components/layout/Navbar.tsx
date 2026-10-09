import React from 'react';
import {
  Play,
  Wand2,
  Check,
  Save,
  Cpu,
  Sparkles,
  Settings,
  User as UserIcon,
  LogOut,
  HelpCircle,
  Command,
  GitBranch,
} from 'lucide-react';
import { Project, User } from '../../types';

interface NavbarProps {
  project: Project | null;
  user: User | null;
  isRunning?: boolean;
  isSaving?: boolean;
  beginnerMode: boolean;
  onToggleBeginnerMode: () => void;
  onRun: () => void;
  onOpenVibeMode: () => void;
  onExplainCode: () => void;
  onImproveCode: () => void;
  onAnalyzeComplexity: () => void;
  onOpenSettings: () => void;
  onOpenCommandPalette: () => void;
  onLogout: () => void;
  onOpenDashboard: () => void;
}

export function Navbar({
  project,
  user,
  isRunning,
  isSaving,
  beginnerMode,
  onToggleBeginnerMode,
  onRun,
  onOpenVibeMode,
  onExplainCode,
  onImproveCode,
  onAnalyzeComplexity,
  onOpenSettings,
  onOpenCommandPalette,
  onLogout,
  onOpenDashboard,
}: NavbarProps) {
  return (
    <header className="h-12 bg-dark-900 border-b border-white/5 px-3 flex items-center justify-between select-none z-20">
      {/* Brand Logo & Project Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenDashboard}
          className="flex items-center gap-2 group text-left hover:opacity-90 transition-opacity"
        >
          {/* Custom SVG Logo Mark */}
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-glow-cyan">
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="4 7 12 17 20 7" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-white font-sans">
                Vibe<span className="text-brand-cyan">Flow</span>
              </span>
              <span className="text-[9px] font-mono uppercase bg-white/5 text-slate-400 px-1.5 py-0.2 rounded border border-white/10">
                IDE
              </span>
            </div>
            <div className="text-[9px] text-slate-400 font-mono tracking-wider -mt-0.5">
              Code. Understand. Flow.
            </div>
          </div>
        </button>

        <div className="h-4 w-px bg-white/10 mx-1" />

        {/* Project Name Breadcrumb */}
        <button
          onClick={onOpenDashboard}
          className="text-xs font-medium text-slate-300 hover:text-white px-2 py-1 rounded hover:bg-dark-800 transition-colors flex items-center gap-1.5"
        >
          <span className="text-slate-500">Project /</span>
          <span className="font-semibold text-slate-100">{project?.name || 'Workspace'}</span>
        </button>

        {/* Autosave Status */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400">
          {isSaving ? (
            <span className="flex items-center gap-1 text-amber-400">
              <Save className="w-3 h-3 animate-spin" /> Saving...
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-400/80">
              <Check className="w-3 h-3" /> Saved ✓
            </span>
          )}
        </div>
      </div>

      {/* Middle Action Bar */}
      <div className="flex items-center gap-2">
        {/* Run Button */}
        <button
          onClick={onRun}
          disabled={isRunning}
          className="px-4 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
          title="Run code (Ctrl + Enter)"
        >
          <Play className="w-3.5 h-3.5 fill-dark-950" />
          <span>{isRunning ? 'Running...' : 'Run'}</span>
          <span className="hidden md:inline text-[10px] opacity-75 font-mono">^Enter</span>
        </button>

        {/* Vibe Mode CTA */}
        <button
          onClick={onOpenVibeMode}
          className="px-3.5 py-1.5 rounded-md bg-gradient-to-r from-purple-600 to-brand-cyan hover:opacity-90 text-white font-bold text-xs flex items-center gap-1.5 shadow-glow-purple transition-all active:scale-95"
          title="Vibe Coding: Generate code from intent"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Vibe Mode</span>
        </button>

        {/* AI Action Buttons */}
        <div className="hidden lg:flex items-center gap-1 bg-dark-850 p-0.5 rounded-md border border-white/5 text-xs">
          <button
            onClick={onExplainCode}
            className="px-2.5 py-1 rounded hover:bg-dark-750 text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-brand-cyan" />
            Explain
          </button>
          <button
            onClick={onAnalyzeComplexity}
            className="px-2.5 py-1 rounded hover:bg-dark-750 text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
          >
            <Cpu className="w-3 h-3 text-amber-400" />
            Complexity
          </button>
          <button
            onClick={onImproveCode}
            className="px-2.5 py-1 rounded hover:bg-dark-750 text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            Improve
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-dark-850 hover:bg-dark-800 text-slate-400 hover:text-slate-200 border border-white/5 text-[11px] font-mono transition-colors"
          title="Command Palette (Ctrl + K)"
        >
          <Command className="w-3 h-3" />
          <span>Ctrl K</span>
        </button>

        {/* Beginner Mode Toggle */}
        <button
          onClick={onToggleBeginnerMode}
          className={`px-2.5 py-1 rounded-md text-[11px] font-mono flex items-center gap-1.5 border transition-all ${
            beginnerMode
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
              : 'bg-dark-850 border-white/5 text-slate-400 hover:text-slate-200'
          }`}
          title={beginnerMode ? 'Beginner Mode is ON: simple analogies & detailed explanations' : 'Beginner Mode is OFF'}
        >
          <HelpCircle className="w-3 h-3" />
          <span className="hidden md:inline">Beginner</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded hover:bg-dark-800 text-slate-400 hover:text-white transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Profile / Logout */}
        <div className="flex items-center gap-2 pl-1">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-6 h-6 rounded-full ring-1 ring-white/10"
              title={user.name}
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
              <UserIcon className="w-3.5 h-3.5" />
            </div>
          )}
          <button
            onClick={onLogout}
            className="p-1.5 rounded hover:bg-dark-800 text-slate-400 hover:text-rose-400 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
