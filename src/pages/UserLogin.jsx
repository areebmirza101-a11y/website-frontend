import { useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserLogin = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const user =
        mode === 'login'
          ? await login(form.email, form.password)
          : await register(form.name, form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  const input = 'w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-accent focus:border-accent outline-none transition-colors';

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-ink mb-2 text-center">
          {mode === 'login' ? 'Welcome back' : 'Create an account'}
        </h1>
        <p className="text-muted text-sm text-center mb-8">
          {mode === 'login' ? 'Sign in to continue' : 'Join Velmoras to track your orders'}
        </p>

        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

        <form onSubmit={submit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input required disabled={busy} value={form.name} onChange={set('name')} className={input} />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required disabled={busy} value={form.email} onChange={set('email')} className={input} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required disabled={busy} value={form.password} onChange={set('password')} className={input} />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-accent text-accent-foreground py-3.5 rounded-xl font-semibold hover:bg-accent-hover transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-[0.99]"
          >
            {busy ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                <span>Please wait…</span>
              </>
            ) : (
              <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            )}
          </button>
        </form>

        <p className="text-sm text-muted text-center mt-6">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }} className="text-accent font-medium underline hover:text-accent-hover transition-colors">
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>
        <p className="text-xs text-gray-400 text-center mt-4">
          <Link to="/" className="group inline-flex items-center gap-1.5 hover:text-accent transition-colors"><ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to store</Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
