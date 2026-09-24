import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api';
import { money } from '../lib/format';

const UserOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    orderApi.listMine()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <p className="text-xl text-muted mb-4">Please sign in to view your orders.</p>
        <Link to="/login" className="text-accent font-medium underline hover:text-accent-hover transition-colors">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-12 pb-24">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-ink mb-10">My Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 h-24 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-muted mb-4">You have not placed any orders yet.</p>
            <Link to="/products" className="text-accent font-medium underline hover:text-accent-hover transition-colors">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order #{o.id}</p>
                    <p className="text-lg font-bold text-ink">{money(o.total)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      o.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                      o.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      o.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {o.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(o.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {(o.items || []).map((it) => `${it.quantity}x ${it.product_name}`).join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
