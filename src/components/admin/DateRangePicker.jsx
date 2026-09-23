import { useEffect, useRef, useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

// Local YYYY-MM-DD
const ymd = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};
const startOfYear = () => new Date(new Date().getFullYear(), 0, 1);

// Preset ranges → { start, end } as YYYY-MM-DD (end always today)
export const PRESETS = [
  { key: 'today', label: 'Today', range: () => ({ start: ymd(new Date()), end: ymd(new Date()) }) },
  { key: '3d', label: 'Last 3 days', range: () => ({ start: ymd(daysAgo(2)), end: ymd(new Date()) }) },
  { key: '7d', label: 'Last week', range: () => ({ start: ymd(daysAgo(6)), end: ymd(new Date()) }) },
  { key: '30d', label: 'Last month', range: () => ({ start: ymd(daysAgo(29)), end: ymd(new Date()) }) },
  { key: '1y', label: 'Last year', range: () => ({ start: ymd(daysAgo(364)), end: ymd(new Date()) }) },
  { key: 'ytd', label: 'This year', range: () => ({ start: ymd(startOfYear()), end: ymd(new Date()) }) },
];

export default function DateRangePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [customStart, setCustomStart] = useState(value?.start || '');
  const [customEnd, setCustomEnd] = useState(value?.end || '');
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const activePreset = PRESETS.find((p) => p.key === value?.preset);
  const label = activePreset
    ? activePreset.label
    : value?.start && value?.end
    ? `${value.start} → ${value.end}`
    : 'Last month';

  const pick = (preset) => {
    const r = preset.range();
    onChange({ preset: preset.key, start: r.start, end: r.end });
    setOpen(false);
  };

  const applyCustom = () => {
    if (!customStart || !customEnd) return;
    const s = customStart <= customEnd ? customStart : customEnd;
    const e = customStart <= customEnd ? customEnd : customStart;
    onChange({ preset: null, start: s, end: e });
    setOpen(false);
  };

  const today = ymd(new Date());

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300"
      >
        <Calendar className="h-4 w-4 text-gray-400" />
        {label}
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-72 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl">
          <div className="grid grid-cols-2 gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.key}
                onClick={() => pick(p)}
                className={`rounded-lg px-3 py-2 text-sm text-left transition-colors ${
                  value?.preset === p.key ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="mt-3 border-t border-gray-100 pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Custom range</p>
            <div className="flex items-center gap-2">
              <input
                type="date"
                max={today}
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs outline-none focus:border-indigo-500"
              />
              <span className="text-gray-400">→</span>
              <input
                type="date"
                max={today}
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={applyCustom}
              disabled={!customStart || !customEnd}
              className="mt-2 w-full rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-40"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
