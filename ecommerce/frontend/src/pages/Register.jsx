import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  function set(key, value) { setForm((f) => ({ ...f, [key]: value })); }

  async function submit(e) {
    e.preventDefault();
    setError(''); setSubmitting(true);
    try { await register(form); navigate('/orders'); }
    catch (err) { setError(err.response?.data?.message || 'Registration failed. Please try again.'); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="card p-6">
        <h1 className="text-xl font-bold">Create an account</h1>
        <form onSubmit={submit} className="mt-4 space-y-4">
          <div><label className="label" htmlFor="name">Full name</label><input id="name" required value={form.name} onChange={(e) => set('name', e.target.value)} className="input" /></div>
          <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} className="input" /></div>
          <div><label className="label" htmlFor="phone">Mobile number (10 digits)</label><input id="phone" required pattern="[6-9][0-9]{9}" value={form.phone} onChange={(e) => set('phone', e.target.value)} className="input" /></div>
          <div><label className="label" htmlFor="password">Password (at least 6 characters)</label><input id="password" type="password" required minLength={6} value={form.password} onChange={(e) => set('password', e.target.value)} className="input" /></div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full">{submitting ? 'Creating account…' : 'Register'}</button>
        </form>
        <p className="mt-4 text-sm text-slate-600">Already have an account? <Link to="/login" className="font-semibold text-brand-600">Log in</Link></p>
      </div>
    </div>
  );
}
