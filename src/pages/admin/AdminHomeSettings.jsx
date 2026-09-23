import { useEffect, useState } from 'react';
import { Save, Upload } from 'lucide-react';
import { settingsApi } from '../../api';
import { useAdminTitle } from '../../components/admin/useAdminTitle';
import Seo from '../../components/Seo';

const AdminHomeSettings = () => {
  const [form, setForm] = useState({
    hero_bg: '',
    hero_bg_file: null,
    hero_title: '',
    hero_highlighted_text: '',
    hero_subtitle: '',
    cta_text: '',
    cta_link: '',
    feature_1_title: '',
    feature_1_desc: '',
    feature_2_title: '',
    feature_2_desc: '',
    feature_3_title: '',
    feature_3_desc: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useAdminTitle('Home Settings');

  useEffect(() => {
    settingsApi
      .get()
      .then((s) => {
        setForm((f) => ({
          ...f,
          hero_bg: s.hero_bg || '',
          hero_bg_file: null,
          hero_title: s.hero_title || '',
          hero_highlighted_text: s.hero_highlighted_text || '',
          hero_subtitle: s.hero_subtitle || '',
          cta_text: s.cta_text || '',
          cta_link: s.cta_link || '',
          feature_1_title: s.feature_1_title || '',
          feature_1_desc: s.feature_1_desc || '',
          feature_2_title: s.feature_2_title || '',
          feature_2_desc: s.feature_2_desc || '',
          feature_3_title: s.feature_3_title || '',
          feature_3_desc: s.feature_3_desc || '',
        }));
      })
      .catch(() => {});
  }, []);

  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setFile = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.files[0] || null }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value instanceof File) {
          if (value.size > 0) fd.append(key, value);
        } else if (value !== null && value !== undefined) {
          fd.append(key, value);
        }
      });
      const updated = await settingsApi.update(fd);
      setForm((f) => ({
        ...f,
        hero_bg: updated.hero_bg || '',
        hero_bg_file: null,
      }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save home settings');
    } finally {
      setSaving(false);
    }
  };

  const input = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-gray-900 focus:border-gray-900 outline-none transition-colors';

  return (
    <div className="max-w-6xl">
      <Seo title="Admin — Home Settings" />

      {saved && <div className="mb-6 p-3 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-sm">Home Settings saved successfully.</div>}
      {error && <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-2">
        {/* Hero Background */}
        <Card title="Hero Section">
          <F label="Hero Background Image URL"><input value={form.hero_bg} onChange={setField('hero_bg')} className={input} placeholder="https://..." /></F>
          <F label="Upload Hero Background Image">
            <input type="file" onChange={setFile('hero_bg_file')} className={input} accept="image/*" />
          </F>
          {form.hero_bg && (
            <div className="mt-2">
              <img src={form.hero_bg} alt="Hero bg" className="h-20 w-full object-cover rounded-lg border border-gray-200" />
            </div>
          )}
          <F label="Hero Title">
            <textarea rows={3} value={form.hero_title} onChange={setField('hero_title')} className={input} placeholder="Elevate Your Home..." />
          </F>
          <F label="Hero Subtitle">
            <textarea rows={3} value={form.hero_subtitle} onChange={setField('hero_subtitle')} className={input} placeholder="A furniture e-commerce company..." />
          </F>
          <F label="CTA Button Text">
            <input value={form.cta_text} onChange={setField('cta_text')} className={input} placeholder="Buy Now" />
          </F>
          <F label="CTA Button Link">
            <input value={form.cta_link} onChange={setField('cta_link')} className={input} placeholder="/products" />
          </F>
        </Card>

        {/* Features Banner */}
        <Card title="Features Banner">
          <p className="text-sm text-gray-500 mb-4">This section appears just below the Hero. Leave fields empty if you don't want to show a feature.</p>
          
          <div className="space-y-4 border-b border-gray-100 pb-4">
            <h3 className="font-semibold text-gray-700">Feature 1</h3>
            <F label="Title"><input value={form.feature_1_title} onChange={setField('feature_1_title')} className={input} placeholder="e.g. Fast Shipping" /></F>
            <F label="Description"><input value={form.feature_1_desc} onChange={setField('feature_1_desc')} className={input} placeholder="e.g. Deliveries worldwide" /></F>
          </div>

          <div className="space-y-4 border-b border-gray-100 pb-4 pt-2">
            <h3 className="font-semibold text-gray-700">Feature 2</h3>
            <F label="Title"><input value={form.feature_2_title} onChange={setField('feature_2_title')} className={input} placeholder="e.g. Secure Payment" /></F>
            <F label="Description"><input value={form.feature_2_desc} onChange={setField('feature_2_desc')} className={input} placeholder="e.g. 100% secure checkout" /></F>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="font-semibold text-gray-700">Feature 3</h3>
            <F label="Title"><input value={form.feature_3_title} onChange={setField('feature_3_title')} className={input} placeholder="e.g. Premium Quality" /></F>
            <F label="Description"><input value={form.feature_3_desc} onChange={setField('feature_3_desc')} className={input} placeholder="e.g. Best materials guaranteed" /></F>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <button type="submit" disabled={saving} className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 inline-flex items-center gap-2">
            <Save className="h-5 w-5" /> {saving ? 'Saving…' : 'Save Home Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

const Card = ({ title, children }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const F = ({ label, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
    {children}
  </label>
);

export default AdminHomeSettings;
