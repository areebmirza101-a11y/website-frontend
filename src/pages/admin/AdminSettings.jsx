import { useEffect, useState } from 'react';
import { Save, Upload, Plus, Trash2 } from 'lucide-react';
import { settingsApi, authApi } from '../../api';
import { useAdminTitle } from '../../components/admin/useAdminTitle';
import Seo from '../../components/Seo';

const AdminSettings = () => {
  const [form, setForm] = useState({
    company_name: '',
    app_logo: '',
    app_logo_file: null,
    app_favicon: '',
    app_favicon_file: null,
    tagline: '',
    intro: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    business_hours: '',
    map_embed: '',
    facebook: '',
    linkedin: '',
    instagram: '',
    youtube: '',
    brochure_url: '',
    social_links: [],
  });
  const [pwdForm, setPwdForm] = useState({ current_password: '', new_password: '' });
  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pwdSaved, setPwdSaved] = useState(false);
  const [error, setError] = useState(null);
  const [pwdError, setPwdError] = useState(null);

  useAdminTitle('Settings');

  useEffect(() => {
    settingsApi
      .get()
      .then((s) => {
        setForm((f) => ({
          ...f,
          company_name: s.company_name || '',
          app_logo: s.app_logo || '',
          app_logo_file: null,
          app_favicon: s.app_favicon || '',
          app_favicon_file: null,
          tagline: s.tagline || '',
          intro: s.intro || '',
          phone: s.phone || '',
          whatsapp: s.whatsapp || '',
          email: s.email || '',
          address: s.address || '',
          business_hours: s.business_hours || '',
          map_embed: s.map_embed || '',
          facebook: s.facebook || '',
          linkedin: s.linkedin || '',
          instagram: s.instagram || '',
          youtube: s.youtube || '',
          brochure_url: s.brochure_url || '',
          social_links: typeof s.social_links === 'string' ? JSON.parse(s.social_links) : (s.social_links || []),
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
        if (key === 'social_links') {
          fd.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          if (value.size > 0) fd.append(key, value);
        } else if (value !== null && value !== undefined) {
          fd.append(key, value);
        }
      });
      const updated = await settingsApi.update(fd);
      setForm((f) => ({
        ...f,
        app_logo: updated.app_logo || '',
        app_favicon: updated.app_favicon || '',
        app_logo_file: null,
        app_favicon_file: null,
      }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const submitPwd = async (e) => {
    e.preventDefault();
    setSavingPwd(true);
    setPwdError(null);
    setPwdSaved(false);
    try {
      await authApi.changePassword(pwdForm.current_password, pwdForm.new_password);
      setPwdForm({ current_password: '', new_password: '' });
      setPwdSaved(true);
      setTimeout(() => setPwdSaved(false), 3000);
    } catch (err) {
      setPwdError(err.message || 'Failed to change password');
    } finally {
      setSavingPwd(false);
    }
  };

  const input = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-gray-900 focus:border-gray-900 outline-none transition-colors';

  return (
    <div className="max-w-6xl">
      <Seo title="Admin — Settings" />

      {saved && <div className="mb-6 p-3 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-sm">Settings saved successfully.</div>}
      {error && <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
      {pwdSaved && <div className="mb-6 p-3 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-sm">Password changed successfully.</div>}
      {pwdError && <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{pwdError}</div>}

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-2">
        {/* Company Information */}
        <Card title="Company Information">
          <F label="Company Name"><input value={form.company_name} onChange={setField('company_name')} className={input} /></F>
          <F label="App Logo URL"><input value={form.app_logo} onChange={setField('app_logo')} className={input} placeholder="https://..." /></F>
          <F label="Upload App Logo / Icon">
            <input type="file" onChange={setFile('app_logo_file')} className={input} accept="image/*" />
          </F>
          {form.app_logo && (
            <div className="mt-2">
              <img src={form.app_logo} alt="App logo" className="h-16 w-auto object-contain rounded border border-gray-200 p-2 bg-gray-50" />
            </div>
          )}
          <F label="App Favicon URL"><input value={form.app_favicon} onChange={setField('app_favicon')} className={input} placeholder="https://..." /></F>
          <F label="Upload App Favicon (.ico, .png, etc.)">
            <input type="file" onChange={setFile('app_favicon_file')} className={input} accept="image/*" />
          </F>
          {form.app_favicon && (
            <div className="mt-2">
              <img src={form.app_favicon} alt="App favicon" className="h-10 w-10 object-contain rounded border border-gray-200 p-2 bg-gray-50" />
            </div>
          )}
          <F label="Tagline"><input value={form.tagline} onChange={setField('tagline')} className={input} /></F>
          <F label="Intro / About"><textarea rows={3} value={form.intro} onChange={setField('intro')} className={input} /></F>
        </Card>

        {/* Contact Details */}
        <Card title="Contact Details">
          <F label="Phone"><input value={form.phone} onChange={setField('phone')} className={input} /></F>
          <F label="WhatsApp (with country code)"><input value={form.whatsapp} onChange={setField('whatsapp')} className={input} placeholder="+92…" /></F>
          <F label="Email"><input value={form.email} onChange={setField('email')} className={input} /></F>
          <F label="Address"><textarea rows={2} value={form.address} onChange={setField('address')} className={input} /></F>
          <F label="Business Hours"><input value={form.business_hours} onChange={setField('business_hours')} className={input} /></F>
        </Card>

        {/* Social Media */}
        <Card title="Social Media (Dynamic Links)">
          <div className="space-y-4">
            {form.social_links.map((link, idx) => (
              <div key={idx} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Platform / Label (e.g. Instagram, FB)</label>
                    <input 
                      value={link.label} 
                      onChange={e => {
                        const newLinks = [...form.social_links];
                        newLinks[idx].label = e.target.value;
                        setForm({...form, social_links: newLinks});
                      }} 
                      className={input} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">URL</label>
                    <input 
                      value={link.url} 
                      onChange={e => {
                        const newLinks = [...form.social_links];
                        newLinks[idx].url = e.target.value;
                        setForm({...form, social_links: newLinks});
                      }} 
                      className={input} 
                    />
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => {
                    const newLinks = form.social_links.filter((_, i) => i !== idx);
                    setForm({...form, social_links: newLinks});
                  }}
                  className="mt-6 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
            
            <button 
              type="button" 
              onClick={() => setForm({...form, social_links: [...form.social_links, { label: '', url: '' }]})}
              className="inline-flex items-center gap-2 text-[#BA9B74] font-medium hover:text-[#997F64] transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Social Link
            </button>
          </div>
        </Card>

        {/* Other */}
        <Card title="Other">
          <F label="Google Maps Embed URL"><input value={form.map_embed} onChange={setField('map_embed')} className={input} /></F>
          <F label="Brochure Download URL"><input value={form.brochure_url} onChange={setField('brochure_url')} className={input} /></F>
        </Card>



        {/* Change Password */}
        <Card title="Change Password">
          <F label="Current Password">
            <input type="password" value={pwdForm.current_password} onChange={(e) => setPwdForm((f) => ({ ...f, current_password: e.target.value }))} className={input} />
          </F>
          <F label="New Password">
            <input type="password" value={pwdForm.new_password} onChange={(e) => setPwdForm((f) => ({ ...f, new_password: e.target.value }))} className={input} />
          </F>
        </Card>

        <div>
          <button type="submit" disabled={saving} className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 inline-flex items-center gap-2">
            <Save className="h-5 w-5" /> {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>

        <div>
          <button type="button" onClick={submitPwd} disabled={savingPwd} className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 inline-flex items-center gap-2">
            <Upload className="h-5 w-5" /> {savingPwd ? 'Changing…' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

const Card = ({ title, children }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
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

export default AdminSettings;
