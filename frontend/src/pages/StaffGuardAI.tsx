import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Sparkles, Loader2, User, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const StaffGuardAI = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: `Hey ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your **Guide AI** assistant for HD Bakers.\n\nAsk me about ingredient storage, prep rotations, or shift tasks!`,
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
        setMessages(prev => [
          ...prev, 
          {
            role: 'assistant',
            content: data.reply || "Got it! How else can I help you on the floor right now?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        const err = await res.json().catch(() => ({}));
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `I hit a small issue (${err.error || 'Connection failed'}). What else can I look up for you?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      console.error('Staff chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I had trouble reaching the server. Please try asking again in a second!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-4xl mx-auto p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl shadow-md shadow-blue-500/20">
              <Bot size={24} />
            </span>
            Staff Guide AI
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Your friendly kitchen and floor assistant. Ask any question in plain language!
          </p>
        </div>
        <button
          onClick={() => setMessages([{
            role: 'assistant',
            content: `Chat cleared! Hello ${user?.name?.split(' ')[0] || 'there'}! What's your question?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }])}
          className="text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw size={13} /> Clear
        </button>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gray-50/70 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <Bot size={18} />
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm text-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
              }`}>
                <div className="leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>
                {msg.timestamp && (
                  <div className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-blue-200 text-right' : 'text-gray-400'}`}>
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
                <span>Guide AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2 mb-3 overflow-x-auto custom-scrollbar pb-1">
            <button 
              type="button" 
              onClick={() => handleSend("Hi, what's new on the floor today?")} 
              className="shrink-0 text-xs bg-gray-100 text-gray-700 font-bold px-3 py-1.5 rounded-full hover:bg-gray-200 border border-gray-200 transition-colors"
            >
              👋 "Hi, what's new today?"
            </button>
            <button 
              type="button" 
              onClick={() => handleSend("What ingredients should we use first in today's baking prep?")} 
              className="shrink-0 text-xs bg-gray-100 text-gray-700 font-bold px-3 py-1.5 rounded-full hover:bg-gray-200 border border-gray-200 transition-colors"
            >
              🧁 "What to use first?"
            </button>
            <button 
              type="button" 
              onClick={() => handleSend("Where should open milk and dairy products be placed?")} 
              className="shrink-0 text-xs bg-gray-100 text-gray-700 font-bold px-3 py-1.5 rounded-full hover:bg-gray-200 border border-gray-200 transition-colors"
            >
              🥛 "Where to store dairy?"
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a question or say hello..."
              className="w-full pl-5 pr-14 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm"
              disabled={isTyping}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors shadow-sm"
            >
              {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffGuardAI;
