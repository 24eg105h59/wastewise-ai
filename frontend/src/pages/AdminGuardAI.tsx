import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Sparkles, Database, Loader2, User, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const AdminGuardAI = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: `Hello ${user?.name?.split(' ')[0] || 'Admin'}! 👋 I'm **Guide AI (GuardAI)**, your live Gemini-powered operations and inventory co-pilot for **HD Bakers**.\n\nI'm connected to your live inventory, expiry alerts, and staff task board. I can chat with you like a human partner, provide live business briefings, or solve food safety, kitchen, and bakery problems.\n\nHow can I help you today? Try saying *"Hi, what's new?"* or asking about inventory recommendations!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      // Send conversation history to the live backend API
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: newHistory.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        const aiReply: ChatMessage = {
          role: 'assistant',
          content: data.reply || "I'm right here with you! How else can I assist your operations today?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiReply]);
      } else {
        const err = await res.json().catch(() => ({}));
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `I ran into a temporary connection issue (${err.error || 'Request failed'}). Let me know what you'd like to check and I'll try again!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm currently unable to connect to the server. Please check your network connection and try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  const clearChat = () => {
    setMessages([
      { 
        role: 'assistant', 
        content: `Chat history reset. Hello ${user?.name?.split(' ')[0] || 'Admin'}! What would you like to explore today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-5xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <span className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl shadow-md shadow-blue-500/20">
                <Bot size={24} />
              </span>
              Guide AI
            </h1>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm">
              Gemini Powered
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
            <Sparkles size={14} className="text-amber-500" /> Conversational culinary, food safety, and live inventory intelligence
          </p>
        </div>

        <button 
          onClick={clearChat}
          className="self-start sm:self-auto text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw size={13} /> New Conversation
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 bg-gradient-to-b from-gray-50/70 to-white custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <Bot size={18} />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-5 py-4 shadow-sm text-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-gray-100 text-blue-600 font-bold text-xs uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={13} className="text-amber-500" /> Guide AI
                    </span>
                    {msg.timestamp && (
                      <span className="text-[10px] text-gray-400 font-normal lowercase tracking-normal">
                        {msg.timestamp}
                      </span>
                    )}
                  </div>
                )}

                <div className="leading-relaxed whitespace-pre-wrap space-y-2">
                  {msg.content}
                </div>

                {msg.role === 'user' && msg.timestamp && (
                  <div className="text-right text-[10px] text-blue-200 mt-1.5">
                    {msg.timestamp}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm mt-1 font-bold text-xs">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={18} />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm text-xs text-gray-500 flex items-center gap-2">
                <Loader2 size={15} className="animate-spin text-blue-600" />
                <span>Guide AI is thinking and analyzing live data...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input & Quick Chips */}
        <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2 mb-3 overflow-x-auto custom-scrollbar pb-1">
            <button 
              type="button" 
              onClick={() => handleQuickPrompt("Hi, what's new today?")} 
              className="shrink-0 text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-full hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-1"
            >
              👋 "Hi, what's new today?"
            </button>
            <button 
              type="button" 
              onClick={() => handleQuickPrompt("What products are expiring soon and need immediate kitchen use?")} 
              className="shrink-0 text-xs bg-amber-50 text-amber-800 font-bold px-3 py-1.5 rounded-full hover:bg-amber-100 border border-amber-200 transition-colors flex items-center gap-1"
            >
              ⏰ "What expires soon?"
            </button>
            <button 
              type="button" 
              onClick={() => handleQuickPrompt("How can we reduce bakery waste and keep bread fresh longer?")} 
              className="shrink-0 text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-full hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1"
            >
              🍞 "How to reduce waste?"
            </button>
            <button 
              type="button" 
              onClick={() => handleQuickPrompt("What are the recommended safe storage temperatures for dairy and produce?")} 
              className="shrink-0 text-xs bg-slate-50 text-slate-700 font-bold px-3 py-1.5 rounded-full hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1"
            >
              🌡️ "Safe storage temps?"
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything, say hello, or request problem-solving guidance..."
              className="w-full pl-5 pr-14 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm"
              disabled={isTyping}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors shadow-sm"
            >
              {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminGuardAI;
