import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Tags, ShoppingCart, Users, DollarSign, AlertTriangle, MessageCircle, TrendingUp, Globe, Percent, UserPlus, MapPin } from 'lucide-react';
import { adminApi } from '../../api';
import { money } from '../../lib/format';
import { useAdminTitle, useAdminActions } from '../../components/admin/useAdminTitle';
import { StatusBreakdown, DonutChart, PopularityBars, BarChart, DualAreaChart, DeltaBadge, MultiLineChart } from '../../components/admin/Charts';
import DateRangePicker, { PRESETS } from '../../components/admin/DateRangePicker';

const StatCard = ({ icon: Icon, label, value, accent, to, sub, delta }) => {
  const inner = (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 h-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</span>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <div className="flex items-center justify-between mt-1">
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
        {delta !== undefined && <DeltaBadge value={delta} />}
      </div>
    </div>
  );
  return to ? <Link to={to} className="block focus:outline-none focus:ring-2 focus:ring-gray-900 rounded-2xl">{inner}</Link> : inner;
};

const statusColor = {
  pending: 'bg-gray-100 text-gray-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const Card = ({ title, action, children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 p-6 shadow-sm ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-semibold text-gray-900">{title}</h2>
      {action}
    </div>
    {children}
  </div>
);

const compactMoney = (v) => (v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${Math.round(v)}`);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [bucket, setBucket] = useState('monthly'); // weekly | monthly
  const [refreshing, setRefreshing] = useState(false);
  // default range = last week (7d)
  const [range, setRange] = useState(() => {
    const p = PRESETS.find((x) => x.key === '7d');
    return { preset: '7d', ...p.range() };
  });

  useAdminTitle('Dashboard');

  // Mount the date-range filter into the shared admin header bar.
  useAdminActions(
    <div className="flex items-center gap-2">
      {refreshing && <span className="text-xs text-gray-400">Updating…</span>}
      <DateRangePicker value={range} onChange={setRange} />
    </div>,
    [range, refreshing]
  );

  useEffect(() => {
    let alive = true;
    setRefreshing(true);
    adminApi
      .stats({ start_date: range.start, end_date: range.end })
      .then((d) => alive && setStats(d))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setRefreshing(false));
    return () => {
      alive = false;
    };
  }, [range.start, range.end]);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!stats) return <div className="text-gray-400">Loading dashboard…</div>;

  const visitors = stats.visitors || { total: 0, visitsRange: 0, uniqueRange: 0, series: [], topPages: [] };
  const deltas = stats.deltas || {};
  const rangeLabel = `${stats.range?.days || 30}d`;

  return (
    <div>
      {/* Stat tiles with deltas — 6 cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard to="/admin/orders" icon={DollarSign} label="Revenue" value={money(stats.revenueRange)} accent="bg-indigo-50 text-indigo-600" sub={rangeLabel} delta={deltas.revenue} />
        <StatCard to="/admin/orders" icon={ShoppingCart} label="Orders" value={stats.ordersRange} accent="bg-blue-50 text-blue-600" sub={`${stats.paidCountRange} paid`} delta={deltas.orders} />
        <StatCard icon={Globe} label="Visitors" value={Math.round(visitors.visitsRange)} accent="bg-amber-50 text-amber-600" sub={`${Math.round(visitors.uniqueRange)} unique`} delta={deltas.visitors} />
        <StatCard icon={Percent} label="Conversion" value={`${stats.conversionRate || 0}%`} accent="bg-emerald-50 text-emerald-600" sub="orders / visits" />
        <StatCard icon={DollarSign} label="Avg Order" value={money(stats.avgOrderValue)} accent="bg-violet-50 text-violet-600" sub="per paid order" />
        <StatCard to="/admin/customers" icon={UserPlus} label="New Customers" value={stats.newCustomersRange || 0} accent="bg-pink-50 text-pink-600" sub={rangeLabel} delta={deltas.customers} />
      </div>

      {/* Hero: Revenue vs Visitors + category donut */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <Card
          title="Revenue & Traffic"
          className="xl:col-span-2"
          action={<span className="inline-flex items-center gap-1 text-xs text-gray-400"><TrendingUp className="h-4 w-4" /> {stats.range?.start} → {stats.range?.end}</span>}
        >
          <DualAreaChart
            data={stats.timeseries}
            seriesA={{ key: 'revenue', label: 'Revenue', color: '#10b981', format: (v) => money(v) }}
            seriesB={{ key: 'visits', label: 'Visitors', color: '#8b5cf6', format: (v) => `${Math.round(v)}` }}
          />
        </Card>

        <Card title="Sales by Category" action={<Link to="/admin/products" className="text-sm text-gray-500 hover:text-gray-900">Products →</Link>}>
          <DonutChart data={stats.salesByCategory || []} formatValue={compactMoney} />
        </Card>
      </div>

      {/* Product demand + Average sales toggle */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <Card title="Product Demand">
          <PopularityBars data={(stats.topProducts || []).map((p) => ({ name: p.name, value: p.qty, color: p.color }))} />
        </Card>

        <Card
          title="Average Sales"
          className="xl:col-span-2"
          action={
            <div className="inline-flex rounded-lg bg-gray-100 p-0.5 text-sm">
              {['weekly', 'monthly'].map((b) => (
                <button
                  key={b}
                  onClick={() => setBucket(b)}
                  className={`px-3 py-1 rounded-md capitalize transition-colors ${bucket === b ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  {b}
                </button>
              ))}
            </div>
          }
        >
          <BarChart data={(stats.salesBuckets && stats.salesBuckets[bucket]) || []} color="#4f46e5" formatValue={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : Math.round(v))} unit="$" />
        </Card>
      </div>

      <div className="grid grid-cols-1 mb-6">
        <Card
          title={<span className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-gray-400" /> Traffic · Orders · Inquiries Trend & Top Countries</span>}
          action={<span className="text-xs text-gray-400">{rangeLabel}</span>}
        >
          <div className="flex flex-col xl:flex-row gap-8">
            <div className="flex-1">
              <MultiLineChart
                data={stats.timeseries}
                integer={true}
                series={[
                  { key: 'visits', label: 'Traffic', color: '#3b82f6' },
                  { key: 'orders', label: 'Orders', color: '#f59e0b' },
                  { key: 'inquiries', label: 'Inquiries', color: '#10b981' },
                ]}
              />
            </div>
            <div className="w-full xl:w-80 shrink-0 border-t xl:border-t-0 xl:border-l border-gray-100 pt-6 xl:pt-0 xl:pl-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><MapPin className="h-4 w-4 text-indigo-500" /> Top Countries</h3>
              {!stats.countryBreakdown || !stats.countryBreakdown.countries || stats.countryBreakdown.countries.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">No country data available.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {stats.countryBreakdown.countries.slice(0, 5).map((c) => (
                    <div key={c.name} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-lg shrink-0">{c.code ? String.fromCodePoint(...[...c.code.toUpperCase()].map(x => 127397 + x.charCodeAt(0))) : '🌍'}</span>
                        <p className="text-sm font-medium text-gray-700 truncate">{c.name}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-gray-900 tabular-nums">{c.total}</p>
                        <p className="text-[10px] text-gray-400 tabular-nums uppercase tracking-wider">{c.orders > 0 ? `${c.orders} ords` : `${c.traffic} vsts`}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <Card title="Recent Orders" action={<Link to="/admin/orders" className="text-sm text-gray-500 hover:text-gray-900">View all →</Link>}>
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No orders yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {stats.recentOrders.map((o) => (
                <div key={o.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">#{o.id} · {o.customer_name}</p>
                    <p className="text-xs text-gray-500">{money(o.total)}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[o.status] || 'bg-gray-100 text-gray-700'}`}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Top selling products */}
        <Card title="Top Products" action={<Link to="/admin/products" className="text-sm text-gray-500 hover:text-gray-900">View all →</Link>}>
          {!stats.topProducts || stats.topProducts.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No product sales yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {stats.topProducts.map((p, i) => (
                <div key={p.name} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: p.color }}>{i + 1}</span>
                    <p className="text-sm font-medium text-gray-700 truncate">{p.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-900 tabular-nums">{money(p.revenue)}</p>
                    <p className="text-xs text-gray-400 tabular-nums">{p.qty} sold</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Low stock */}
        <Card title={<span className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" /> Low Stock</span>}>
          {stats.lowStock.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">All products are well stocked.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {stats.lowStock.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{p.name}</p>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Order status (Moved here from top) */}
        <Card title="Order status" action={<Link to="/admin/orders" className="text-sm text-gray-500 hover:text-gray-900">View all →</Link>}>
          <StatusBreakdown data={stats.ordersByStatus} />
        </Card>

        {/* Recent messages */}
        <Card title="Recent Messages" action={<Link to="/admin/messages" className="text-sm text-gray-500 hover:text-gray-900">View all →</Link>}>
          {!stats.recentMessages || stats.recentMessages.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No messages yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {stats.recentMessages.map((m) => (
                <div key={m.id} className="py-3">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium text-gray-900">{m.name}</p>
                    {!m.read && <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 font-medium">New</span>}
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{m.subject}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{m.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(m.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
