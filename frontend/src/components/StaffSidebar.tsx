import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ScanLine, Package, AlertTriangle, CheckSquare, AlertCircle, Bot, Bell, User, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const StaffSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { name: 'Home', path: '/staff/home', icon: Home },
    { name: 'Scan', path: '/staff/scanner', icon: ScanLine },
    { name: 'Inventory', path: '/staff/inventory', icon: Package },
    { name: 'Expiring', path: '/staff/expiring', icon: AlertTriangle },
    { name: 'My Tasks', path: '/staff/tasks', icon: CheckSquare },
    { name: 'Report Issue', path: '/staff/report', icon: AlertCircle },
    { name: 'GuardAI', path: '/staff/assistant', icon: Bot },
    { name: 'Notifications', path: '/staff/notifications', icon: Bell },
    { name: 'Profile', path: '/staff/profile', icon: User },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <ShieldAlert className="text-primary" />
          WasteWise Staff
        </h1>
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
              {user?.name?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name || 'Staff Member'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role || 'STAFF'}</p>
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
