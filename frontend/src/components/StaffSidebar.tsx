import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ChefHat, 
  ScanLine, 
  Package, 
  Flame, 
  CheckSquare, 
  AlertCircle, 
  Sparkles, 
  Bell, 
  User, 
  LogOut,
  Utensils
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const StaffSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { name: 'Kitchen Station', path: '/staff/home', icon: ChefHat },
    { name: 'Ingredient Scanner', path: '/staff/scanner', icon: ScanLine },
    { name: 'Pantry & Stockroom', path: '/staff/inventory', icon: Package },
    { name: 'FEFO Expiry Board', path: '/staff/expiring', icon: Flame },
    { name: 'Prep & Duty Tasks', path: '/staff/tasks', icon: CheckSquare },
    { name: 'HACCP & Spoilage Report', path: '/staff/report', icon: AlertCircle },
    { name: "Chef's Copilot (AI)", path: '/staff/assistant', icon: Sparkles },
    { name: 'Kitchen Alerts', path: '/staff/notifications', icon: Bell },
    { name: 'Chef Profile', path: '/staff/profile', icon: User },
  ];

  return (
    <div className="w-64 bg-slate-950 text-slate-300 flex flex-col h-full border-r border-slate-800/80 select-none">
      
      {/* Branding Header */}
      <div className="p-5 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-md shadow-orange-500/20 ring-1 ring-orange-400/40">
            <Utensils className="text-white w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-white tracking-tight">WasteWise</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                BRIGADE
              </span>
            </div>
            <p className="text-[11px] text-amber-200/70 font-medium">Sous Chef & Prep Station</p>
          </div>
        </div>

        {/* Station Status Chip */}
        <div className="mt-3 flex items-center justify-between px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Prep Line Active
          </span>
          <span className="text-[10px] text-orange-400/80 font-mono">STATION 1</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 custom-scrollbar space-y-1">
        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Line Stations
        </div>
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-300 border border-orange-500/40 shadow-sm font-semibold'
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
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-bold text-sm shadow ring-1 ring-orange-400/40">
            {user?.name?.charAt(0).toUpperCase() || 'S'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'Sous Chef'}</p>
            <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold tracking-wide uppercase bg-orange-500/20 text-orange-300 border border-orange-500/30">
              Sous Chef / Line Cook
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/40 hover:text-red-300 rounded-xl border border-transparent hover:border-red-900/50 transition-colors cursor-pointer"
        >
          <LogOut size={15} />
          <span>Exit Kitchen Station</span>
        </button>
      </div>

    </div>
  );
};
