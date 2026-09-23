import { useEffect, useState } from 'react';
import { Users, ArrowLeft, Mail, Package, ShoppingBag, Calendar, Trash2, AlertTriangle } from 'lucide-react';
import { adminApi } from '../../api';
import { money } from '../../lib/format';
import { useAdminTitle } from '../../components/admin/useAdminTitle';

const statusColor = {
  pending: 'bg-gray-100 text-gray-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};
const payColor = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  unpaid: 'bg-amber-100 text-amber-700',
  refunded: 'bg-gray-100 text-gray-500',
};

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—');
const initials = (name) => (name || '?').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();

/* ---- Detail panel for a single customer ---- */
const CustomerDetail = ({ id, onBack }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(null);
    adminApi.customer(id).then(setData).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!data) return <div className="text-gray-400">Loading customer…</div>;

  const { customer, stats, orders } = data;

  return (
    <div>
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to customers
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-xl font-bold shrink-0">
            {initials(customer.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5"><Mail className="h-4 w-4" /> {customer.email}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1"><Calendar className="h-4 w-4" /> Joined {fmtDate(customer.created_at)}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <Stat label="Total spent" value={money(stats.totalSpent)} />
          <Stat label="Orders" value={stats.orderCount} />
          <Stat label="Paid orders" value={stats.paidCount} />
        </div>
      </div>

      {/* Orders */}
      <h3 className="font-semibold text-gray-900 mb-3">Order history</h3>
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
          This customer hasn't placed any orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">#{o.id}</span>
                  <span className="text-xs text-gray-400">{fmtDate(o.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${payColor[o.payment_status] || 'bg-gray-100 text-gray-700'}`}>{o.payment_status}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[o.status] || 'bg-gray-100 text-gray-700'}`}>{o.status}</span>
                  <span className="font-bold text-gray-900">{money(o.total)}</span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-1">
                {(o.items || []).map((it) => (
                  <p key={it.id} className="text-sm text-gray-700">
                    {it.quantity}× {it.product_name}
                    {(it.size || it.color) && <span className="text-gray-400"> ({[it.size, it.color].filter(Boolean).join(', ')})</span>}
                    <span className="text-gray-500"> — {money(it.price)}</span>
                  </p>
                ))}
                {(!o.items || o.items.length === 0) && <p className="text-sm text-gray-400">No item details.</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-lg font-bold text-gray-900">{value}</p>
  </div>
);

/* ---- Delete confirmation modal ---- */
const ConfirmDelete = ({ customer, busy, onCancel, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onCancel}>
    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Delete customer?</h3>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-medium text-gray-700">{customer.name}</span> ({customer.email}) will be permanently
            removed. Their past orders stay intact but will no longer be linked to an account.
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onCancel} disabled={busy} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={busy} className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
          {busy ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
);

/* ---- List of all customers ---- */
const AdminCustomers = () => {
  const [customers, setCustomers] = useState(null);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [q, setQ] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  useAdminTitle('Customers');

  useEffect(() => {
    adminApi.customers().then(setCustomers).catch((e) => setError(e.message));
  }, []);

  const handleDelete = async () => {
    if (!toDelete) return;
    setBusy(true);
    try {
      await adminApi.deleteCustomer(toDelete.id);
      setCustomers((prev) => prev.filter((c) => c.id !== toDelete.id));
      setToDelete(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (selected) return <CustomerDetail id={selected} onBack={() => setSelected(null)} />;

  if (error) return <div className="text-red-600">{error}</div>;
  if (!customers) return <div className="text-gray-400">Loading customers…</div>;

  const filtered = customers.filter(
    (c) => c.name?.toLowerCase().includes(q.toLowerCase()) || c.email?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      {toDelete && <ConfirmDelete customer={toDelete} busy={busy} onCancel={() => setToDelete(null)} onConfirm={handleDelete} />}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users className="h-5 w-5" />
          <span>{customers.length} registered customer{customers.length === 1 ? '' : 's'}</span>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name or email…"
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-gray-900 focus:border-gray-900 outline-none w-64 max-w-full"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
          {customers.length === 0 ? 'No customers have registered yet.' : 'No customers match your search.'}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="text-left font-medium px-6 py-4">Customer</th>
                <th className="text-left font-medium px-6 py-4"><span className="inline-flex items-center gap-1"><ShoppingBag className="h-3.5 w-3.5" /> Orders</span></th>
                <th className="text-left font-medium px-6 py-4">Total spent</th>
                <th className="text-left font-medium px-6 py-4">Last order</th>
                <th className="text-right font-medium px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(c.id)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0">{initials(c.name)}</div>
                      <div>
                        <p className="text-gray-900 font-medium">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-gray-900">
                      <Package className="h-4 w-4 text-gray-400" /> {c.orderCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{money(c.totalSpent)}</td>
                  <td className="px-6 py-4 text-gray-500">{fmtDate(c.lastOrderAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); setToDelete(c); }}
                      title="Delete customer"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
