import { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line,
  BarChart as RechartsBarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell
} from 'recharts';

/* ============================================================
   Premium Admin Charts — Recharts
   Vibrant palette, glassy tooltips, smooth gradients.
   ============================================================ */

// Rich vibrant palette
const PALETTE = {
  violet:  '#7c3aed',
  indigo:  '#4f46e5',
  blue:    '#0ea5e9',
  cyan:    '#06b6d4',
  emerald: '#10b981',
  amber:   '#f59e0b',
  rose:    '#f43f5e',
  accent:  '#c2593c',
};

const GRID_COLOR   = '#f1f5f9';
const AXIS_COLOR   = '#94a3b8';

const compact = (n) => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (abs >= 1_000)     return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return `${Math.round(n)}`;
};

const shortDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

/* ---- Glassy Tooltip ---- */
const GlassTooltip = ({ active, payload, label, seriesFormat }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: 'rgba(15,23,42,0.92)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14,
      padding: '10px 14px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      minWidth: 140,
    }}>
      <p style={{ color: '#94a3b8', fontSize: 11, marginBottom: 6, fontWeight: 600, letterSpacing: '0.04em' }}>
        {shortDate(label)}
      </p>
      {payload.map((entry, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <span style={{
            display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
            background: entry.color, flexShrink: 0,
            boxShadow: `0 0 6px ${entry.color}88`
          }} />
          <span style={{ color: '#cbd5e1', fontSize: 11 }}>{entry.name}</span>
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, marginLeft: 'auto', paddingLeft: 12, fontVariantNumeric: 'tabular-nums' }}>
            {seriesFormat ? seriesFormat(entry.value, entry.dataKey, entry.name) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ---- Axis tick helpers ---- */
const axisProps = {
  axisLine: false,
  tickLine: false,
  tick: { fontSize: 11, fill: AXIS_COLOR, fontWeight: 500 },
};

/* ============================================================
   Delta Badge
   ============================================================ */
export function DeltaBadge({ value, suffix = '' }) {
  if (value == null) return <span className="text-xs text-gray-300">—</span>;
  const up = value >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${up ? 'text-emerald-500' : 'text-rose-500'}`}>
      <Icon className="h-3.5 w-3.5" />
      {Math.abs(value)}%{suffix}
    </span>
  );
}

/* ============================================================
   Dual Area Chart  (Revenue + Visitors)
   ============================================================ */
export function DualAreaChart({ data = [], seriesA, seriesB }) {
  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  const colorA = seriesA.color || PALETTE.violet;
  const colorB = seriesB.color || PALETTE.cyan;

  const fmtA = (v) => seriesA.format ? seriesA.format(v) : compact(v);
  const fmtB = (v) => seriesB.format ? seriesB.format(v) : compact(v);

  return (
    <div className="w-full">
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={colorA} stopOpacity={0.35} />
                <stop offset="100%" stopColor={colorA} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={colorB} stopOpacity={0.35} />
                <stop offset="100%" stopColor={colorB} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke={GRID_COLOR} strokeDasharray="0" vertical={false} />
            <XAxis dataKey="date" {...axisProps} tickFormatter={shortDate} dy={8} minTickGap={40} />
            <YAxis yAxisId="left"  {...axisProps} tickFormatter={fmtA} dx={-4} tick={{ ...axisProps.tick, fill: colorA }} />
            <YAxis yAxisId="right" {...axisProps} orientation="right" tickFormatter={fmtB} dx={4} tick={{ ...axisProps.tick, fill: colorB }} />

            <Tooltip
              content={<GlassTooltip seriesFormat={(v, key) => key === seriesA.key ? fmtA(v) : fmtB(v)} />}
              cursor={{ stroke: '#e2e8f0', strokeWidth: 1.5, strokeDasharray: '4 4' }}
            />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey={seriesA.key}
              name={seriesA.label}
              stroke={colorA}
              strokeWidth={2.5}
              fill="url(#gradA)"
              fillOpacity={1}
              dot={false}
              activeDot={{ r: 6, fill: colorA, stroke: '#fff', strokeWidth: 2.5, filter: `drop-shadow(0 0 6px ${colorA})` }}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey={seriesB.key}
              name={seriesB.label}
              stroke={colorB}
              strokeWidth={2.5}
              fill="url(#gradB)"
              fillOpacity={1}
              dot={false}
              activeDot={{ r: 6, fill: colorB, stroke: '#fff', strokeWidth: 2.5, filter: `drop-shadow(0 0 6px ${colorB})` }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Custom legend */}
      <div className="flex items-center justify-center gap-8 mt-3">
        {[{ color: colorA, label: seriesA.label }, { color: colorB, label: seriesB.label }].map(s => (
          <span key={s.label} className="inline-flex items-center gap-2 text-xs font-medium text-gray-500">
            <span className="w-5 h-0.5 rounded-full" style={{ backgroundColor: s.color, boxShadow: `0 0 6px ${s.color}` }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Multi-Line Chart  (Traffic · Orders · Inquiries)
   ============================================================ */
export function MultiLineChart({ data = [], series = [], integer = true, formatValue = (v) => `${v}` }) {
  if (!data || data.length === 0 || series.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="w-full">
      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={GRID_COLOR} strokeDasharray="0" vertical={false} />
            <XAxis dataKey="date" {...axisProps} tickFormatter={shortDate} dy={8} minTickGap={40} />
            <YAxis {...axisProps} tickFormatter={formatValue} dx={-4} />
            <Tooltip
              content={<GlassTooltip seriesFormat={(v) => formatValue(v)} />}
              cursor={{ stroke: '#e2e8f0', strokeWidth: 1.5, strokeDasharray: '4 4' }}
            />
            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: s.color, stroke: '#fff', strokeWidth: 2.5, filter: `drop-shadow(0 0 6px ${s.color})` }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-8 mt-3">
        {series.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-2 text-xs font-medium text-gray-500">
            <span className="w-5 h-0.5 rounded-full" style={{ backgroundColor: s.color, boxShadow: `0 0 6px ${s.color}` }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Bar Chart  (Weekly / Monthly Average Sales)
   ============================================================ */
export function BarChart({ data = [], color = PALETTE.violet, formatValue = compact, unit = '' }) {
  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  // Generate subtle gradient per bar based on index
  const barColors = [
    PALETTE.violet, PALETTE.indigo, PALETTE.blue, PALETTE.cyan,
    PALETTE.emerald, PALETTE.amber, PALETTE.rose, PALETTE.accent,
  ];

  return (
    <div style={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }} barCategoryGap="35%">
          <defs>
            {data.map((_, i) => {
              const c = barColors[i % barColors.length];
              return (
                <linearGradient key={i} id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={c} stopOpacity={1} />
                  <stop offset="100%" stopColor={c} stopOpacity={0.55} />
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="0" vertical={false} />
          <XAxis dataKey="label" {...axisProps} dy={8} />
          <YAxis {...axisProps} tickFormatter={(v) => `${unit}${formatValue(v)}`} dx={-4} />
          <Tooltip
            cursor={{ fill: 'rgba(241,245,249,0.8)', radius: 6 }}
            content={
              <GlassTooltip seriesFormat={(v) => `${unit}${formatValue(v)}`} />
            }
          />
          <Bar dataKey="value" name="Sales" radius={[6, 6, 0, 0]} maxBarSize={52}>
            {data.map((_, i) => (
              <Cell key={i} fill={`url(#barGrad${i})`} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ============================================================
   Status Breakdown (Horizontal progress bars)
   ============================================================ */
const STATUS_STYLES = {
  pending:    { bg: 'bg-slate-100',   bar: 'from-slate-400 to-slate-300',    text: 'text-slate-600' },
  processing: { bg: 'bg-blue-50',     bar: 'from-blue-500 to-blue-400',      text: 'text-blue-600' },
  shipped:    { bg: 'bg-violet-50',   bar: 'from-violet-500 to-violet-400',  text: 'text-violet-600' },
  delivered:  { bg: 'bg-emerald-50',  bar: 'from-emerald-500 to-emerald-400',text: 'text-emerald-600' },
  cancelled:  { bg: 'bg-rose-50',     bar: 'from-rose-500 to-rose-400',      text: 'text-rose-600' },
};

export function StatusBreakdown({ data = [] }) {
  if (!data || data.length === 0)
    return <EmptyState text="No orders to break down yet." />;

  const total = data.reduce((s, d) => s + d.count, 0);
  const max   = Math.max(1, ...data.map((d) => d.count));
  if (total === 0) return <EmptyState text="No orders to break down yet." />;

  return (
    <div className="space-y-3.5">
      {data.map((d) => {
        const style = STATUS_STYLES[d.status] || STATUS_STYLES.pending;
        const pct   = total ? Math.round((d.count / total) * 100) : 0;
        const width = Math.max((d.count / max) * 100, d.count ? 4 : 0);
        return (
          <div key={d.status}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-semibold capitalize ${style.text}`}>{d.status}</span>
              <span className="text-xs text-gray-400 tabular-nums">{d.count} · {pct}%</span>
            </div>
            <div className={`h-2 rounded-full ${style.bg} overflow-hidden`}>
              <div
                className={`h-full rounded-full bg-gradient-to-r ${style.bar} transition-all duration-700`}
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   Donut Chart  (Sales by Category)
   ============================================================ */
export function DonutChart({ data = [], formatValue = (v) => v }) {
  const [hover, setHover] = useState(null);
  const items = data.filter((d) => d.value > 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative shrink-0 opacity-30">
          <svg viewBox="0 0 180 180" width="160" height="160">
            <circle cx="90" cy="90" r="57" fill="none" stroke="#e2e8f0" strokeWidth="26" />
          </svg>
        </div>
        <p className="text-sm text-gray-400">No sales in this range yet.</p>
      </div>
    );
  }

  const total = items.reduce((s, d) => s + d.value, 0);
  const R = 70, r = 46, C = 90;
  let acc = 0;
  const segs = items.map((d) => {
    const frac = d.value / total;
    const seg  = { ...d, start: acc, end: acc + frac };
    acc += frac;
    return seg;
  });

  const arc = (start, end) => {
    const a0 = start * 2 * Math.PI - Math.PI / 2;
    const a1 = end * 2 * Math.PI - Math.PI / 2;
    const large = end - start > 0.5 ? 1 : 0;
    const x0 = C + R * Math.cos(a0), y0 = C + R * Math.sin(a0);
    const x1 = C + R * Math.cos(a1), y1 = C + R * Math.sin(a1);
    const xi1 = C + r * Math.cos(a1), yi1 = C + r * Math.sin(a1);
    const xi0 = C + r * Math.cos(a0), yi0 = C + r * Math.sin(a0);
    return `M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${r} ${r} 0 ${large} 0 ${xi0} ${yi0} Z`;
  };

  const hv = hover != null ? segs[hover] : null;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative shrink-0">
        <svg viewBox="0 0 180 180" width="160" height="160" style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.08))' }}>
          {segs.map((s, i) => (
            <path
              key={i}
              d={arc(s.start, s.end)}
              fill={s.color}
              opacity={hover == null || hover === i ? 1 : 0.3}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ transition: 'opacity .2s, transform .2s', cursor: 'pointer', transformOrigin: '90px 90px',
                       transform: hover === i ? 'scale(1.04)' : 'scale(1)' }}
            />
          ))}
          {/* Center text */}
          <text x="90" y="82" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="600" letterSpacing="0.05em">
            {hv ? hv.name.substring(0, 10) : 'TOTAL'}
          </text>
          <text x="90" y="103" textAnchor="middle" fontSize="20" fontWeight="800" fill="#0f172a">
            {formatValue(hv ? hv.value : total)}
          </text>
        </svg>
      </div>

      <div className="flex-1 w-full space-y-2.5">
        {segs.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 cursor-pointer group"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <span
              className="w-3 h-3 rounded-full shrink-0 transition-transform group-hover:scale-125"
              style={{ backgroundColor: s.color, boxShadow: `0 0 8px ${s.color}60` }}
            />
            <span className="flex-1 truncate text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{s.name}</span>
            <span className="text-xs text-gray-400 tabular-nums font-semibold">{Math.round((s.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Popularity Bars  (Product Demand)
   ============================================================ */
const BAR_COLORS = [PALETTE.violet, PALETTE.blue, PALETTE.cyan, PALETTE.emerald, PALETTE.amber, PALETTE.rose];

export function PopularityBars({ data = [], unit = '' }) {
  if (!data || data.length === 0) return <EmptyState text="No product sales yet." />;
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="space-y-5">
      {data.map((d, i) => {
        const color = d.color || BAR_COLORS[i % BAR_COLORS.length];
        const pct   = Math.max((d.value / max) * 100, 4);
        return (
          <div key={i} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}60` }}
                >
                  {i + 1}
                </span>
                <span className="text-sm font-semibold text-gray-700 truncate">{d.name}</span>
              </div>
              <span className="text-xs font-bold text-gray-500 tabular-nums">{unit}{d.value}</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}50` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   Empty State helper
   ============================================================ */
function EmptyState({ text = 'No data available yet.' }) {
  return (
    <div className="flex flex-col items-center justify-center h-40 gap-2">
      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
        <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <p className="text-sm text-gray-400 font-medium">{text}</p>
    </div>
  );
}
