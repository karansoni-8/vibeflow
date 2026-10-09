import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Loader2, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, loginWithGithub, loginAsGuest, loading } = useAuth();
  const [inProgress, setInProgress] = useState<string | null>(null);

  const handleGoogle = async () => {
    try {
      setInProgress('google');
      await loginWithGoogle();
      toast.success('Signed in with Google!');
      navigate('/ide');
    } catch (err: any) {
      toast.error('Google Sign In cancelled or not configured in Firebase yet. You can use Guest Demo Mode!');
    } finally {
      setInProgress(null);
    }
  };

  const handleGithub = async () => {
    try {
      setInProgress('github');
      await loginWithGithub();
      toast.success('Signed in with GitHub!');
      navigate('/ide');
    } catch (err: any) {
      toast.error('GitHub Sign In cancelled or not configured in Firebase yet. You can use Guest Demo Mode!');
    } finally {
      setInProgress(null);
    }
  };

  const handleGuest = () => {
    loginAsGuest();
    toast.success('Signed in as Guest (Local Dev Mode)', { icon: '🚀' });
    navigate('/ide');
  };

  return (
    <div className="min-h-screen w-full bg-[#05050a] text-[#f4f4f7] relative flex items-center justify-center p-4 select-none overflow-hidden">
      {/* Background Animated Blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-violet-600/25 rounded-full blur-[100px] pointer-events-none ambient-blob-1" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-500/25 rounded-full blur-[100px] pointer-events-none ambient-blob-2" />

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-xs text-[#9a9ab0] hover:text-white transition z-20"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Overview
      </button>

      {/* Login Card */}
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10 space-y-6 relative z-10 shadow-2xl backdrop-blur-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center mx-auto shadow-glow-violet shadow-sm">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Welcome to VibeFlow</h2>
          <p className="text-xs text-[#9a9ab0]">
            Sign in to access your AI-powered educational IDE workspace.
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          {/* Google Sign In */}
          <button
            onClick={handleGoogle}
            disabled={loading || inProgress !== null}
            className="w-full py-2.5 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            {inProgress === 'google' ? (
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* GitHub Sign In */}
          <button
            onClick={handleGithub}
            disabled={loading || inProgress !== null}
            className="w-full py-2.5 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            {inProgress === 'github' ? (
              <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
            ) : (
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            )}
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#0e0e1a] px-2 text-[10px] text-[#9a9ab0] uppercase tracking-wider relative">
            Or local presentation mode
          </span>
        </div>

        {/* Guest Demo Login */}
        <div>
          <button
            onClick={handleGuest}
            className="w-full py-2.5 px-4 rounded-xl gradient-btn text-xs font-semibold shadow-glow-violet flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Continue as Guest / Local Dev Mode</span>
          </button>
          <p className="text-[10px] text-center text-[#9a9ab0] mt-2">
            Instant 1-click access to all 5 differentiators without external account setup.
          </p>
        </div>

        <div className="pt-2 text-center text-[11px] text-[#9a9ab0] flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Local secure token session</span>
        </div>
      </div>
    </div>
  );
};
