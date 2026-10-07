import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Star, Clock } from 'lucide-react';

const CustomerPage = () => {
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
        <ShoppingBag className="w-8 h-8 text-emerald-600" />
        <h1 className="text-3xl font-bold text-gray-900">Customer Portal</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-2">Welcome, {user?.name}!</h2>
        <p className="text-gray-600">Discover fresh products and track your orders here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Favorites</h3>
            <p className="text-sm text-gray-500 mt-1">View your saved items and quick re-order.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Order History</h3>
            <p className="text-sm text-gray-500 mt-1">Check your previous purchases and status.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
