import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ScanLine, Package, AlertTriangle, ShieldAlert, Thermometer, Trash2, BarChart3, Bot, Settings, Users, CheckSquare, LogOut, Bell, FileText, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'AI Scanner', path: '/admin/scanner', icon: ScanLine },
    { name: 'Inventory', path: '/admin/inventory', icon: Package },
    { name: 'Expiry Monitor', path: '/admin/expiry', icon: AlertTriangle },
    { name: 'Risk Center', path: '/admin/risk', icon: ShieldAlert },
    { name: 'Storage', path: '/admin/storage', icon: Thermometer },
    { name: 'Waste', path: '/admin/waste', icon: Trash2 },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'GuardAI', path: '/admin/assistant', icon: Bot },
    { name: 'Tasks', path: '/admin/tasks', icon: CheckSquare },
    { name: 'Alerts', path: '/admin/alerts', icon: Bell },
    { name: 'Staff', path: '/admin/staff', icon: Users },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'Audit Log', path: '/admin/audit', icon: ClipboardList },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full">
      <div className="p-6 bg-slate-950">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="text-blue-500" />
          WasteWise Admin
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <ul className="space-y-1 px-3">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-medium'
                      : 'hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <link.icon size={18} />
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.role || 'ADMIN'}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-md transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </div>
  );
};
