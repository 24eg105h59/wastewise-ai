import React, { useState } from 'react';
import { Camera, AlertCircle, MapPin, Send, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaffReportIssue = () => {
  const navigate = useNavigate();
  const [issueType, setIssueType] = useState('');
  const [note, setNote] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      navigate('/staff/home');
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <AlertCircle className="text-red-600" /> Report an Issue
        </h1>
        <p className="text-gray-500 mt-2">Quickly report damaged packaging, spoilage, or storage issues.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-center">
          <button type="button" className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-colors">
            <Camera size={40} className="text-gray-400 mb-2" />
            <span className="font-bold">Take Photo of Issue</span>
            <span className="text-xs mt-1">or upload from gallery</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Issue Type</label>
            <div className="grid grid-cols-2 gap-3">
              {['Damaged Packaging', 'Leakage', 'Spoilage Concern', 'Wrong Storage', 'Expired Product', 'Missing Label'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setIssueType(type)}
                  className={`p-3 text-sm font-bold border rounded-lg text-left transition-colors ${
                    issueType === type 
                      ? 'bg-red-50 border-red-500 text-red-700' 
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
              <MapPin size={16} /> Location
            </label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            >
              <option value="">Select location...</option>
              <option value="refrigerator-1">Refrigerator 1 (Dairy)</option>
              <option value="refrigerator-2">Refrigerator 2 (Meat)</option>
              <option value="freezer-1">Main Freezer</option>
              <option value="dry-storage">Dry Storage A</option>
              <option value="pantry">Pantry</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Additional Notes</label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              rows={3}
              placeholder="Describe the issue in detail..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <button 
            type="submit" 
            disabled={submitting || !issueType || !location}
            className="w-full bg-red-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 disabled:opacity-50 transition-colors shadow-md"
          >
            {submitting ? 'Submitting...' : <><Send size={20} /> Submit Issue Report</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffReportIssue;
