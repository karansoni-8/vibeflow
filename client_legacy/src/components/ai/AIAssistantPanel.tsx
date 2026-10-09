import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../api/client';
import { Bot, Send, Sparkles, User, CornerDownLeft, Zap } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface AIAssistantPanelProps {
  currentCode: string;
  currentLanguage: string;
  beginnerMode: boolean;
  onApplyCode?: (code: string) => void;
}

export function AIAssistantPanel({
  currentCode,
  currentLanguage,
  beginnerMode,
  onApplyCode,
}: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-0',
      sender: 'ai',
      text: `Hello! I am your VibeFlow AI pair programmer and DSA tutor.
I have full context of your active ${currentLanguage} code. Ask me to explain logic, find edge-case bugs, optimize complexity, or write new algorithms!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickPrompts = [
    'Explain this algorithm step-by-step',
    'Why is the time complexity what it is?',
    'Find potential edge-case bugs',
    'How can this be optimized?',
  ];

  const handleSend = async (userText?: string) => {
    const textToSend = (userText || input).trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Call AI endpoint
      const promptWithContext = `User question: "${textToSend}"
Language: ${currentLanguage}
Beginner mode: ${beginnerMode ? 'Yes' : 'No'}
Active code:
\`\`\`${currentLanguage}
${currentCode}
\`\`\``;

      const res = await api.aiGenerateCode(promptWithContext, currentLanguage);

      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'ai',
        text: res.code || 'I reviewed your code. Let me know if you would like me to optimize or clarify any line!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'ai',
          text: `Service response: ${err.message || 'Unable to connect to AI engine'}. Check your server/.env configuration.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-dark-950 font-mono text-xs overflow-hidden select-text">
      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-dark-900 border-b border-slate-800 overflow-x-auto select-none">
        <span className="text-[10px] text-slate-500 flex items-center gap-1 shrink-0">
          <Zap className="w-3 h-3 text-amber-400" /> Prompts:
        </span>
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            disabled={loading}
            className="px-2.5 py-1 rounded-full bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-brand-cyan text-[10px] transition-colors border border-white/5 shrink-0"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Message History */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                m.sender === 'user' ? 'bg-brand-blue/20 text-brand-blue' : 'bg-brand-cyan/20 text-brand-cyan'
              }`}
            >
              {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[80%] rounded-xl p-3 leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-brand-blue/20 text-blue-100 border border-brand-blue/30'
                  : 'bg-dark-900 border border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1 text-[9px] text-slate-500 font-mono">
                <span>{m.sender === 'user' ? 'You' : 'VibeFlow AI'}</span>
                <span>{m.timestamp}</span>
              </div>
              <div className="font-sans text-xs">{m.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-brand-cyan text-xs italic">
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
            Analyzing code context with Gemini...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-dark-900 border-t border-slate-800">
        <div className="flex items-center gap-2 bg-dark-950 border border-slate-800 rounded-lg px-3 py-1.5 focus-within:border-brand-cyan/50">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask VibeFlow AI about current code, algorithms, or bugs..."
            disabled={loading}
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none text-xs font-sans"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="p-1 text-slate-400 hover:text-brand-cyan disabled:opacity-30 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
