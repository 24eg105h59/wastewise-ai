import React, { useState } from 'react';
import { Send, Bot, ShieldAlert } from 'lucide-react';

const StaffGuardAI = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I am your floor assistant. I can help you find products, check what needs to be used first, or answer basic safety questions. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', content: input }]);
    
    setTimeout(() => {
      let reply = "I recommend checking your 'My Tasks' list first, and then moving any expiring dairy products to the front of the refrigerator.";
      
      if (input.toLowerCase().includes('expire') || input.toLowerCase().includes('use first')) {
        reply = "You should use the Chicken (expires today) and the Milk (expires tomorrow) first. They are listed in your 'Expiring' tab.";
      } else if (input.toLowerCase().includes('where') || input.toLowerCase().includes('chicken')) {
        reply = "The Chicken is stored in Refrigerator 2 (Meat Section).";
      }

      setMessages(prev => [...prev, { role: 'ai', content: reply }]);
    }, 1000);
    
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-3xl mx-auto p-4 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Bot className="text-blue-600" /> Staff Assistant
          </h1>
          <p className="text-gray-500 mt-2">Get quick help with your floor tasks.</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-50 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
              }`}>
                <p className="leading-relaxed font-medium">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="w-full pl-6 pr-14 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Send size={20} />
            </button>
          </form>
          <div className="flex gap-2 mt-3 overflow-x-auto custom-scrollbar pb-1">
            <button type="button" onClick={() => setInput("What should I check today?")} className="shrink-0 text-xs bg-gray-100 text-gray-700 font-bold px-3 py-1.5 rounded-full hover:bg-gray-200 border border-gray-200 transition-colors">"What should I check?"</button>
            <button type="button" onClick={() => setInput("Which products should I use first?")} className="shrink-0 text-xs bg-gray-100 text-gray-700 font-bold px-3 py-1.5 rounded-full hover:bg-gray-200 border border-gray-200 transition-colors">"What to use first?"</button>
            <button type="button" onClick={() => setInput("Where is the chicken stored?")} className="shrink-0 text-xs bg-gray-100 text-gray-700 font-bold px-3 py-1.5 rounded-full hover:bg-gray-200 border border-gray-200 transition-colors">"Where is the chicken?"</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffGuardAI;
