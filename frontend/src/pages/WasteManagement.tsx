import React from 'react';
import { Trash2, TrendingDown, DollarSign } from 'lucide-react';

const WasteManagement = () => {
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

  const expiredItems = inventory.filter(i => getDaysDiff(i.expiryDate) < 0);
  const totalWasteValue = expiredItems.reduce((acc, curr) => acc + (curr.quantity * (curr.price || 150)), 0);

  // Compute most wasted category
  const categoryMap: Record<string, number> = {};
  expiredItems.forEach(item => {
    const cat = item.category?.name || 'Uncategorized';
    categoryMap[cat] = (categoryMap[cat] || 0) + (item.quantity * (item.price || 150));
  });
  
  let mostWastedCat = 'None';
  let mostWastedPercentage = 0;
  if (totalWasteValue > 0) {
    const sortedCats = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
    mostWastedCat = sortedCats[0][0];
    mostWastedPercentage = Math.round((sortedCats[0][1] / totalWasteValue) * 100);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Trash2 className="text-primary" /> Waste Tracking
          </h1>
          <p className="text-gray-500 mt-2">Log and analyze discarded inventory.</p>
        </div>
        <button onClick={() => alert('Log Waste dialog will open here.')} className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors">
          + Log Waste
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-medium uppercase text-xs">Total Waste Value (Current)</h3>
            <DollarSign className="text-gray-400" size={16} />
          </div>
          <p className="text-3xl font-bold text-gray-900">₹{totalWasteValue}</p>
          <p className="text-sm text-red-500 flex items-center gap-1 mt-2">
            <TrendingDown size={14} className="rotate-180" /> Based on expired goods
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-medium uppercase text-xs">Most Wasted Category</h3>
            <Trash2 className="text-gray-400" size={16} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{mostWastedCat}</p>
          <p className="text-sm text-gray-500 mt-2">{mostWastedPercentage}% of total waste</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-sm">
          <h3 className="text-blue-800 font-bold mb-2">AI Insights</h3>
          <p className="text-blue-700 text-sm">
            {mostWastedPercentage > 0 
              ? `You frequently discard ${mostWastedCat.toLowerCase()} before use. Consider reducing the next purchase quantity or using these products earlier in your FEFO queue.`
              : 'You have zero recorded waste currently. Great job managing inventory!'
            }
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
              <th className="p-4 font-medium">Product</th>
              <th className="p-4 font-medium">Quantity</th>
              <th className="p-4 font-medium">Reason</th>
              <th className="p-4 font-medium">Estimated Value</th>
              <th className="p-4 font-medium">Date logged</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {expiredItems.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4 font-bold text-gray-900">{item.name}</td>
                <td className="p-4 text-gray-600">{item.quantity} {item.unit}</td>
                <td className="p-4"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">EXPIRED</span></td>
                <td className="p-4 text-red-600">₹{item.quantity * (item.price || 150)}</td>
                <td className="p-4 text-gray-500">{new Date(item.expiryDate).toLocaleDateString()}</td>
              </tr>
            ))}
            {expiredItems.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">No waste recorded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WasteManagement;
