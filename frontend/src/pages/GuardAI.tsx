import React, { useState } from 'react';
import { Bot, Send, User } from 'lucide-react';

const GuardAI = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I'm GuardAI, your food safety and inventory assistant. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');

  const [inventory, setInventory] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/products', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setInventory(data);
        }
      } catch (err) {
        console.error('Failed to fetch inventory', err);
      }
    };
    fetchInventory();
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate AI response based on real inventory data
    setTimeout(() => {
      const now = new Date();
      const getDaysDiff = (dateStr: string) => {
        if (!dateStr) return 999;
        const d = new Date(dateStr);
        return (d.getTime() - now.getTime()) / (1000 * 3600 * 24);
      };

      const expired = inventory.filter(i => getDaysDiff(i.expiryDate) < 0);
      const urgent = inventory.filter(i => { const d = getDaysDiff(i.expiryDate); return d >= 0 && d <= 3; });

      let aiText = `I'm analyzing your inventory of ${inventory.length} items. `;
      
      if (urgent.length > 0) {
        aiText += `I recommend inspecting the ${urgent[0].name} as it expires very soon.`;
      } else {
        aiText += "Everything looks safe and well-managed right now.";
      }
      
      if (userMessage.text.toLowerCase().includes('waste') || userMessage.text.toLowerCase().includes('expired')) {
        if (expired.length > 0) {
          const wasteValue = expired.reduce((acc, curr) => acc + (curr.quantity * (curr.price || 150)), 0);
          aiText = `You currently have ${expired.length} expired items in your inventory, with an estimated loss value of ₹${wasteValue}. Please review the Waste Tracking dashboard for details.`;
        } else {
          aiText = "Great news! You currently have 0 expired items in your inventory. Your waste is minimized.";
        }
      } else if (userMessage.text.toLowerCase().includes('expire') || userMessage.text.toLowerCase().includes('soon')) {
        if (urgent.length > 0) {
          const itemNames = urgent.slice(0, 3).map(i => i.name).join(', ');
          aiText = `You have ${urgent.length} items expiring within the next 3 days. Priority items: ${itemNames}.`;
        } else {
          aiText = "You have no items expiring in the next 3 days.";
        }
      } else if (userMessage.text.toLowerCase().includes('high risk') || userMessage.text.toLowerCase().includes('risk')) {
        const highRisk = inventory.filter(i => i.riskLevel === 'HIGH' || i.riskLevel === 'CRITICAL');
        if (highRisk.length > 0) {
          aiText = `I found ${highRisk.length} high-risk items requiring your attention, including ${highRisk[0].name}. Please check the Risk Center.`;
        } else {
          aiText = "There are no high or critical risk items currently logged.";
        }
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiText }]);
    }, 1000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-[calc(100vh-40px)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Bot className="text-primary" /> GuardAI Assistant
        </h1>
        <p className="text-gray-500 mt-2">Ask questions about your inventory, risk factors, and food safety.</p>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-50/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'ai' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {msg.sender === 'ai' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className={`max-w-[75%] p-4 rounded-xl shadow-sm ${
                msg.sender === 'ai' ? 'bg-white border border-gray-200 text-gray-800' : 'bg-primary text-white'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSend} className="relative">
            <input 
              type="text" 
              placeholder="Ask GuardAI e.g. 'What expires this week?'"
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-primary transition-colors"
            >
              <Send size={20} />
            </button>
          </form>
          <div className="flex gap-2 mt-3">
            <span className="text-xs text-gray-500">Suggestions:</span>
            <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded" onClick={() => setInput('What expires this week?')}>What expires this week?</button>
            <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded" onClick={() => setInput('Show me high-risk items.')}>Show me high-risk items.</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardAI;
