import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ChefHat, 
  ScanLine, 
  Package, 
  Flame, 
  ShieldAlert, 
  Thermometer, 
  Trash2, 
  BarChart3, 
  Sparkles, 
  Settings, 
  Users, 
  CheckSquare, 
  LogOut, 
  Bell, 
  FileText 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { name: 'Kitchen Command', path: '/admin/dashboard', icon: ChefHat },
    { name: 'Ingredient Scanner', path: '/admin/scanner', icon: ScanLine },
    { name: 'Pantry & Stockroom', path: '/admin/inventory', icon: Package },
    { name: 'FEFO Expiry Board', path: '/admin/expiry', icon: Flame },
    { name: 'Food Safety & Risk', path: '/admin/risk', icon: ShieldAlert },
    { name: 'Walk-ins & Storage', path: '/admin/storage', icon: Thermometer },
    { name: 'Disposals & Waste', path: '/admin/waste', icon: Trash2 },
    { name: 'Yield Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: "Chef's Copilot (AI)", path: '/admin/assistant', icon: Sparkles },
    { name: 'Brigade Prep Tasks', path: '/admin/tasks', icon: CheckSquare },
    { name: 'Kitchen Alerts', path: '/admin/alerts', icon: Bell },
    { name: 'Culinary Brigade', path: '/admin/staff', icon: Users },
    { name: 'Kitchen Reports', path: '/admin/reports', icon: FileText },
    { name: 'Station Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-950 text-slate-300 flex flex-col h-full border-r border-slate-800/80 select-none">
      
      {/* Branding Header */}
      <div className="p-5 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-500/20 ring-1 ring-amber-400/40">
            <ChefHat className="text-white w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-white tracking-tight">WasteWise</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                CHEF
              </span>
            </div>
            <p className="text-[11px] text-amber-200/70 font-medium">Kitchen OS & Yield Guard</p>
          </div>
        </div>

        {/* Station Status Chip */}
        <div className="mt-3 flex items-center justify-between px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Active Service Pass
          </span>
          <span className="text-[10px] text-amber-400/80 font-mono">HACCP SAFE</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 custom-scrollbar space-y-1">
        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Kitchen Stations
        </div>
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-300 border border-amber-500/40 shadow-sm font-semibold'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`
            }
          >
            <link.icon size={16} className="shrink-0" />
            <span className="truncate">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Profile & Logout */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-sm shadow ring-1 ring-amber-400/40">
            {user?.name?.charAt(0).toUpperCase() || 'C'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'Executive Chef'}</p>
            <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold tracking-wide uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Executive Chef
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/40 hover:text-red-300 rounded-xl border border-transparent hover:border-red-900/50 transition-colors cursor-pointer"
        >
          <LogOut size={15} />
          <span>Exit Kitchen Command</span>
        </button>
      </div>

    </div>
  );
};
