import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Users, Settings } from 'lucide-react';

const AdminPage = () => {
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
        <ShieldCheck className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-2">Welcome back, {user?.name}!</h2>
        <p className="text-gray-600">You are logged in as an Administrator. You have full access to manage the system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">User Management</h3>
            <p className="text-sm text-gray-500 mt-1">Manage staff, customers, and their roles.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">System Settings</h3>
            <p className="text-sm text-gray-500 mt-1">Configure global application settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
