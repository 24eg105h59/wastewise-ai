import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Search, Filter, MoreVertical, Clock, User, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminTasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'MEDIUM', dueDate: '', assignedTo: '' });
  const [staffList, setStaffList] = useState<any[]>([]);

  useEffect(() => {
    fetchTasks();
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStaffList(data.filter((u: any) => u.role === 'STAFF' || u.role === 'MANAGER'));
      }
    } catch (err) {
      console.error('Failed to fetch staff list', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      });
      if (res.ok) {
        setShowModal(false);
        setNewTask({ title: '', priority: 'MEDIUM', dueDate: '', assignedTo: '' });
        fetchTasks(); // Refresh list
      } else {
        const errorData = await res.json();
        alert(`Failed to create task: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Failed to create task', err);
      alert('Network error while creating task');
    }
  };

  const pending = tasks.filter(t => t.status === 'PENDING').length;
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completed = tasks.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <CheckSquare className="text-blue-600" /> Task Management
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Assign and monitor daily floor tasks for your staff.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} /> Create Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm font-bold text-gray-500 uppercase">Total Tasks</p>
          <p className="text-3xl font-black text-gray-900 mt-2">{tasks.length}</p>
        </div>
        <div className="bg-orange-50 p-5 rounded-2xl border border-orange-200 shadow-sm">
          <p className="text-sm font-bold text-orange-800 uppercase">Pending</p>
          <p className="text-3xl font-black text-orange-900 mt-2">{pending}</p>
        </div>
        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200 shadow-sm">
          <p className="text-sm font-bold text-blue-800 uppercase">In Progress</p>
          <p className="text-3xl font-black text-blue-900 mt-2">{inProgress}</p>
        </div>
        <div className="bg-green-50 p-5 rounded-2xl border border-green-200 shadow-sm">
          <p className="text-sm font-bold text-green-800 uppercase">Completed</p>
          <p className="text-3xl font-black text-green-900 mt-2">{completed}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
              <th className="p-4 font-bold">Task</th>
              <th className="p-4 font-bold">Assignee</th>
              <th className="p-4 font-bold">Priority</th>
              <th className="p-4 font-bold">Due Date</th>
              <th className="p-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tasks.map(task => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <p className="font-bold text-gray-900">{task.title}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">{task.user?.name || 'Unassigned'}</span>
                  </div>
                </td>
                <td className="p-4">
                  {task.priority === 'HIGH' && <span className="flex items-center gap-1 text-red-600 font-bold text-xs bg-red-50 px-2 py-1 rounded w-max"><AlertCircle size={14}/> HIGH</span>}
                  {task.priority === 'MEDIUM' && <span className="flex items-center gap-1 text-orange-600 font-bold text-xs bg-orange-50 px-2 py-1 rounded w-max">MEDIUM</span>}
                  {task.priority === 'LOW' && <span className="flex items-center gap-1 text-gray-600 font-bold text-xs bg-gray-100 px-2 py-1 rounded w-max">LOW</span>}
                </td>
                <td className="p-4 text-gray-600 font-medium text-sm flex items-center gap-1">
                  <Clock size={14} /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}
                </td>
                <td className="p-4">
                  {task.status === 'PENDING' && <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full">PENDING</span>}
                  {task.status === 'IN_PROGRESS' && <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">IN PROGRESS</span>}
                  {task.status === 'COMPLETED' && <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">COMPLETED</span>}
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">No tasks found. Click "Create Task" to add one!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-gray-900 text-lg">Create New Task</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Task Title</label>
                <input 
                  type="text" required 
                  value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  placeholder="e.g. Inspect Fridge 2"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Priority</label>
                <select 
                  value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Due Date</label>
                <input 
                  type="date" 
                  value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Assign To</label>
                <select 
                  value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Unassigned (Floor Task)</option>
                  {staffList.map(staff => (
                    <option key={staff.id} value={staff.id}>{staff.name} ({staff.role})</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 font-bold text-gray-700 rounded-xl hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTasks;
