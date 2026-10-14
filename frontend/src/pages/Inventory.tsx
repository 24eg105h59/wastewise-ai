import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, Plus, Edit2, Download, ScanLine, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { downloadAuditReport } from '../utils/reportGenerator';

const initialProductState = {
  name: '',
  brand: '',
  categoryName: 'Dairy',
  quantity: '1',
  unit: 'units',
  price: '100',
  expiryDate: '',
  storageLocationName: 'Main Refrigerator',
  riskLevel: 'LOW'
};

const Inventory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // State for Add Product modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState(initialProductState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for Edit modal
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newExpiry, setNewExpiry] = useState('');
  const [newName, setNewName] = useState('');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInventory(data);
      }
    } catch (err) {
      console.error('Failed to fetch inventory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) {
      alert('Product Name is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newProduct.name.trim(),
          brand: newProduct.brand.trim() || undefined,
          categoryName: newProduct.categoryName,
          quantity: parseFloat(newProduct.quantity) || 1,
          unit: newProduct.unit,
          price: parseFloat(newProduct.price) || 0,
          expiryDate: newProduct.expiryDate ? new Date(newProduct.expiryDate).toISOString() : null,
          storageLocationName: newProduct.storageLocationName,
          riskLevel: newProduct.riskLevel
        })
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewProduct(initialProductState);
        setStatusMsg({ type: 'success', text: `Product "${newProduct.name}" successfully added to inventory!` });
        setTimeout(() => setStatusMsg(null), 4000);
        await fetchInventory();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Failed to create product.');
      }
    } catch (err) {
      console.error('Error creating product:', err);
      alert('Network error while saving product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (product: any) => {
    setEditingProduct(product);
    setNewName(product.name || '');
    if (product.expiryDate) {
      setNewExpiry(new Date(product.expiryDate).toISOString().split('T')[0]);
    } else {
      setNewExpiry('');
    }
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expiryDate: newExpiry, name: newName })
      });

      if (res.ok) {
        setEditingProduct(null);
        setStatusMsg({ type: 'success', text: 'Product updated successfully!' });
        setTimeout(() => setStatusMsg(null), 3000);
        fetchInventory();
      }
    } catch (err) {
      console.error('Failed to update', err);
    }
  };

  const filteredInventory = inventory.filter(item => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const nameMatch = (item.name || '').toLowerCase().includes(term);
    const brandMatch = (item.brand || '').toLowerCase().includes(term);
    const catMatch = (item.category?.name || '').toLowerCase().includes(term);
    const locMatch = (item.storageLocation?.name || '').toLowerCase().includes(term);
    return nameMatch || brandMatch || catMatch || locMatch;
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="text-blue-600" /> Inventory
          </h1>
          <p className="text-gray-500 mt-2">Manage all your monitored products, stock levels, and expiration dates.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => downloadAuditReport(inventory, [], 'HD Bakers')} 
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download size={18} /> Download Report
          </button>
          <button 
            onClick={() => navigate('/admin/scanner')} 
            className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2"
          >
            <ScanLine size={18} /> Scan with AI
          </button>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
          statusMsg.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 size={20} className="text-green-600" /> : <AlertCircle size={20} className="text-red-600" />}
          <span className="font-medium text-sm">{statusMsg.text}</span>
        </div>
      )}

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by product name, brand, category, or location..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-500 font-medium">
          Showing {filteredInventory.length} of {inventory.length} items
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
              <th className="p-4 font-medium">Product Name</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Quantity</th>
              <th className="p-4 font-medium">Price (₹)</th>
              <th className="p-4 font-medium">Expiry Date</th>
              <th className="p-4 font-medium">Location</th>
              <th className="p-4 font-medium">Risk Level</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredInventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-900">
                  {item.name}
                  {item.brand && <span className="block text-xs font-normal text-gray-500">{item.brand}</span>}
                </td>
                <td className="p-4 text-gray-600">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">{item.category?.name || 'Uncategorized'}</span>
                </td>
                <td className="p-4 text-gray-900 font-medium">{item.quantity} {item.unit || 'units'}</td>
                <td className="p-4 text-gray-900">₹{item.price || 150}</td>
                <td className={`p-4 font-medium ${item.expiryDate && new Date(item.expiryDate) < new Date() ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                  {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'Unknown'}
                </td>
                <td className="p-4 text-gray-600">{item.storageLocation?.name || 'Unassigned'}</td>
                <td className="p-4">
                  {item.riskLevel === 'LOW' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">LOW</span>}
                  {item.riskLevel === 'MEDIUM' && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">MEDIUM</span>}
                  {item.riskLevel === 'HIGH' && <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold">HIGH</span>}
                  {item.riskLevel === 'CRITICAL' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">CRITICAL</span>}
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleEditClick(item)} className="text-gray-400 hover:text-blue-600 transition-colors inline-flex items-center gap-1 text-sm font-medium">
                    <Edit2 size={16} /> Edit
                  </button>
                </td>
              </tr>
            ))}
            {filteredInventory.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">
                  {loading ? 'Loading inventory items...' : 'No products found. Click "+ Add Product" to create one.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
                <p className="text-sm text-gray-500">Enter product specifications to track in inventory</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input 
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="e.g. Fresh Whole Milk, Brown Bread, Tomatoes"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Brand / Producer
                  </label>
                  <input 
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="e.g. Amul, Britannia, Local Farm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Category
                  </label>
                  <select 
                    value={newProduct.categoryName}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="Dairy">Dairy</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Produce">Produce & Vegetables</option>
                    <option value="Meat & Poultry">Meat & Poultry</option>
                    <option value="Dry Goods">Dry Goods & Grains</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Condiments & Sauces">Condiments & Sauces</option>
                    <option value="Frozen">Frozen Foods</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input 
                    type="number"
                    step="any"
                    min="0.1"
                    required
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Unit
                  </label>
                  <select 
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="units">units</option>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="liters">liters</option>
                    <option value="ml">ml</option>
                    <option value="packets">packets</option>
                    <option value="boxes">boxes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Price per Unit (₹)
                  </label>
                  <input 
                    type="number"
                    step="any"
                    min="0"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input 
                    type="date"
                    value={newProduct.expiryDate}
                    onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Storage Location
                  </label>
                  <select 
                    value={newProduct.storageLocationName}
                    onChange={(e) => setNewProduct({ ...newProduct, storageLocationName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="Main Refrigerator">Main Refrigerator (4°C)</option>
                    <option value="Walk-in Freezer">Walk-in Freezer (-18°C)</option>
                    <option value="Dry Storage Pantry">Dry Storage Pantry</option>
                    <option value="Prep Counter Shelf">Prep Counter Shelf</option>
                    <option value="Bakery Display Case">Bakery Display Case</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Risk Assessment Level
                  </label>
                  <select 
                    value={newProduct.riskLevel}
                    onChange={(e) => setNewProduct({ ...newProduct, riskLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="LOW">LOW - Safe & Fresh</option>
                    <option value="MEDIUM">MEDIUM - Monitor Closely</option>
                    <option value="HIGH">HIGH - Urgent Consumption</option>
                    <option value="CRITICAL">CRITICAL - Immediate Action</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-4 border-t mt-6">
                <button 
                  type="button"
                  onClick={() => { setShowAddModal(false); navigate('/admin/scanner'); }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1.5"
                >
                  <ScanLine size={15} /> Prefer scanning product label instead?
                </button>
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60 rounded-lg transition-colors text-sm flex items-center gap-2 shadow-sm"
                  >
                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                    <span>{isSubmitting ? 'Saving...' : 'Add Product'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-2">Edit Product Data</h2>
            <p className="text-gray-500 text-sm mb-4">Updating: {editingProduct.name}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g. Amul Taaza Milk"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input 
                  type="date"
                  value={newExpiry}
                  onChange={(e) => setNewExpiry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              
              <div className="flex gap-3 justify-end mt-6">
                <button 
                  onClick={() => setEditingProduct(null)} 
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdate} 
                  className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors text-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
