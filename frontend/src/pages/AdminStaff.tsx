import React, { useState, useEffect } from 'react';
import { Users, Plus, Shield, Mail, Phone, MoreVertical, X } from 'lucide-react';

const AdminStaff = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', password: '', role: 'STAFF' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStaff(data);
      }
    } catch (err) {
      console.error('Failed to fetch staff', err);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/staff', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newStaff)
      });
      if (res.ok) {
        setShowModal(false);
        setNewStaff({ name: '', email: '', password: '', role: 'STAFF' });
        fetchStaff();
      } else {
        const data = await res.json();
        alert(`Failed: ${data.error}`);
      }
    } catch (err) {
      alert('Network error.');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-blue-600" /> Staff Management
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Manage your team, assign roles, and control access.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={20} /> Invite Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm font-bold text-gray-500 uppercase">Total Team Members</p>
          <p className="text-3xl font-black text-gray-900 mt-2">{staff.length}</p>
        </div>
        <div className="bg-green-50 p-5 rounded-2xl border border-green-200 shadow-sm">
          <p className="text-sm font-bold text-green-800 uppercase">Active Now</p>
          <p className="text-3xl font-black text-green-900 mt-2">
            {staff.length}
          </p>
        </div>
        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200 shadow-sm">
          <p className="text-sm font-bold text-blue-800 uppercase">Managers</p>
          <p className="text-3xl font-black text-blue-900 mt-2">
            {staff.filter(s => s.role === 'MANAGER' || s.role === 'ADMIN').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
              <th className="p-4 font-bold">Staff Member</th>
              <th className="p-4 font-bold">Contact</th>
              <th className="p-4 font-bold">Role</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {staff.map(person => (
              <tr key={person.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      {person.name ? person.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{person.name}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col text-sm text-gray-600">
                    <span className="flex items-center gap-1"><Mail size={14}/> {person.email}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`flex items-center gap-1 w-max px-2 py-1 rounded text-xs font-bold ${
                    person.role === 'MANAGER' || person.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    <Shield size={12}/> {person.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">ACTIVE</span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={20}/></button>
                </td>
              </tr>
            ))}
            {staff.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">No staff found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-gray-900 text-lg">Invite New Staff</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddStaff} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" required 
                  value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" required 
                  value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Temporary Password</label>
                <input 
                  type="password" required 
                  value={newStaff.password} onChange={e => setNewStaff({...newStaff, password: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
                <select 
                  value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="STAFF">Staff (Floor Worker)</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 font-bold text-gray-700 rounded-xl hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50">
                  {loading ? 'Adding...' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStaff;
