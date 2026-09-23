import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const { login, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  // Already logged in as admin → skip
  useEffect(() => {
    if (user && isAdmin) navigate('/admin', { replace: true });
  }, [user, isAdmin, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const u = await login(form.email, form.password);
      if (u.role !== 'admin') {
        setError('This account does not have admin access.');
        return;
      }
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  const input = 'w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white focus:ring-white focus:border-white outline-none transition-colors';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-bold text-2xl tracking-[0.2em] text-white">Velmoras</span>
          <p className="text-gray-500 text-sm mt-2 uppercase tracking-wider">Admin Panel</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-800 p-8 rounded-3xl">
          {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">{error}</div>}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={input} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input type="password" required value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className={input} />
            </div>
            <button type="submit" disabled={busy} className="w-full bg-white text-gray-900 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors disabled:opacity-60">
              {busy ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
