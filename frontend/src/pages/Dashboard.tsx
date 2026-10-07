import React from 'react';
import { AlertCircle, ShieldAlert, AlertTriangle, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
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

  const now = new Date();
  const getDaysDiff = (dateStr: string) => {
    if (!dateStr) return 999;
    const d = new Date(dateStr);
    return (d.getTime() - now.getTime()) / (1000 * 3600 * 24);
  };

  const expiringSoon = inventory.filter(i => {
    const d = getDaysDiff(i.expiryDate);
    return d >= 0 && d <= 7;
  });
  
  const highRisk = inventory.filter(i => i.riskLevel === 'HIGH' || i.riskLevel === 'CRITICAL');
  
  const expiredCount = inventory.filter(i => getDaysDiff(i.expiryDate) < 0).length;

  const urgentItems = [...inventory]
    .filter(i => i.expiryDate && getDaysDiff(i.expiryDate) >= 0)
    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
    .slice(0, 3);

  const recommendation = urgentItems.length >= 2 
    ? `Use the **${urgentItems[0].name}** and **${urgentItems[1].name}** first.` 
    : "You're all caught up!";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Good evening, Admin 👋</h1>
          <p className="text-gray-500 mt-2">Here is what needs your attention today.</p>
        </div>
        <button onClick={() => navigate('/scanner')} className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors">
          + Scan Product
        </button>
      </div>

      {/* AI Recommendation Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex gap-4 items-start">
        <div className="bg-blue-100 p-2 rounded-full mt-1">
          <AlertCircle className="text-blue-600" size={24} />
        </div>
        <div>
          <h3 className="text-blue-800 font-semibold text-lg">AI Recommendation</h3>
          <p className="text-blue-700 mt-1" dangerouslySetInnerHTML={{ __html: recommendation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <h3 className="text-gray-500 font-medium">FOOD SAFETY SCORE</h3>
            <ShieldAlert className="text-green-500" size={20} />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">87<span className="text-lg text-gray-500 font-normal">/100</span></p>
            <p className="text-sm text-green-600 font-medium flex items-center gap-1 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Good
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <h3 className="text-gray-500 font-medium">Expiring Soon</h3>
            <AlertTriangle className="text-orange-500" size={20} />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{expiringSoon.length} <span className="text-lg font-normal text-gray-500">items</span></p>
            <p className="text-sm text-orange-600 mt-1">Within 7 days</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <h3 className="text-gray-500 font-medium">High Risk</h3>
            <ShieldAlert className="text-red-500" size={20} />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{highRisk.length} <span className="text-lg font-normal text-gray-500">items</span></p>
            <p className="text-sm text-red-600 mt-1">Require inspection</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <h3 className="text-gray-500 font-medium">Waste This Month</h3>
            <TrendingDown className="text-gray-400" size={20} />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">₹4,280</p>
            <p className="text-sm text-gray-500 mt-1">+12% from last month</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Urgent: Use First</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Expiry</th>
                  <th className="p-4 font-medium">Quantity</th>
                  <th className="p-4 font-medium">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {urgentItems.map((item, index) => {
                  const score = 95 - index * 7;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">📦</div>
                        {item.name}
                      </td>
                      <td className="p-4 text-red-600 font-medium">{new Date(item.expiryDate).toLocaleDateString()}</td>
                      <td className="p-4 text-gray-600">{item.quantity} {item.unit}</td>
                      <td className="p-4"><span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">{score} URGENT</span></td>
                    </tr>
                  )
                })}
                {urgentItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">No urgent items found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">AI Alerts</h2>
          <div className="space-y-4">
            {expiredCount > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm border-l-4 border-l-red-500">
                <p className="font-semibold text-gray-900">{expiredCount} product{expiredCount > 1 ? 's' : ''} expired</p>
                <p className="text-sm text-gray-500 mt-1">Please discard immediately.</p>
                <button className="text-primary text-sm font-medium mt-3 hover:underline">Review Items</button>
              </div>
            )}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm border-l-4 border-l-yellow-400">
              <p className="font-semibold text-gray-900">Storage concern detected</p>
              <p className="text-sm text-gray-500 mt-1">Freezer 1 temperature is slightly above required (-14°C vs -18°C).</p>
              <button className="text-primary text-sm font-medium mt-3 hover:underline">View Storage</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
