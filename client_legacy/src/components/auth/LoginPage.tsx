import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { LogoFull } from '../ui/Logo';
import { Github, Mail } from 'lucide-react';
import { cn } from '../../lib/cn';

export const LoginPage: React.FC = () => {
  const { signInWithGoogle, signInWithGitHub, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      await signInWithGitHub();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#06090e] relative overflow-hidden flex items-center justify-center font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-8 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl relative z-10 shadow-2xl flex flex-col items-center"
      >
        <div className="mb-8">
          <LogoFull size={48} />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Code. Understand. Flow.</h1>
        <p className="text-gray-400 text-center mb-8">Your AI-powered coding environment</p>
        
        <div className="w-full flex flex-col gap-4">
          <button 
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium flex items-center justify-center gap-3 transition-colors"
          >
            <Mail size={20} className="text-cyan-400" />
            Continue with Google
          </button>
          
          <button 
            onClick={handleGitHubSignIn}
            className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium flex items-center justify-center gap-3 transition-colors"
          >
            <Github size={20} />
            Continue with GitHub
          </button>
        </div>
        
        <div className="w-full flex items-center gap-4 my-8 opacity-50">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/30"></div>
          <span className="text-xs text-white uppercase tracking-widest">Or</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/30"></div>
        </div>
        
        <p className="text-sm text-cyan-400 font-medium">Start building smarter.</p>
      </motion.div>
    </div>
  );
};
