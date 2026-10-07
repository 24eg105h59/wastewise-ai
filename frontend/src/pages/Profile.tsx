import React, { useState } from 'react';
import { User, Mail, Shield, Building, Key, Bell, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      // In a real app, we would update the user context here
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <User className="text-blue-600" /> My Profile
        </h1>
        <p className="text-gray-500 mt-2">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-inner">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name || 'User'}</h2>
            <p className="text-gray-500 font-medium">{user?.email}</p>
            <span className="mt-4 bg-blue-50 text-blue-700 font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest border border-blue-200">
              {user?.role || 'STAFF'}
            </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 mb-4">Account Details</h3>
            <div className="flex items-center gap-3 text-gray-600">
              <Building size={18} className="text-gray-400" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Business ID</p>
                <p className="font-medium text-sm">{user?.businessId || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Shield size={18} className="text-gray-400" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Role</p>
                <p className="font-medium text-sm">{user?.role || 'STAFF'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-gray-900">Personal Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed directly. Contact an admin.</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
              </button>
            </div>
          </form>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-gray-900">Preferences</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg"><Bell size={18} className="text-gray-600" /></div>
                  <div>
                    <p className="font-bold text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive alerts for urgent tasks.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg"><Key size={18} className="text-gray-600" /></div>
                  <div>
                    <p className="font-bold text-gray-900">Password</p>
                    <p className="text-sm text-gray-500">Change your login password.</p>
                  </div>
                </div>
                <button className="text-blue-600 font-bold text-sm hover:underline">Change</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
