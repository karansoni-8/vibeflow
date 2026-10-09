import React from 'react';
import {
  Play,
  Loader2,
  Sparkles,
  Command,
  BookOpen,
  LogOut,
  User as UserIcon,
  Check,
  ChevronDown,
} from 'lucide-react';
import { useIdeStore } from '../../store/ideStore';
import { useAuth } from '../../hooks/useAuth';
import { executeApi, aiApi } from '../../lib/api';
import toast from 'react-hot-toast';

export const Navbar: React.FC = () => {
  const {
    language,
    code,
    stdin,
    isExecuting,
    setIsExecuting,
    setExecutionResult,
    setActiveTabBottom,
    setActiveTabRight,
    setLanguage,
    loadSnippet,
    setIsCommandPaletteOpen,
    setErrorDoctorReport,
    setIsDiagnosingError,
    setErrorBadgeCount,
  } = useIdeStore();

  const { user, logout } = useAuth();
  const [isSnippetsOpen, setIsSnippetsOpen] = React.useState(false);

  const handleRunCode = async () => {
    if (isExecuting) return;

    try {
      setIsExecuting(true);
      setActiveTabBottom('output');

      const result = await executeApi.runCode(language, code, stdin);
      setExecutionResult(result);

      // Check for errors (non-zero exit code or stderr)
      if (result.exitCode !== 0 || (result.stderr && result.stderr.trim().length > 0)) {
        toast.error(`Execution finished with error (Code ${result.exitCode})`, {
          icon: '⚠️',
          style: { background: '#18111e', color: '#f87171', border: '1px solid #3b1828' },
        });

        // Automatically trigger Error Doctor
        setIsDiagnosingError(true);
        setActiveTabRight('error');
        setErrorBadgeCount(1);

        try {
          const doctorRes = await aiApi.explainError(code, language, result.stderr || 'Runtime error');
          setErrorDoctorReport(doctorRes);
        } catch (doctorErr) {
          console.warn('Error doctor analysis failed:', doctorErr);
        } finally {
          setIsDiagnosingError(false);
        }
      } else {
        toast.success(`Ran successfully in ${result.durationMs}ms`, {
          icon: '🚀',
          style: { background: '#0e1a18', color: '#34d399', border: '1px solid #133a2e' },
        });
      }
    } catch (err: any) {
      console.error('Run code error:', err);
      toast.error(err.message || 'Execution failed');
      setExecutionResult({
        stdout: '',
        stderr: err.message || 'Unknown execution failure',
        exitCode: 1,
        durationMs: 0,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <header className="h-14 bg-[#0d0d16]/90 backdrop-blur-md border-b border-white/10 px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Wordmark & Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center shadow-glow-violet shadow-sm">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight gradient-text">VibeFlow</span>
            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
              AI IDE
            </span>
          </div>
          <span className="text-[10px] text-[#9a9ab0] -mt-1 hidden sm:inline">Learn DSA with visual flow</span>
        </div>
      </div>

      {/* Center Actions: Language & Snippets */}
      <div className="flex items-center gap-2">
        {/* Language selector */}
        <div className="relative flex items-center">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#f4f4f7] font-medium hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition cursor-pointer appearance-none pr-8"
          >
            <option value="python" className="bg-[#0d0d16]">Python 3.12</option>
            <option value="c++" className="bg-[#0d0d16]">C++ (g++ 10.2)</option>
            <option value="c" className="bg-[#0d0d16]">C (gcc 10.2)</option>
            <option value="javascript" className="bg-[#0d0d16]">JavaScript (Node 24)</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#9a9ab0] absolute right-2.5 pointer-events-none" />
        </div>

        {/* DSA Algorithm Library Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSnippetsOpen(!isSnippetsOpen)}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#9a9ab0] hover:text-white transition"
            title="Load standard DSA / DAA reference problems"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">DSA Library</span>
            <ChevronDown className="w-3 h-3 text-[#9a9ab0]" />
          </button>

          {isSnippetsOpen && (
            <div
              className="absolute left-0 mt-2 w-56 glass-panel py-1.5 z-50 shadow-2xl animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setIsSnippetsOpen(false)}
            >
              <div className="px-3 py-1 text-[10px] font-semibold text-[#9a9ab0] uppercase tracking-wider">
                Algorithms (DSA/DAA)
              </div>
              <button
                onClick={() => {
                  loadSnippet('c++');
                  setIsSnippetsOpen(false);
                  toast.success('Loaded Binary Search (C++)');
                }}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/10 flex items-center justify-between text-[#f4f4f7]"
              >
                <span>Binary Search</span>
                <span className="text-[10px] text-violet-400">O(log n)</span>
              </button>
              <button
                onClick={() => {
                  loadSnippet('javascript');
                  setIsSnippetsOpen(false);
                  toast.success('Loaded Merge Sort (JS)');
                }}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/10 flex items-center justify-between text-[#f4f4f7]"
              >
                <span>Merge Sort</span>
                <span className="text-[10px] text-cyan-400">O(n log n)</span>
              </button>
              <button
                onClick={() => {
                  loadSnippet('python');
                  setIsSnippetsOpen(false);
                  toast.success('Loaded Fibonacci Memoization (Python)');
                }}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/10 flex items-center justify-between text-[#f4f4f7]"
              >
                <span>Fibonacci (Memoized)</span>
                <span className="text-[10px] text-emerald-400">O(n) DP</span>
              </button>
              <button
                onClick={() => {
                  loadSnippet('nqueens');
                  setIsSnippetsOpen(false);
                  toast.success('Loaded N-Queens Backtracking');
                }}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/10 flex items-center justify-between text-[#f4f4f7]"
              >
                <span>N-Queens (Pruning)</span>
                <span className="text-[10px] text-amber-400">Backtracking</span>
              </button>
              <button
                onClick={() => {
                  loadSnippet('jobsequencing');
                  setIsSnippetsOpen(false);
                  toast.success('Loaded Job Sequencing with Deadlines');
                }}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/10 flex items-center justify-between text-[#f4f4f7]"
              >
                <span>Job Sequencing</span>
                <span className="text-[10px] text-pink-400">Greedy</span>
              </button>
            </div>
          )}
        </div>

        {/* Command Palette Trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden lg:flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#9a9ab0] hover:text-white transition"
          title="Open Command Palette (Ctrl+K)"
        >
          <Command className="w-3.5 h-3.5" />
          <span>Search</span>
          <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/70">Ctrl+K</kbd>
        </button>
      </div>

      {/* Right Controls: Run button & Profile */}
      <div className="flex items-center gap-3">
        {/* Autosave status indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#9a9ab0]">
          <Check className="w-3 h-3 text-emerald-400" />
          <span>Saved</span>
        </div>

        {/* Run Button */}
        <button
          onClick={handleRunCode}
          disabled={isExecuting}
          className="gradient-btn px-4 py-1.5 rounded-lg flex items-center gap-2 text-xs shadow-glow-violet disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          title="Run Code (Ctrl+Enter)"
        >
          {isExecuting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run</span>
              <kbd className="hidden sm:inline text-[9px] bg-white/20 px-1 py-0.5 rounded font-mono">
                Ctrl+Enter
              </kbd>
            </>
          )}
        </button>

        {/* User Avatar & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-500 flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-3.5 h-3.5" />
            )}
          </div>
          <button
            onClick={logout}
            className="text-[#9a9ab0] hover:text-rose-400 p-1 rounded hover:bg-white/5 transition"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
