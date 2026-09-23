import { useEffect, useState, Fragment } from 'react';
import { orderApi } from '../../api';
import { money } from '../../lib/format';
import { useAdminTitle } from '../../components/admin/useAdminTitle';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusColor = {
  pending: 'bg-gray-100 text-gray-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};
const payColor = {
  paid: 'bg-green-100 text-green-700',
  unpaid: 'bg-amber-100 text-amber-700',
  refunded: 'bg-gray-100 text-gray-500',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    setLoading(true);
    orderApi.listAll().then(setOrders).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const changeStatus = async (id, status) => {
    const updated = await orderApi.updateStatus(id, { status });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: updated.status } : o)));
  };

  const markPaid = async (id) => {
    const updated = await orderApi.updateStatus(id, { payment_status: 'paid' });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, payment_status: updated.payment_status } : o)));
  };

  useAdminTitle('Orders');

  if (loading) return <div className="text-gray-400">Loading orders…</div>;

  return (
    <div>
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">No orders yet.</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="text-left font-medium px-6 py-4">Order</th>
                <th className="text-left font-medium px-6 py-4">Customer</th>
                <th className="text-left font-medium px-6 py-4">Total</th>
                <th className="text-left font-medium px-6 py-4">Payment</th>
                <th className="text-left font-medium px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <Fragment key={o.id}>
                  <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                    <td className="px-6 py-4 font-medium text-gray-900">#{o.id}</td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{o.customer_name}</p>
                      <p className="text-xs text-gray-500">{o.customer_email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{money(o.total)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${payColor[o.payment_status]}`}>{o.payment_status}</span>
                        {o.payment_status === 'unpaid' && (
                          <button onClick={(e) => { e.stopPropagation(); markPaid(o.id); }} className="text-xs text-gray-500 hover:text-gray-900 underline">mark paid</button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={o.status}
                        onChange={(e) => changeStatus(o.id, e.target.value)}
                        className={`text-xs px-2.5 py-1.5 rounded-full font-medium border-none outline-none cursor-pointer ${statusColor[o.status]}`}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                  {expanded === o.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Items</h4>
                            <div className="space-y-1">
                              {(o.items || []).map((it) => (
                                <p key={it.id} className="text-sm text-gray-700">
                                  {it.quantity}× {it.product_name}
                                  {(it.size || it.color) && <span className="text-gray-400"> ({[it.size, it.color].filter(Boolean).join(', ')})</span>}
                                  <span className="text-gray-500"> — {money(it.price)}</span>
                                </p>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Shipping</h4>
                            <p className="text-sm text-gray-700">{o.shipping_address}</p>
                            <p className="text-sm text-gray-700">{[o.shipping_city, o.shipping_zip, o.shipping_country].filter(Boolean).join(', ')}</p>
                            {o.phone && <p className="text-sm text-gray-500 mt-1">☎ {o.phone}</p>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
