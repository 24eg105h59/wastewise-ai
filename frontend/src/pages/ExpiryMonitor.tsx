import React from 'react';
import { AlertTriangle, Clock, CalendarX, CalendarCheck, Zap, AlertCircle, RefreshCw } from 'lucide-react';

const ExpiryMonitor = () => {
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
          // Sort by expiry
          data.sort((a: any, b: any) => new Date(a.expiryDate || 0).getTime() - new Date(b.expiryDate || 0).getTime());
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
    return Math.ceil((d.getTime() - now.getTime()) / (1000 * 3600 * 24));
  };

  const expiredCount = inventory.filter(i => getDaysDiff(i.expiryDate) < 0).length;
  const criticalCount = inventory.filter(i => getDaysDiff(i.expiryDate) === 0).length;
  const urgentCount = inventory.filter(i => { const d = getDaysDiff(i.expiryDate); return d === 1 || d === 2; }).length;
  const soonCount = inventory.filter(i => { const d = getDaysDiff(i.expiryDate); return d >= 3 && d <= 7; }).length;
  const safeCount = inventory.filter(i => getDaysDiff(i.expiryDate) > 7).length;

  const useFirstQueue = [...inventory]
    .filter(i => i.expiryDate && getDaysDiff(i.expiryDate) >= 0)
    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
    .slice(0, 5);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="text-blue-600" /> Expiry Command Center
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Monitor product lifecycles and direct the kitchen's FEFO usage.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          <RefreshCw size={18} /> Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* EXPIRED */}
        <div className="bg-red-50 p-5 rounded-2xl border border-red-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-red-100 p-2 rounded-lg"><CalendarX size={20} className="text-red-600"/></div>
          </div>
          <div>
            <p className="text-3xl font-black text-red-900">{expiredCount}</p>
            <h3 className="text-red-800 font-bold text-sm uppercase tracking-wider mt-1">Expired</h3>
            <p className="text-xs text-red-600 font-medium mt-1">Already expired</p>
          </div>
        </div>

        {/* CRITICAL */}
        <div className="bg-orange-50 p-5 rounded-2xl border border-orange-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-orange-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="bg-orange-100 p-2 rounded-lg"><AlertCircle size={20} className="text-orange-600"/></div>
          </div>
          <div>
            <p className="text-3xl font-black text-orange-900">{criticalCount}</p>
            <h3 className="text-orange-800 font-bold text-sm uppercase tracking-wider mt-1">Critical</h3>
            <p className="text-xs text-orange-600 font-medium mt-1">Expires today</p>
          </div>
        </div>

        {/* URGENT */}
        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-100 p-2 rounded-lg"><AlertTriangle size={20} className="text-amber-600"/></div>
          </div>
          <div>
            <p className="text-3xl font-black text-amber-900">{urgentCount}</p>
            <h3 className="text-amber-800 font-bold text-sm uppercase tracking-wider mt-1">Urgent</h3>
            <p className="text-xs text-amber-600 font-medium mt-1">1-2 days</p>
          </div>
        </div>

        {/* SOON */}
        <div className="bg-yellow-50 p-5 rounded-2xl border border-yellow-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-yellow-100 p-2 rounded-lg"><Clock size={20} className="text-yellow-600"/></div>
          </div>
          <div>
            <p className="text-3xl font-black text-yellow-900">{soonCount}</p>
            <h3 className="text-yellow-800 font-bold text-sm uppercase tracking-wider mt-1">Soon</h3>
            <p className="text-xs text-yellow-600 font-medium mt-1">3-7 days</p>
          </div>
        </div>

        {/* SAFE */}
        <div className="bg-green-50 p-5 rounded-2xl border border-green-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-green-100 p-2 rounded-lg"><CalendarCheck size={20} className="text-green-600"/></div>
          </div>
          <div>
            <p className="text-3xl font-black text-green-900">{safeCount}</p>
            <h3 className="text-green-800 font-bold text-sm uppercase tracking-wider mt-1">Safe</h3>
            <p className="text-xs text-green-600 font-medium mt-1">More than 7 days</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-bold text-gray-900 text-lg">Full Expiry Table</h2>
              <div className="flex gap-2">
                <input type="text" placeholder="Search..." className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                    <th className="p-4 font-bold">Product</th>
                    <th className="p-4 font-bold">Category</th>
                    <th className="p-4 font-bold">Quantity</th>
                    <th className="p-4 font-bold">Expiry Date</th>
                    <th className="p-4 font-bold text-center">Status</th>
                    <th className="p-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inventory.slice(0, 15).map((item) => {
                    const diff = getDaysDiff(item.expiryDate);
                    let statusLabel = 'SAFE';
                    let statusClass = 'bg-green-100 text-green-700';
                    let rowTextClass = 'text-gray-900';
                    
                    if (diff < 0) {
                      statusLabel = 'EXPIRED';
                      statusClass = 'bg-red-100 text-red-700';
                      rowTextClass = 'text-red-600';
                    } else if (diff === 0) {
                      statusLabel = 'CRITICAL';
                      statusClass = 'bg-orange-100 text-orange-800';
                      rowTextClass = 'text-orange-600';
                    } else if (diff <= 2) {
                      statusLabel = 'URGENT';
                      statusClass = 'bg-amber-100 text-amber-800';
                      rowTextClass = 'text-amber-600';
                    } else if (diff <= 7) {
                      statusLabel = 'SOON';
                      statusClass = 'bg-yellow-100 text-yellow-800';
                      rowTextClass = 'text-yellow-600';
                    }

                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-bold text-gray-900 flex items-center gap-3">
                          {item.name}
                        </td>
                        <td className="p-4 text-gray-500 text-sm font-medium">{item.category?.name || 'N/A'}</td>
                        <td className="p-4 text-gray-900 font-medium">{item.quantity} {item.unit}</td>
                        <td className={`p-4 font-bold ${rowTextClass}`}>
                          {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'Unknown'}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`${statusClass} px-3 py-1 rounded-full text-[10px] font-black tracking-wider`}>{statusLabel}</span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={async () => {
                              if(window.confirm(`Dispose of ${item.name}?`)) {
                                const token = localStorage.getItem('token');
                                await fetch(`/api/products/${item.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
                                setInventory(prev => prev.filter(i => i.id !== item.id));
                              }
                            }}
                            className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors">
                            Dispose
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-b from-blue-50 to-white border border-blue-200 rounded-2xl p-6 shadow-sm shadow-blue-100 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-blue-100">
              <Zap size={100} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={24} className="text-blue-600" />
                <h2 className="text-xl font-bold text-blue-900">AI "Use First" Queue</h2>
              </div>
              <p className="text-sm text-blue-700 font-medium mb-6">
                FoodGuard automatically calculates what the kitchen should use first. This queue is actively sent to staff dashboards.
              </p>

              <div className="space-y-3">
                {useFirstQueue.map((item, index) => {
                  const days = getDaysDiff(item.expiryDate);
                  return (
                    <div key={item.id} className="bg-white border border-blue-100 p-4 rounded-xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.quantity} {item.unit}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-black ${days === 0 ? 'text-red-600' : 'text-orange-600'}`}>
                          {days === 0 ? 'TODAY' : `${days} days`}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <button className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20">
                Push Update to Staff
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpiryMonitor;
