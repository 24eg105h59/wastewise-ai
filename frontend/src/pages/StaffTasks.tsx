import React, { useState, useEffect } from 'react';
import { CheckSquare, Clock, AlertCircle, Play, Check, Flag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StaffTasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

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

  const handleUpdateStatus = async (taskId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchTasks(); // Refresh tasks (it will disappear if deleted)
      }
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <CheckSquare className="text-blue-600" /> My Tasks
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Focus on these tasks assigned to the floor.</p>
      </div>

      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="space-y-2">
                <div className="flex gap-2 items-center flex-wrap">
                  {task.priority === 'HIGH' && <span className="bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded flex items-center gap-1"><AlertCircle size={12}/> High</span>}
                  {task.priority === 'MEDIUM' && <span className="bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded">Medium</span>}
                  {task.priority === 'LOW' && <span className="bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded">Normal</span>}
                  
                  {task.status === 'IN_PROGRESS' && <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded">In Progress</span>}
                  
                  <span className="text-xs text-gray-500 font-bold flex items-center gap-1">
                    <Clock size={12}/> Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
                {task.user?.name && <p className="text-sm font-medium text-gray-500">Assigned to: {task.user.name}</p>}
              </div>
              
              <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
                {task.status === 'PENDING' && (
                  <button onClick={() => handleUpdateStatus(task.id, 'IN_PROGRESS')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-50 text-blue-700 font-bold px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
                    <Play size={18} /> Start
                  </button>
                )}
                <button onClick={() => handleUpdateStatus(task.id, 'COMPLETED')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-50 text-green-700 font-bold px-4 py-2 rounded-xl hover:bg-green-100 transition-colors">
                  <Check size={18} /> Complete
                </button>
                <button className="flex items-center justify-center bg-gray-50 text-gray-500 hover:text-red-600 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors" title="Report Problem">
                  <Flag size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Check size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">You're all caught up!</h3>
            <p className="text-gray-500 mt-2 font-medium">No pending tasks assigned to the floor right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffTasks;
