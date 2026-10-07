import React, { useState } from 'react';
import { Send, Bot, ShieldAlert, Sparkles, Database } from 'lucide-react';

const AdminGuardAI = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello Admin. I am connected to your live business databases. I can analyze inventory trends, waste records, and staff tasks. What insights do you need today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', content: input }]);
    
    // Simulate RAG response based on keywords
    setTimeout(() => {
      let reply = "I've analyzed the current database records. Your inventory value is stable, but there is a 12% increase in vegetable waste compared to last week. I recommend adjusting the purchasing volume for fresh produce.";
      
      if (input.toLowerCase().includes('expire')) {
        reply = "Currently, there are 2 expired products in the Main Refrigerator, and 5 dairy products expiring within the next 3 days. I have automatically pushed these to the Staff 'Use First' Queue.";
      } else if (input.toLowerCase().includes('staff') || input.toLowerCase().includes('task')) {
        reply = "Looking at the task records, Rahul currently has the most pending tasks (2 high priority). Vikram has completed 100% of his tasks today.";
      }

      setMessages(prev => [...prev, { role: 'ai', content: reply }]);
    }, 1200);
    
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-5xl mx-auto p-4 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Bot className="text-blue-600" /> Guard AI <span className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-md ml-2 uppercase tracking-widest font-black">Admin Mode</span>
          </h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2">
            <Database size={16} /> Connected to full MySQL business data (RAG Enabled)
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-50 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
              }`}>
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-sm uppercase tracking-wider">
                    <Sparkles size={14} /> AI Insight
                  </div>
                )}
                <p className="leading-relaxed">{msg.content}</p>
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
              placeholder="Ask about inventory, waste analytics, staff tasks..."
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
            <button type="button" onClick={() => setInput("What products are going to expire this week?")} className="shrink-0 text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-full hover:bg-blue-100 border border-blue-200 transition-colors">"What expires this week?"</button>
            <button type="button" onClick={() => setInput("Which category creates the most waste?")} className="shrink-0 text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-full hover:bg-blue-100 border border-blue-200 transition-colors">"Most waste category?"</button>
            <button type="button" onClick={() => setInput("Which staff member has the most pending tasks?")} className="shrink-0 text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-full hover:bg-blue-100 border border-blue-200 transition-colors">"Staff task load?"</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGuardAI;
