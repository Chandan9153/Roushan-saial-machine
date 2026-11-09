import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError(''); setSubmitting(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/orders');
    } catch (err) { setError(err.response?.data?.message || 'Login failed. Please try again.'); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="card p-6">
        <h1 className="text-xl font-bold">Log in</h1>
        <form onSubmit={submit} className="mt-4 space-y-4">
          <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" /></div>
          <div><label className="label" htmlFor="password">Password</label><input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input" /></div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full">{submitting ? 'Logging in…' : 'Log in'}</button>
        </form>
        <p className="mt-4 text-sm text-slate-600">No account yet? <Link to="/register" className="font-semibold text-brand-600">Register</Link></p>
      </div>
    </div>
  );
}
