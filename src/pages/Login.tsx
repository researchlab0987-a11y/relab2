import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login, role } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      // Redirect based on role (role will update via AuthContext listener)
      // Small delay to let role resolve
      setTimeout(() => {
        const r = localStorage.getItem('rl_role_hint');
        if (r === 'admin') navigate('/admin');
        else navigate('/collaborator-portal');
      }, 400);
    } catch (err: any) {
      setError(
        err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password'
          ? 'Invalid email or password.'
          : 'Login failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  // If already logged in redirect
  React.useEffect(() => {
    if (role === 'admin') navigate('/admin', { replace: true });
    else if (role === 'collaborator') navigate('/collaborator-portal', { replace: true });
  }, [role]);

  return (
    <div
      className="min-h-[80vh] flex items-center justify-center px-4"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-8 py-7 text-center" style={{ background: 'var(--color-primary)' }}>
          <h1
            className="text-white font-black text-2xl mb-1"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Portal Login
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Rahman Research Lab — Admin & Collaborator Access
          </p>
        </div>

        <form onSubmit={submit} className="px-8 py-8 flex flex-col gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm rounded-xl border outline-none"
              style={{ borderColor: '#d1d5db' }}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm rounded-xl border outline-none"
              style={{ borderColor: '#d1d5db' }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-black py-3 rounded-xl text-white text-sm disabled:opacity-60 mt-1"
            style={{ background: 'var(--color-primary)', border: 'none', cursor: 'pointer' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-xs text-gray-400 mt-2">
            Not a collaborator yet?{' '}
            <a
              href="/collaborators"
              className="font-semibold no-underline hover:underline"
              style={{ color: 'var(--color-secondary)' }}
            >
              Submit a request
            </a>{' '}
            on the Collaborators page.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
