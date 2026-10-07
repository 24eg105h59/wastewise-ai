import React from 'react';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StaffExpiring = () => {
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
    return Math.ceil((d.getTime() - now.getTime()) / (1000 * 3600 * 24));
  };

  const useFirstQueue = [...inventory]
    .filter(i => i.expiryDate && getDaysDiff(i.expiryDate) >= 0)
    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
    .slice(0, 10);

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 md:p-8 shadow-lg shadow-orange-100">
        <div className="flex items-start gap-4">
          <div className="bg-orange-100 p-3 rounded-full mt-1 shrink-0">
            <AlertTriangle className="text-orange-600 w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-orange-900 tracking-tight uppercase">Use First Today</h1>
            <p className="text-orange-800 mt-2 text-lg font-medium flex items-center gap-2">
              <Info size={18} className="text-orange-600" />
              These products have the nearest configured expiry dates.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-bold text-gray-900 text-lg">Priority Usage Queue</h2>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            FEFO System Active
          </span>
        </div>
        
        <div className="divide-y divide-gray-100">
          {useFirstQueue.map((item, index) => {
            const daysLeft = getDaysDiff(item.expiryDate);
            let badgeColor = "bg-green-100 text-green-700";
            if (daysLeft === 0) badgeColor = "bg-red-100 text-red-700";
            else if (daysLeft <= 2) badgeColor = "bg-orange-100 text-orange-700";
            else if (daysLeft <= 7) badgeColor = "bg-yellow-100 text-yellow-700";

            return (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl font-bold text-gray-400">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    <p className="text-gray-500 font-medium">{item.quantity} {item.unit} • {item.brand}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="text-left sm:text-right flex-1 sm:flex-none">
                    <p className="text-sm text-gray-500 font-bold uppercase">Expires</p>
                    <p className={`font-black ${daysLeft <= 2 ? 'text-red-600' : 'text-gray-900'}`}>
                      {daysLeft === 0 ? 'TODAY' : daysLeft === 1 ? 'Tomorrow' : `In ${daysLeft} days`}
                    </p>
                  </div>
                  <button className="bg-white border-2 border-gray-200 p-3 rounded-xl hover:bg-green-50 hover:border-green-500 hover:text-green-600 transition-colors group">
                    <CheckCircle2 className="text-gray-400 group-hover:text-green-500 transition-colors" />
                  </button>
                </div>
              </div>
            );
          })}
          
          {useFirstQueue.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p className="font-medium text-lg">No expiring items to use right now.</p>
              <p className="text-sm mt-1">Check back later or scan new inventory.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffExpiring;
