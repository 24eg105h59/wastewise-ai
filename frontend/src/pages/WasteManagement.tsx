import React, { useState, useEffect } from 'react';
import { Trash2, TrendingDown, DollarSign, Download, Plus, X, AlertTriangle, CheckCircle2, AlertCircle, Loader2, PackageX } from 'lucide-react';
import { downloadAuditReport } from '../utils/reportGenerator';

const WasteManagement = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [wasteRecords, setWasteRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [customProductName, setCustomProductName] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [unit, setUnit] = useState<string>('units');
  const [reason, setReason] = useState<string>('Expired / Past Expiry Date');
  const [estimatedValue, setEstimatedValue] = useState<string>('150');
  const [notes, setNotes] = useState<string>('');
  const [deductInventory, setDeductInventory] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [invRes, wasteRes] = await Promise.all([
        fetch('/api/products', { headers }),
        fetch('/api/waste', { headers })
      ]);

      if (invRes.ok) {
        const invData = await invRes.json();
        setInventory(invData);
      }

      if (wasteRes.ok) {
        const wasteData = await wasteRes.json();
        setWasteRecords(wasteData);
      }
    } catch (err) {
      console.error('Failed to fetch waste data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update unit and estimated value when product selection or quantity changes
  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    if (prodId === 'custom') return;

    const prod = inventory.find(p => p.id === prodId);
    if (prod) {
      setUnit(prod.unit || 'units');
      const qtyNum = parseFloat(quantity) || 1;
      const unitPrice = prod.price || 150;
      setEstimatedValue((qtyNum * unitPrice).toString());
    }
  };

  const handleQuantityChange = (newQty: string) => {
    setQuantity(newQty);
    const qtyNum = parseFloat(newQty) || 0;
    if (selectedProductId && selectedProductId !== 'custom') {
      const prod = inventory.find(p => p.id === selectedProductId);
      const unitPrice = prod?.price || 150;
      setEstimatedValue((qtyNum * unitPrice).toString());
    }
  };

  const handleLogWasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      alert('Please select a product or choose "Custom / Other Product"');
      return;
    }

    if (selectedProductId === 'custom' && !customProductName.trim()) {
      alert('Please enter the custom product name.');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');

      const payload = {
        productId: selectedProductId !== 'custom' ? selectedProductId : undefined,
        productName: selectedProductId === 'custom' ? customProductName.trim() : undefined,
        quantity: parseFloat(quantity) || 1,
        reason,
        estimatedValue: parseFloat(estimatedValue) || 0,
        notes: notes.trim() || undefined,
        removeProduct: deductInventory
      };

      const res = await fetch('/api/waste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowLogModal(false);
        // Reset form
        setSelectedProductId('');
        setCustomProductName('');
        setQuantity('1');
        setReason('Expired / Past Expiry Date');
        setEstimatedValue('150');
        setNotes('');
        setDeductInventory(true);

        setStatusMsg({ type: 'success', text: 'Waste record logged and inventory adjusted successfully!' });
        setTimeout(() => setStatusMsg(null), 4500);
        await fetchData();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Failed to log waste.');
      }
    } catch (err) {
      console.error('Error logging waste:', err);
      alert('Network error while saving waste record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Metrics computation
  const recordedWasteLoss = wasteRecords.reduce((acc, curr) => acc + (parseFloat(curr.estimatedValue) || 0), 0);
  
  // Categorize waste
  const categoryLossMap: Record<string, number> = {};
  wasteRecords.forEach(r => {
    const cat = r.product?.category?.name || 'General';
    categoryLossMap[cat] = (categoryLossMap[cat] || 0) + (parseFloat(r.estimatedValue) || 0);
  });

  let topWasteCat = 'None';
  let topWastePercentage = 0;
  if (recordedWasteLoss > 0) {
    const sorted = Object.entries(categoryLossMap).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0) {
      topWasteCat = sorted[0][0];
      topWastePercentage = Math.round((sorted[0][1] / recordedWasteLoss) * 100);
    }
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Trash2 className="text-blue-600" /> Waste Tracking & Disposals
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Log discarded inventory, track financial loss, and analyze spoilage causes.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => downloadAuditReport(inventory, wasteRecords, 'HD Bakers')}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download size={18} /> Download Waste Report
          </button>
          <button 
            onClick={() => setShowLogModal(true)} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} /> Log Waste
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
          statusMsg.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 size={20} className="text-green-600" /> : <AlertCircle size={20} className="text-red-600" />}
          <span className="font-medium text-sm">{statusMsg.text}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider">Total Recorded Loss</h3>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><DollarSign size={18} /></div>
          </div>
          <div>
            <p className="text-3xl font-black text-gray-900">₹{recordedWasteLoss.toLocaleString()}</p>
            <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-2">
              <TrendingDown size={14} className="rotate-180" /> Across {wasteRecords.length} recorded disposal events
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider">Top Spoilage Category</h3>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><PackageX size={18} /></div>
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">{topWasteCat}</p>
            <p className="text-xs text-gray-500 font-medium mt-2">
              {topWastePercentage > 0 ? `${topWastePercentage}% of total recorded loss` : 'No category loss reported'}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-blue-900 font-bold text-sm flex items-center gap-1.5 mb-2">
              <AlertTriangle size={16} className="text-blue-600" /> AI Prevention Insights
            </h3>
            <p className="text-blue-800 text-xs leading-relaxed">
              {topWastePercentage > 0 
                ? `Disposals in "${topWasteCat}" make up ${topWastePercentage}% of kitchen waste. Use the Expiry Command Center to push urgent batches to staff 48 hours before expiration.`
                : 'Zero waste recorded so far. Maintain FEFO rotation to keep waste metrics optimal!'}
            </p>
          </div>
          <div className="mt-3 text-[11px] font-semibold text-blue-700 bg-white/70 py-1 px-2.5 rounded-lg w-fit border border-blue-200/50">
            Automated Waste Auditing Active
          </div>
        </div>
      </div>

      {/* Waste Records Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-bold text-gray-900 text-base">Recorded Disposals & Waste Log</h2>
          <span className="text-xs font-semibold text-gray-500 bg-gray-200/70 px-2.5 py-1 rounded-full">
            {wasteRecords.length} records
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-bold">Product</th>
                <th className="p-4 font-bold">Quantity</th>
                <th className="p-4 font-bold">Reason</th>
                <th className="p-4 font-bold">Estimated Loss</th>
                <th className="p-4 font-bold">Logged Date</th>
                <th className="p-4 font-bold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {wasteRecords.map(item => {
                let badgeClass = 'bg-gray-100 text-gray-700';
                if (item.reason?.includes('Expired')) badgeClass = 'bg-red-100 text-red-700';
                else if (item.reason?.includes('Spoiled')) badgeClass = 'bg-amber-100 text-amber-800';
                else if (item.reason?.includes('Damaged')) badgeClass = 'bg-purple-100 text-purple-700';

                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-900">
                      {item.product?.name || 'Direct Item'}
                      {item.product?.category && (
                        <span className="block text-xs font-normal text-gray-500">{item.product.category.name}</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-700 font-medium">
                      {item.quantity} {item.product?.unit || 'units'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${badgeClass}`}>
                        {item.reason}
                      </span>
                    </td>
                    <td className="p-4 font-black text-red-600">
                      ₹{parseFloat(item.estimatedValue || 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-gray-500 text-xs">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Today'}
                    </td>
                    <td className="p-4 text-gray-600 text-xs max-w-xs truncate">
                      {item.notes || '—'}
                    </td>
                  </tr>
                );
              })}
              {wasteRecords.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-500 text-sm">
                    {loading ? 'Loading waste records...' : 'No waste has been logged yet. Click "+ Log Waste" to record discarded goods.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Waste Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Trash2 className="text-red-500" /> Log Waste & Disposal
                </h2>
                <p className="text-sm text-gray-500">Record discarded stock to maintain accurate inventory and audit logs.</p>
              </div>
              <button 
                onClick={() => setShowLogModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleLogWasteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Select Product *
                </label>
                <select 
                  required
                  value={selectedProductId}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">-- Choose from active inventory --</option>
                  {inventory.map(prod => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name} (Stock: {prod.quantity} {prod.unit || 'units'} - ₹{prod.price || 150}/unit)
                    </option>
                  ))}
                  <option value="custom">+ Other / Custom Item Not Listed</option>
                </select>
              </div>

              {selectedProductId === 'custom' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Custom Product Name *
                  </label>
                  <input 
                    type="text"
                    required
                    value={customProductName}
                    onChange={(e) => setCustomProductName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="e.g. Sourdough Loaf, Spoiled Greek Yogurt"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Quantity Discarded *
                  </label>
                  <input 
                    type="number"
                    step="any"
                    min="0.1"
                    required
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Unit
                  </label>
                  <input 
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="units, kg, liters"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Reason for Disposal *
                </label>
                <select 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="Expired / Past Expiry Date">Expired / Past Expiry Date</option>
                  <option value="Spoiled / Mold / Quality Decay">Spoiled / Mold / Quality Decay</option>
                  <option value="Packaging Damaged / Broken Seal">Packaging Damaged / Broken Seal</option>
                  <option value="Overproduction / Unsold Food">Overproduction / Unsold Food</option>
                  <option value="Temperature Abuse / Cooler Failure">Temperature Abuse / Cooler Failure</option>
                  <option value="Contamination / Dropped">Contamination / Dropped</option>
                  <option value="Other">Other Reason</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Estimated Financial Loss (₹)
                </label>
                <input 
                  type="number"
                  step="any"
                  min="0"
                  value={estimatedValue}
                  onChange={(e) => setEstimatedValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Notes & Details
                </label>
                <textarea 
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Optional notes: e.g. cooler temp hit 12C overnight, batch smelled sour..."
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 font-medium">
                  <input 
                    type="checkbox"
                    checked={deductInventory}
                    onChange={(e) => setDeductInventory(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span>Automatically decrement discarded quantity from active inventory</span>
                </label>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t mt-6">
                <button 
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-60 rounded-lg transition-colors text-sm flex items-center gap-2 shadow-sm"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  <span>{isSubmitting ? 'Logging...' : 'Confirm Disposal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WasteManagement;
