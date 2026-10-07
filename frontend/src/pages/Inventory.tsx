import React, { useState } from 'react';
import { Package, Search, Filter, Plus, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Inventory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState<any[]>([]);
  
  // State for the edit modal
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newExpiry, setNewExpiry] = useState('');
  const [newName, setNewName] = useState('');

  const fetchInventory = async () => {
    try {
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
    }
  };

  React.useEffect(() => {
    fetchInventory();
  }, []);

  const handleEditClick = (product: any) => {
    setEditingProduct(product);
    setNewName(product.name || '');
    // Format date for input type="date"
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
        fetchInventory(); // Refresh data
      }
    } catch (err) {
      console.error('Failed to update', err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="text-primary" /> Inventory
          </h1>
          <p className="text-gray-500 mt-2">Manage all your monitored products and stock levels.</p>
        </div>
        <button onClick={() => navigate('/scanner')} className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by product name, category, or barcode..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
              <th className="p-4 font-medium">Product Name</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Quantity</th>
              <th className="p-4 font-medium">Expiry Date</th>
              <th className="p-4 font-medium">Location</th>
              <th className="p-4 font-medium">Risk Level</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-900">{item.name}</td>
                <td className="p-4 text-gray-600">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">{item.category?.name || 'Uncategorized'}</span>
                </td>
                <td className="p-4 text-gray-900">{item.quantity} {item.unit}</td>
                <td className={`p-4 font-medium ${item.expiryDate && new Date(item.expiryDate) < new Date() ? 'text-red-600' : 'text-gray-900'}`}>
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
                  <button onClick={() => handleEditClick(item)} className="text-gray-400 hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
                    <Edit2 size={16} /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Product Data</h2>
            <p className="text-gray-500 text-sm mb-4">Updating: {editingProduct.name}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. Amul Taaza Milk"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input 
                  type="date"
                  value={newExpiry}
                  onChange={(e) => setNewExpiry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div className="flex gap-3 justify-end mt-6">
                <button 
                  onClick={() => setEditingProduct(null)} 
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdate} 
                  className="px-4 py-2 bg-primary text-white font-medium hover:bg-primary-dark rounded-lg transition-colors"
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
