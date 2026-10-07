import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ScanLine, Package, AlertTriangle, ShieldAlert, Thermometer, Trash2, BarChart3, Bot, Settings, Users, CheckSquare, LogOut, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinks = () => {
    const baseLinks = [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'AI Scanner', path: '/scanner', icon: ScanLine },
      { name: 'Inventory', path: '/inventory', icon: Package },
      { name: 'Expiry Monitor', path: '/expiry', icon: AlertTriangle },
      { name: 'Risk Center', path: '/risk', icon: ShieldAlert },
      { name: 'Storage', path: '/storage', icon: Thermometer },
      { name: 'Waste', path: '/waste', icon: Trash2 },
      { name: 'Analytics', path: '/analytics', icon: BarChart3 },
      { name: 'AI Assistant', path: '/assistant', icon: Bot },
      { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    ];

    if (user?.role === 'ADMIN') {
      baseLinks.unshift({ name: 'Admin', path: '/admin', icon: ShieldCheck });
      baseLinks.push({ name: 'Team', path: '/team', icon: Users });
      baseLinks.push({ name: 'Settings', path: '/settings', icon: Settings });
    }

    if (user?.role === 'CUSTOMER') {
      baseLinks.unshift({ name: 'Customer Portal', path: '/customer', icon: ShoppingBag });
    }

    return baseLinks;
  };

  const links = getLinks();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <ShieldAlert className="text-primary" />
          WasteWise AI
        </h1>
        <p className="text-xs text-gray-500 mt-1">See it. Scan it. Secure it.</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
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

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role || 'Staff'}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
