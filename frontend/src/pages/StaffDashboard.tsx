import React from 'react';
import { Camera, AlertCircle, CheckSquare, AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const expiringSoonCount = inventory.filter(i => {
    const d = getDaysDiff(i.expiryDate);
    return d >= 0 && d <= 7;
  }).length;
  
  const highRiskCount = inventory.filter(i => i.riskLevel === 'HIGH' || i.riskLevel === 'CRITICAL').length;

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hello, {user?.name?.split(' ')[0] || 'Staff'} 👋</h1>
        <p className="text-gray-500 mt-2 text-lg">What do you need to do right now?</p>
      </div>

      {/* Primary Action */}
      <button 
        onClick={() => navigate('/staff/scanner')}
        className="w-full bg-blue-600 text-white rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
      >
        <div className="bg-white/20 p-4 rounded-full">
          <Camera size={48} className="text-white" />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-bold">Scan Product</h2>
          <p className="text-blue-100 mt-2 font-medium">Use AI to extract expiry & detect issues</p>
        </div>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <CheckSquare className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Today's Tasks</h3>
          </div>
          
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">2</p>
              <p className="text-xs text-gray-500 uppercase font-bold">Urgent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">3</p>
              <p className="text-xs text-gray-500 uppercase font-bold">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">5</p>
              <p className="text-xs text-gray-500 uppercase font-bold">Done</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100 cursor-pointer hover:bg-red-100">
              <input type="checkbox" className="mt-1 w-5 h-5 rounded text-blue-600" />
              <div>
                <p className="font-semibold text-red-900">Inspect chicken packaging</p>
                <p className="text-xs text-red-700 mt-1">Due today • High Priority</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100 cursor-pointer hover:bg-orange-100">
              <input type="checkbox" className="mt-1 w-5 h-5 rounded text-blue-600" />
              <div>
                <p className="font-semibold text-orange-900">Move milk to refrigerator</p>
                <p className="text-xs text-orange-700 mt-1">Due today</p>
              </div>
            </div>
            <button className="w-full text-center text-sm font-bold text-purple-600 pt-2 flex items-center justify-center gap-1 hover:text-purple-700">
              View all tasks <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Urgent Issues & Expiring */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-red-50 rounded-xl border border-red-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <AlertCircle className="text-red-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-red-900">Urgent Issues</h3>
              </div>
              <span className="bg-red-200 text-red-800 py-1 px-3 rounded-full text-sm font-bold">
                {highRiskCount} Action{highRiskCount !== 1 ? 's' : ''} Needed
              </span>
            </div>
            <p className="text-red-800 font-medium mb-4">
              {highRiskCount} product{highRiskCount !== 1 ? 's require' : ' requires'} inspection or disposal.
            </p>
            <button className="bg-white text-red-700 border border-red-300 font-bold px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
              Review Issues
            </button>
          </div>

          <div className="bg-orange-50 rounded-xl border border-orange-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <AlertTriangle className="text-orange-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-orange-900">Expiring Soon</h3>
              </div>
              <span className="bg-orange-200 text-orange-800 py-1 px-3 rounded-full text-sm font-bold">
                {expiringSoonCount} Item{expiringSoonCount !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-orange-800 font-medium mb-4">
              {expiringSoonCount} product{expiringSoonCount !== 1 ? 's' : ''} expiring within the next 7 days.
            </p>
            <button 
              onClick={() => navigate('/staff/expiring')}
              className="bg-white text-orange-700 border border-orange-300 font-bold px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors"
            >
              View "Use First" List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
