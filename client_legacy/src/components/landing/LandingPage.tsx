import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, GitBranch, BarChart3, AlertTriangle, Shield, GraduationCap } from 'lucide-react';
import { LogoFull } from '../ui/Logo';

const features = [
  { icon: <Brain size={24} className="text-cyan-400" />, title: 'AI Coding', description: 'Generate, explain, and improve code with AI' },
  { icon: <GitBranch size={24} className="text-purple-400" />, title: 'Smart Flowcharts', description: 'Visualize your code logic in real-time' },
  { icon: <BarChart3 size={24} className="text-emerald-400" />, title: 'Complexity Analysis', description: 'Understand time and space complexity' },
  { icon: <AlertTriangle size={24} className="text-yellow-400" />, title: 'Error Explainer', description: 'Beginner-friendly error explanations' },
  { icon: <Shield size={24} className="text-blue-400" />, title: 'Secure Execution', description: 'Run code safely in sandboxed environments' },
  { icon: <GraduationCap size={24} className="text-pink-400" />, title: 'Beginner Mode', description: 'Learn with step-by-step explanations' },
];

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#06090e] text-white overflow-hidden selection:bg-cyan-500/30 font-sans">
      <nav className="fixed top-0 w-full z-50 bg-[#06090e]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <LogoFull size={32} />
          <div className="flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Features</a>
            <Link to="/login" className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors">
              Start Coding
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 relative">
        {/* Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center mt-20 mb-32 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-7xl md:text-9xl font-extrabold tracking-tight mb-6 leading-none">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Code.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Understand.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Flow.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
              VibeFlow is an AI-powered IDE built for the way modern developers learn and create.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/login" className="px-8 py-4 bg-white text-black font-bold rounded-full text-lg hover:scale-105 transition-transform flex items-center gap-2">
                Start Coding &rarr;
              </Link>
              <a href="#features" className="text-gray-400 hover:text-white font-medium flex items-center gap-2 transition-colors">
                Explore Features &darr;
              </a>
            </div>
          </motion.div>
        </div>

        <div id="features" className="max-w-7xl mx-auto relative z-10 pt-20">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {}
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                }}
                className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-colors group backdrop-blur-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      <footer className="py-8 text-center text-gray-500 text-sm border-t border-white/5">
        Built with ❤️ for developers who want to understand their code
      </footer>
    </div>
  );
};
