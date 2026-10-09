import React, { useState } from 'react';
import {
  Sparkles,
  GitBranch,
  Cpu,
  Terminal,
  Play,
  ArrowRight,
  Shield,
  HelpCircle,
  Zap,
  Code2,
} from 'lucide-react';
import { User } from '../../types';

interface LandingPageProps {
  onLogin: (provider: string, email?: string, name?: string) => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  const [guestEmail, setGuestEmail] = useState('');
  const [showGuestForm, setShowGuestForm] = useState(false);

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col select-none overflow-y-auto">
      {/* Top Header */}
      <nav className="h-16 border-b border-white/5 px-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-glow-cyan">
            <svg
              className="w-5 h-5 text-white"
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
          <span className="font-extrabold text-lg tracking-tight">
            Vibe<span className="text-brand-cyan">Flow</span>
          </span>
        </div>

        <button
          onClick={() => onLogin('developer')}
          className="px-4 py-2 text-xs font-bold text-dark-950 bg-gradient-to-r from-brand-cyan to-brand-blue hover:opacity-90 rounded-lg shadow-glow-cyan transition-all flex items-center gap-1.5"
        >
          <span>Launch IDE</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 pt-16 pb-20 flex flex-col items-center text-center">
        {/* Release Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-brand-cyan mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation AI IDE for Vibe Coders & Students</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1]">
          Code.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-blue-400 to-purple-500">
            Understand.
          </span>{' '}
          Flow.
        </h1>

        {/* Tagline */}
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          The first browser IDE that explains <em>how</em> and <em>why</em> your code works.
          Real-time interactive flowcharts, input-sensitive complexity analysis, and beginner-friendly error translation.
        </p>

        {/* Auth Buttons Card */}
        <div className="mt-10 p-6 rounded-2xl bg-dark-900/90 border border-white/10 shadow-2xl backdrop-blur-xl w-full max-w-md space-y-3">
          <div className="text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">
            Sign In to Your Workspace
          </div>

          {/* Continue with Google */}
          <button
            onClick={() => onLogin('google')}
            className="w-full py-2.5 px-4 rounded-xl bg-dark-850 hover:bg-dark-800 border border-white/10 hover:border-slate-600 text-slate-200 font-semibold text-xs flex items-center justify-center gap-3 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Continue with GitHub */}
          <button
            onClick={() => onLogin('github')}
            className="w-full py-2.5 px-4 rounded-xl bg-dark-850 hover:bg-dark-800 border border-white/10 hover:border-slate-600 text-slate-200 font-semibold text-xs flex items-center justify-center gap-3 transition-all"
          >
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>Continue with GitHub</span>
          </button>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className="bg-dark-900 px-2 text-slate-500">or instant access</span>
            </div>
          </div>

          {/* Instant Developer / Guest Login */}
          <button
            onClick={() => onLogin('developer', 'alex.rivera@vibeflow.dev', 'Alex Rivera')}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-dark-950 font-bold text-xs flex items-center justify-center gap-2 shadow-glow-cyan hover:opacity-95 transition-all"
          >
            <Zap className="w-4 h-4 fill-dark-950" />
            <span>Instant Developer Access (No Setup)</span>
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left max-w-6xl">
          {/* Card 1 */}
          <div className="p-6 rounded-xl bg-dark-900/60 border border-white/5 space-y-3 hover:border-brand-cyan/30 transition-colors">
            <div className="p-2.5 w-fit rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan">
              <GitBranch className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Side-by-Side Flowcharts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real nodes, decision diamonds, loops with back-edges, and bi-directional code highlighting. Click a node to inspect lines.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-xl bg-dark-900/60 border border-white/5 space-y-3 hover:border-amber-400/30 transition-colors">
            <div className="p-2.5 w-fit rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Input-Sensitive Complexity</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Distinguishes theoretical asymptotic bounds (O(n log n)) from observed execution iterations and state pruning.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-xl bg-dark-900/60 border border-white/5 space-y-3 hover:border-rose-400/30 transition-colors">
            <div className="p-2.5 w-fit rounded-lg bg-rose-400/10 border border-rose-400/20 text-rose-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Beginner Error Explainer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Translates cryptic compiler diagnostics into kind, step-by-step explanations with 1-click automatic code repair.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-xl bg-dark-900/60 border border-white/5 space-y-3 hover:border-emerald-400/30 transition-colors">
            <div className="p-2.5 w-fit rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-400">
              <Play className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Real Code Execution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Native g++ (C++) and Python 3 runner with stdin piping, millisecond execution timers, and 5-second process limits.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-xl bg-dark-900/60 border border-white/5 space-y-3 hover:border-purple-400/30 transition-colors">
            <div className="p-2.5 w-fit rounded-lg bg-purple-400/10 border border-purple-400/20 text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Vibe Coding Mode</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Describe problems in natural language. VibeFlow synthesizes code, builds diagrams, and configures edge test cases.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-xl bg-dark-900/60 border border-white/5 space-y-3 hover:border-blue-400/30 transition-colors">
            <div className="p-2.5 w-fit rounded-lg bg-blue-400/10 border border-blue-400/20 text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Offline Resilience</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deterministic AST control-flow engine keeps flowcharts and execution running smoothly even without an API key.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-white/5 text-center text-xs text-slate-600 font-mono">
        VibeFlow — AI Powered IDE • Designed for Vibe Coders, Students & Educators
      </footer>
    </div>
  );
}
