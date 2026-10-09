import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  ArrowDownToLine,
  User,
  Copy,
  Check,
  Code,
  Loader2,
} from 'lucide-react';
import { useIdeStore } from '../../store/ideStore';
import { aiApi } from '../../lib/api';
import toast from 'react-hot-toast';

export const ChatPanel: React.FC = () => {
  const {
    code,
    language,
    chatMessages,
    isGeneratingChat,
    addChatMessage,
    setIsGeneratingChat,
    setCode,
  } = useIdeStore();

  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isGeneratingChat]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || isGeneratingChat) return;

    if (!customPrompt) setInput('');

    // Add user message
    addChatMessage({
      role: 'user',
      text: textToSend,
    });

    try {
      setIsGeneratingChat(true);
      const res = await aiApi.generateCode(textToSend, language, code);

      addChatMessage({
        role: 'ai',
        text: res.response,
        code: res.code || undefined,
      });
    } catch (err: any) {
      toast.error('Failed to get AI response.');
      addChatMessage({
        role: 'ai',
        text: 'Sorry, I encountered an issue connecting to the AI tutor. Please verify your GEMINI_API_KEY.',
      });
    } finally {
      setIsGeneratingChat(false);
    }
  };

  const handleInsertCode = (codeToInsert: string) => {
    setCode(codeToInsert);
    toast.success('Inserted code into editor buffer!', { icon: '📥' });
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d16] select-none">
      {/* Header bar */}
      <div className="h-10 bg-white/5 border-b border-white/10 px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span className="text-xs font-semibold text-[#f4f4f7]">AI Pair Programmer & Vibe Tutor</span>
        </div>
        <span className="text-[10px] text-cyan-300 font-mono bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
          Gemini 3.7 Flash
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1">
              {msg.role === 'ai' ? (
                <>
                  <div className="w-4 h-4 rounded bg-gradient-to-tr from-pink-500 to-violet-500 flex items-center justify-center text-[9px] text-white">
                    <Sparkles className="w-2.5 h-2.5" />
                  </div>
                  <span className="text-[10px] font-semibold text-pink-300">VibeFlow Tutor</span>
                </>
              ) : (
                <>
                  <span className="text-[10px] font-semibold text-cyan-300">You</span>
                  <User className="w-3 h-3 text-cyan-400" />
                </>
              )}
            </div>

            <div
              className={`max-w-[90%] rounded-xl p-3 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-tr-none shadow-md'
                  : 'glass-panel text-[#f4f4f7] rounded-tl-none border-white/10'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Code snippet block if returned */}
              {msg.code && (
                <div className="mt-2.5 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between mb-1.5 text-[10px] text-[#9a9ab0]">
                    <span className="flex items-center gap-1">
                      <Code className="w-3 h-3 text-cyan-400" /> Generated Snippet
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(msg.id, msg.code!)}
                        className="hover:text-white flex items-center gap-1"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                  <pre className="p-2 bg-black/50 rounded border border-white/5 text-[11px] font-mono overflow-x-auto text-emerald-300 max-h-48">
                    {msg.code}
                  </pre>
                  <button
                    onClick={() => handleInsertCode(msg.code!)}
                    className="mt-2 w-full py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    Insert into Editor Buffer
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isGeneratingChat && (
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-tr from-pink-500 to-violet-500 flex items-center justify-center text-[10px] text-white">
              <Sparkles className="w-3 h-3" />
            </div>
            <div className="glass-panel px-3 py-2 rounded-xl text-xs flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-pink-400" />
              <span className="ai-shimmer font-medium">VibeFlow is writing code & explanation...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-3 py-1.5 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto text-[10px] text-[#9a9ab0] shrink-0">
        <span className="shrink-0 text-white/50">Try:</span>
        <button
          onClick={() => handleSendMessage("Explain this code step-by-step for a beginner")}
          className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 whitespace-nowrap transition"
        >
          Beginner explanation
        </button>
        <button
          onClick={() => handleSendMessage("How can I optimize this algorithm's space complexity?")}
          className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 whitespace-nowrap transition"
        >
          Optimize space
        </button>
        <button
          onClick={() => handleSendMessage("Add clear educational comments to each step")}
          className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 whitespace-nowrap transition"
        >
          Add comments
        </button>
      </div>

      {/* Input box */}
      <div className="p-2.5 bg-white/5 border-t border-white/10 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-[#090910] border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-pink-500 transition"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI to generate, explain, or refactor code..."
            className="flex-1 bg-transparent text-xs text-[#f4f4f7] placeholder-[#9a9ab0] focus:outline-none"
            disabled={isGeneratingChat}
          />
          <button
            type="submit"
            disabled={!input.trim() || isGeneratingChat}
            className="p-1 rounded-lg bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:opacity-90 disabled:opacity-30 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
