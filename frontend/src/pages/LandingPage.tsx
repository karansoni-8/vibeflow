import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  GitFork,
  HelpCircle,
  AlertTriangle,
  Activity,
  Terminal,
  ArrowRight,
  Code,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsGuest, isAuthenticated } = useAuth();

  const handleLaunch = () => {
    if (isAuthenticated) {
      navigate('/ide');
    } else {
      navigate('/login');
    }
  };

  const handleInstantDemo = () => {
    loginAsGuest();
    navigate('/ide');
  };

  return (
    <div className="min-h-screen w-full bg-[#05050a] text-[#f4f4f7] relative overflow-x-hidden select-none font-sans">
      {/* Background Animated Ambient Blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none ambient-blob-1" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none ambient-blob-2" />

      {/* Navigation Header */}
      <nav className="h-16 px-6 sm:px-12 flex items-center justify-between border-b border-white/10 backdrop-blur-md sticky top-0 z-40 bg-[#05050a]/70">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center shadow-glow-violet shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight gradient-text">VibeFlow</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleInstantDemo}
            className="px-3.5 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition cursor-pointer"
          >
            Quick Demo (Guest)
          </button>
          <button
            onClick={handleLaunch}
            className="px-4 py-1.5 rounded-lg gradient-btn text-xs font-semibold shadow-glow-violet flex items-center gap-1.5 cursor-pointer"
          >
            <span>Launch IDE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The AI-Native Code Editor Built for Algorithmic Thinking</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Code. Visualize. <span className="gradient-text">Understand.</span>
        </h1>

        <p className="text-base sm:text-lg text-[#9a9ab0] max-w-2xl mx-auto leading-relaxed">
          Traditional IDEs dump intimidating stack traces and explain nothing. VibeFlow sits in the gap: it executes real code, renders real-time standard flowcharts, explains Big-O variance across cases, and translates errors into plain English.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={handleInstantDemo}
            className="w-full sm:w-auto px-6 py-3 rounded-xl gradient-btn text-sm font-semibold shadow-glow-violet flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch VibeFlow IDE (Instant Demo)</span>
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-sm font-medium text-white transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Sign In with Google / GitHub</span>
          </button>
        </div>
      </section>

      {/* The 5 Flagship Differentiators Grid */}
      <section className="py-16 px-6 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Built for DSA Students & Vibe Coders
          </h2>
          <p className="text-xs sm:text-sm text-[#9a9ab0]">
            Every feature is fully functional and designed to teach algorithmic intuition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Feature 1 */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3 hover:border-violet-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <GitFork className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">1. Real-Time Mermaid Flowchart</h3>
            <p className="text-xs text-[#9a9ab0] leading-relaxed">
              Standard shapes: stadium terminals, decision rhombuses with labeled Yes/No branches, process rectangles, and visible loop back-edges updated as you code.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3 hover:border-cyan-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">2. Explainer & Complexity Engine</h3>
            <p className="text-xs text-[#9a9ab0] leading-relaxed">
              Plain-English summary, line-by-line breakdown, and 3-card Best/Average/Worst Big-O bounds with concrete justification for why runtime varies.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3 hover:border-rose-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">3. Error Doctor & 1-Click Repair</h3>
            <p className="text-xs text-[#9a9ab0] leading-relaxed">
              Raw compiler diagnostics translated into plain-English root causes and step-by-step remedies, with a verified 1-click &quot;Apply Fix&quot; button.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3 hover:border-amber-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">4. Real OS Terminal + Output Console</h3>
            <p className="text-xs text-[#9a9ab0] leading-relaxed">
              Interactive <code className="text-amber-300">node-pty</code> terminal for real commands (<code className="text-amber-300">pip install</code>, <code className="text-amber-300">npm</code>, <code className="text-amber-300">dir</code>) plus a clean Programiz-style output console.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3 hover:border-emerald-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">5. Input-Aware Empirical Complexity</h3>
            <p className="text-xs text-[#9a9ab0] leading-relaxed">
              Automated multi-size input sweeps measuring wall-clock time on Recharts, empirically showing how backtracking pruning keeps N-Queens far faster than 2^N.
            </p>
          </div>

          {/* Complete IDE */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3 hover:border-pink-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Full IDE Experience</h3>
            <p className="text-xs text-[#9a9ab0] leading-relaxed">
              Monaco editor with JetBrains Mono font ligatures, multi-language support (Python, C++, C, JavaScript), AI pair programmer chat, and preloaded DSA templates.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10 text-center text-xs text-[#9a9ab0]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="font-bold text-sm gradient-text">VibeFlow</span>
          <span>— Final-Year Computer Science Capstone Project</span>
        </div>
        <p>Production-grade, locally-runnable educational IDE built for algorithmic thinking.</p>
      </footer>
    </div>
  );
};
