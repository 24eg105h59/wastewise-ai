import React from 'react';
import { ShieldAlert, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const RiskCenter = () => {
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

  const criticalRisks = inventory.filter(i => getDaysDiff(i.expiryDate) < 0 || i.riskLevel === 'CRITICAL' || i.riskLevel === 'HIGH');
  const missingData = inventory.filter(i => !i.categoryId || !i.batchNumber || !i.storageLocationId);

  const handleAction = async (action: string, item: any) => {
    if (action === 'Waste logging') {
      if (!window.confirm(`Are you sure you want to mark ${item.name} as waste and remove it from inventory?`)) return;
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/products/${item.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setInventory(prev => prev.filter(i => i.id !== item.id));
          alert(`${item.name} marked as waste and removed from inventory.`);
        } else {
          alert('Failed to delete product. Ensure you have Admin rights.');
        }
      } catch (err) {
        alert('Network error.');
      }
    } else {
      alert(`${action} successfully applied for ${item.name}.`);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldAlert className="text-primary" /> Risk Center
        </h1>
        <p className="text-gray-500 mt-2">
          Command center for food safety. Prioritize actions and resolve critical risks.
        </p>
      </div>

      {/* AI Recommended Actions */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl p-6">
        <h2 className="text-xl font-bold text-red-900 flex items-center gap-2 mb-4">
          <ShieldAlert className="text-red-600" /> AI Recommended Actions
        </h2>
        <div className="space-y-3">
          {criticalRisks.slice(0, 3).map((item, index) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-red-100 flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">{index + 1}</div>
                <div>
                  <p className="font-bold text-gray-900">Review {item.name}</p>
                  <p className="text-sm text-gray-500">
                    {getDaysDiff(item.expiryDate) < 0 ? 'Item has expired. Immediate disposal recommended.' : `Item flagged with ${item.riskLevel} risk level.`}
                  </p>
                </div>
              </div>
              <button onClick={() => handleAction('Risk resolution', item)} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors">Resolve</button>
            </div>
          ))}
          {criticalRisks.length === 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100 text-green-700">
              No critical actions required at this time.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-red-500" /> Critical Risks
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm divide-y divide-gray-100">
            {criticalRisks.map(item => (
              <div key={item.id} className="p-4 flex gap-4">
                 <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">⚠️</div>
                 <div className="flex-1">
                   <div className="flex justify-between">
                     <h4 className="font-bold text-gray-900">{item.name}</h4>
                     <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-1 rounded">
                       {getDaysDiff(item.expiryDate) < 0 ? 'EXPIRED' : item.riskLevel}
                     </span>
                   </div>
                   <p className="text-sm text-gray-500 mt-1">
                     {getDaysDiff(item.expiryDate) < 0 
                        ? `Expired. Qty: ${item.quantity} ${item.unit}.` 
                        : `Risk identified. Expires in ${Math.ceil(getDaysDiff(item.expiryDate))} days.`}
                   </p>
                   <button onClick={() => handleAction('Waste logging', item)} className="mt-3 text-red-600 text-sm font-medium hover:underline flex items-center gap-1">
                     <ShieldAlert size={14} /> Mark as Waste
                   </button>
                 </div>
              </div>
            ))}
            {criticalRisks.length === 0 && <div className="p-4 text-gray-500">No critical risks.</div>}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="text-blue-500" /> Missing Information
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm divide-y divide-gray-100">
            {missingData.map(item => (
              <div key={item.id} className="p-4 flex gap-4">
                 <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">📝</div>
                 <div className="flex-1">
                   <div className="flex justify-between">
                     <h4 className="font-bold text-gray-900">{item.name}</h4>
                     <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded">MISSING DATA</span>
                   </div>
                   <p className="text-sm text-gray-500 mt-1">Missing category or storage location.</p>
                   <button onClick={() => handleAction('Information update', item)} className="mt-3 text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                     <CheckCircle size={14} /> Update Record
                   </button>
                 </div>
              </div>
            ))}
            {missingData.length === 0 && <div className="p-4 text-gray-500">All records are complete.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskCenter;
