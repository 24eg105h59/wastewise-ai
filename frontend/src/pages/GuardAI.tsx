import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string | number;
  sender: 'ai' | 'user';
  text: string;
  timestamp?: string;
}

const GuardAI = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: `Hello ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm **Guide AI** for HD Bakers.\n\nAsk me anything about food safety, inventory, or kitchen tasks!`,
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

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMessage];
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
          messages: newHistory.map(m => ({
            role: m.sender === 'ai' ? 'assistant' : 'user',
            content: m.text
          }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: data.reply || "I'm right here with you! How else can I help?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        const err = await res.json().catch(() => ({}));
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: `Connection issue (${err.error || 'Request failed'}). Let me know what else I can look into!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: "I couldn't reach the server. Please check your network connection.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto h-[calc(100vh-40px)] flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl shadow-md shadow-blue-500/20">
              <Bot size={24} />
            </span>
            Guide AI Assistant
          </h1>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-500" /> Powered by Gemini conversational intelligence
          </p>
        </div>
        <button
          onClick={() => setMessages([{
            id: 1,
            sender: 'ai',
            text: `Conversation restarted. Hello! What can I help you with today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }])}
          className="text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw size={13} /> Reset
        </button>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gray-50/60 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <Bot size={18} />
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm text-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
              }`}>
                <div className="leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>
                {msg.timestamp && (
                  <div className={`text-[10px] mt-1.5 ${msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-gray-400'}`}>
                    {msg.timestamp}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
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
              onClick={() => handleSend("Hi, what's new today?")}
              className="shrink-0 text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-full hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              👋 "Hi, what's new today?"
            </button>
            <button
              type="button"
              onClick={() => handleSend("What products are expiring soon?")}
              className="shrink-0 text-xs bg-gray-100 text-gray-700 font-bold px-3 py-1.5 rounded-full hover:bg-gray-200 border border-gray-200 transition-colors"
            >
              ⏰ "What expires soon?"
            </button>
            <button
              type="button"
              onClick={() => handleSend("How can we reduce inventory waste?")}
              className="shrink-0 text-xs bg-gray-100 text-gray-700 font-bold px-3 py-1.5 rounded-full hover:bg-gray-200 border border-gray-200 transition-colors"
            >
              📉 "Reduce waste?"
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Guide AI anything, or say hello..."
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

export default GuardAI;
