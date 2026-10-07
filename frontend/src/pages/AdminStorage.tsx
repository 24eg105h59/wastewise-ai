import React from 'react';
import { Thermometer, Snowflake, Archive, AlertTriangle, CheckCircle2, Settings } from 'lucide-react';

const AdminStorage = () => {
  const storages = [
    { id: 1, name: 'Main Refrigerator', type: 'Refrigerator', currentTemp: 4.2, requiredMin: 2, requiredMax: 5, status: 'NORMAL', icon: Thermometer },
    { id: 2, name: 'Meat Freezer', type: 'Freezer', currentTemp: -16.5, requiredMin: -20, requiredMax: -18, status: 'WARNING', icon: Snowflake },
    { id: 3, name: 'Dry Pantry A', type: 'Dry Storage', currentTemp: 22.0, requiredMin: 10, requiredMax: 25, status: 'NORMAL', icon: Archive },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Thermometer className="text-blue-600" /> Storage Management
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Monitor temperatures and storage conditions in real-time.</p>
        </div>
        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-50 flex items-center gap-2 shadow-sm">
          <Settings size={18} /> Configure Storage
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {storages.map(storage => (
          <div key={storage.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className={`p-4 border-b ${storage.status === 'WARNING' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'} flex justify-between items-center`}>
              <div className="flex items-center gap-2">
                <storage.icon className={storage.status === 'WARNING' ? 'text-red-600' : 'text-blue-600'} size={20} />
                <h3 className={`font-bold ${storage.status === 'WARNING' ? 'text-red-900' : 'text-gray-900'}`}>{storage.name}</h3>
              </div>
              {storage.status === 'WARNING' ? (
                <span className="flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                  <AlertTriangle size={14} /> Alert
                </span>
              ) : (
                <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                  <CheckCircle2 size={14} /> Normal
                </span>
              )}
            </div>
            
            <div className="p-6 text-center">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Current Temperature</p>
              <p className={`text-5xl font-black ${storage.status === 'WARNING' ? 'text-red-600' : 'text-gray-900'}`}>
                {storage.currentTemp}°C
              </p>
              
              <div className="mt-6 flex items-center justify-between text-sm border-t border-gray-100 pt-4">
                <div className="text-left">
                  <p className="text-gray-500 font-medium">Required Range</p>
                  <p className="font-bold text-gray-900">{storage.requiredMin}°C to {storage.requiredMax}°C</p>
                </div>
                {storage.status === 'WARNING' && (
                  <button className="bg-red-50 text-red-600 font-bold px-3 py-1 rounded-lg hover:bg-red-100">
                    Fix Issue
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Active Alerts Section */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-red-900 flex items-center gap-2 mb-4">
          <AlertTriangle className="text-red-600" /> Storage Warnings
        </h2>
        <div className="bg-white border border-red-100 p-4 rounded-xl flex justify-between items-center">
          <div>
            <p className="font-bold text-gray-900">Meat Freezer temperature exceeds configured range.</p>
            <p className="text-sm text-gray-600 mt-1">Current: -16.5°C | Required: -18°C. Verify the storage equipment and follow food-safety procedures.</p>
          </div>
          <button className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm">
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminStorage;
