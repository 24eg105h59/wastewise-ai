import React from 'react';
import { AlertCircle, ShieldAlert, AlertTriangle, TrendingDown, Package, Users, PackageMinus, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { downloadAuditReport } from '../utils/reportGenerator';

const AdminDashboard = () => {
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

  const expiringSoon = inventory.filter(i => {
    const d = getDaysDiff(i.expiryDate);
    return d >= 0 && d <= 7;
  });
  
  const highRisk = inventory.filter(i => i.riskLevel === 'HIGH' || i.riskLevel === 'CRITICAL');
  const expired = inventory.filter(i => getDaysDiff(i.expiryDate) < 0);
  
  const urgentItems = [...inventory]
    .filter(i => i.expiryDate && getDaysDiff(i.expiryDate) >= 0)
    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
    .slice(0, 3);

  const inventoryValue = inventory.length * 150; // Mock calculation

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Good morning, {user?.name?.split(' ')[0] || 'Admin'} 👋</h1>
          <p className="text-gray-500 mt-2 text-lg">Is my business safe, and what needs my attention right now?</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/admin/scanner')} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Scan Document
          </button>
          <button 
            onClick={() => downloadAuditReport(inventory, [], 'HD Bakers')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <TrendingUp size={18} /> Download Report
          </button>
        </div>
      </div>

      {/* Today's AI Briefing */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 shadow-lg shadow-slate-900/20 text-white relative overflow-hidden">
        <div className="absolute -right-10 -top-10 opacity-10">
          <ShieldAlert size={200} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Bot size={24} className="text-blue-400" />
            </div>
            <h2 className="text-xl font-bold">Today's AI Briefing</h2>
          </div>
          
          <div className="space-y-3 mb-6">
            <p className="flex items-center gap-2 text-red-200">
              <AlertCircle size={18} className="text-red-400" /> 
              <strong>{expired.length} products</strong> have expired
            </p>
            <p className="flex items-center gap-2 text-orange-200">
              <AlertTriangle size={18} className="text-orange-400" /> 
              <strong>{expiringSoon.length} products</strong> expire within 7 days
            </p>
            <p className="flex items-center gap-2 text-yellow-200">
              <ShieldAlert size={18} className="text-yellow-400" /> 
              <strong>{highRisk.length} packaging issues</strong> require inspection
            </p>
            <p className="flex items-center gap-2 text-slate-300">
              <TrendingDown size={18} className="text-slate-400" /> 
              <strong>Vegetables</strong> generated the most waste this week.
            </p>
          </div>
          
          <div className="bg-blue-900/40 border border-blue-500/30 rounded-xl p-4 inline-block">
            <p className="text-blue-100 flex items-center gap-2">
              <span className="font-bold text-white flex items-center gap-1"><CheckCircle2 size={16} className="text-green-400"/> AI Recommendation:</span> 
              Prioritize dairy and fresh produce today to minimize immediate waste risks.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-gray-500 font-bold text-xs uppercase tracking-wider">Food Safety Score</h3>
            <ShieldAlert className="text-green-500" size={20} />
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900">87<span className="text-lg text-gray-400 font-normal">/100</span></p>
            <p className="text-xs text-green-600 font-bold uppercase mt-1">Status: Good</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-gray-500 font-bold text-xs uppercase tracking-wider">Total Inventory</h3>
            <Package className="text-blue-500" size={20} />
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900">{inventory.length}</p>
            <p className="text-xs text-blue-600 font-bold uppercase mt-1">₹{inventoryValue.toLocaleString()} Value</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-gray-500 font-bold text-xs uppercase tracking-wider">Low Stock</h3>
            <PackageMinus className="text-purple-500" size={20} />
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900">14</p>
            <p className="text-xs text-purple-600 font-bold uppercase mt-1">Requires Reorder</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-gray-500 font-bold text-xs uppercase tracking-wider">Active Staff</h3>
            <Users className="text-emerald-500" size={20} />
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900">8</p>
            <p className="text-xs text-emerald-600 font-bold uppercase mt-1">Currently Online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Bot icon since it's not exported correctly from lucide sometimes in this environment
const Bot = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
  </svg>
);

export default AdminDashboard;
