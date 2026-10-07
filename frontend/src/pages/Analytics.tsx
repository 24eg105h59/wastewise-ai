import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const data = [
  { name: 'Jan', waste: 4000, expected: 2400 },
  { name: 'Feb', waste: 3000, expected: 1398 },
  { name: 'Mar', waste: 2000, expected: 9800 },
  { name: 'Apr', waste: 2780, expected: 3908 },
  { name: 'May', waste: 1890, expected: 4800 },
  { name: 'Jun', waste: 2390, expected: 3800 },
  { name: 'Jul', waste: 3490, expected: 4300 },
];

const categoryData = [
  { name: 'Vegetables', value: 400 },
  { name: 'Dairy', value: 300 },
  { name: 'Meat', value: 300 },
  { name: 'Bakery', value: 200 },
];

const Analytics = () => {
  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {
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

  // Compute category data dynamically based on inventory
  const categoryMap: Record<string, number> = {};
  inventory.forEach(item => {
    const cat = item.category?.name || 'Uncategorized';
    // Just mock "waste value" based on quantity * random price for demo
    const value = item.quantity * (item.price || 150); 
    categoryMap[cat] = (categoryMap[cat] || 0) + value;
  });
  
  const dynamicCategoryData = Object.keys(categoryMap).length > 0 
    ? Object.keys(categoryMap).map(k => ({ name: k, value: Math.round(categoryMap[k]) }))
    : categoryData;

  const now = new Date();
  const getDaysDiff = (dateStr: string) => {
    if (!dateStr) return 999;
    const d = new Date(dateStr);
    return (d.getTime() - now.getTime()) / (1000 * 3600 * 24);
  };
  
  const expiredValue = inventory
    .filter(i => getDaysDiff(i.expiryDate) < 0)
    .reduce((acc, curr) => acc + (curr.quantity * (curr.price || 150)), 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="text-primary" /> Analytics
          </h1>
          <p className="text-gray-500 mt-2">Insights into your inventory, food safety, and waste trends.</p>
        </div>
        <button onClick={() => alert('Report download started.')} className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          <Download size={18} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Waste Over Time */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Waste Trend (Value ₹)</h2>
            <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-2 py-1 outline-none">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <Tooltip />
                <Area type="monotone" dataKey="waste" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorWaste)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Inventory Value by Category</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dynamicCategoryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontWeight: 500}} />
                <Tooltip cursor={{fill: '#f9fafb'}} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insight Banner */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 flex items-start gap-4">
        <div className="bg-primary/20 p-2 rounded-full mt-1">
          <TrendingUp className="text-primary-dark" size={24} />
        </div>
        <div>
          <h3 className="text-primary-dark font-bold text-lg mb-1">Efficiency Insight</h3>
          <p className="text-primary-dark/80">
            By analyzing your scanning patterns, we noticed a 15% improvement in capturing expiry dates before products are stored. This proactive behavior correlates directly with your reduced dairy waste this month. 
            {expiredValue > 0 && <span> However, you currently have ₹{Math.round(expiredValue)} worth of expired products on hand.</span>}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
