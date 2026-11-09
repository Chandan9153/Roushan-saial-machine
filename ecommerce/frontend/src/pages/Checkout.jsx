import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice, orderApi } from '../api';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', street: '', city: 'Itkhori', state: 'Jharkhand', pinCode: '825408', paymentMethod: 'COD' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(null);

  function set(key, value) { setForm((f) => ({ ...f, [key]: value })); }

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!user) { navigate('/login'); return; }
    setSubmitting(true);
    try {
      const res = await orderApi.create({
        products: items.map((i) => ({ product: i.product, quantity: i.quantity })),
        shippingAddress: { name: form.name, phone: form.phone, street: form.street, city: form.city, state: form.state, pinCode: form.pinCode },
        paymentMethod: form.paymentMethod,
      });
      const order = res.data.data;
      clearCart();
      setPlaced({ order, whatsappUrl: res.data.whatsappUrl });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place the order. Please try again.');
    } finally { setSubmitting(false); }
  }

  if (placed) return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="card p-6 text-center">
        <h1 className="text-2xl font-bold">Order placed — thank you!</h1>
        <p className="mt-2 text-sm text-slate-600">Order ID: {placed.order._id} · Status: {placed.order.orderStatus} · Total: {formatPrice(placed.order.totalAmount)}</p>
        <p className="mt-2 text-sm text-slate-600">The shop will confirm your order. For Price-on-enquiry items, the shop confirms the price before delivery.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a href={placed.whatsappUrl} target="_blank" rel="noreferrer" className="btn-accent">Confirm order on WhatsApp</a>
          <Link to="/orders" className="btn-outline">View my orders</Link>
        </div>
      </div>
    </div>
  );

  if (items.length === 0) return <div className="mx-auto max-w-7xl px-4 py-8"><EmptyState title="Nothing to check out" message="Your cart is empty." /><Link to="/shop" className="btn-primary mt-6">Browse products</Link></div>;
  if (!user) return <div className="mx-auto max-w-7xl px-4 py-8"><h1 className="text-2xl font-bold">Checkout</h1><p className="mt-3 text-sm text-slate-600">Please log in to place an order.</p><Link to="/login" className="btn-primary mt-4">Log in</Link></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <form onSubmit={submit} className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="card p-5">
            <h2 className="font-semibold">Delivery details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><label className="label" htmlFor="name">Full name</label><input id="name" required value={form.name} onChange={(e) => set('name', e.target.value)} className="input" /></div>
              <div><label className="label" htmlFor="phone">Mobile number</label><input id="phone" required pattern="[6-9][0-9]{9}" value={form.phone} onChange={(e) => set('phone', e.target.value)} className="input" /></div>
              <div className="sm:col-span-2"><label className="label" htmlFor="street">Full address</label><input id="street" required value={form.street} onChange={(e) => set('street', e.target.value)} className="input" /></div>
              <div><label className="label" htmlFor="city">City</label><input id="city" required value={form.city} onChange={(e) => set('city', e.target.value)} className="input" /></div>
              <div><label className="label" htmlFor="pinCode">PIN code</label><input id="pinCode" required pattern="[0-9]{6}" value={form.pinCode} onChange={(e) => set('pinCode', e.target.value)} className="input" /></div>
            </div>
          </div>
          <div className="card p-5">
            <h2 className="font-semibold">Payment method</h2>
            <label className="mt-3 flex items-center gap-2 text-sm"><input type="radio" name="payment" checked={form.paymentMethod === 'COD'} onChange={() => set('paymentMethod', 'COD')} /> Cash on Delivery (COD)</label>
            <label className="mt-2 flex items-center gap-2 text-sm"><input type="radio" name="payment" checked={form.paymentMethod === 'WhatsApp'} onChange={() => set('paymentMethod', 'WhatsApp')} /> WhatsApp order confirmation (pay as the shop confirms)</label>
            <p className="mt-3 text-xs text-slate-500">No payment card information is collected or stored on this website.</p>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <div className="card h-fit p-5">
          <h2 className="font-semibold">Order summary</h2>
          <ul className="mt-3 space-y-2 text-sm">{items.map((i) => <li key={i.product} className="flex justify-between"><span>{i.name} x {i.quantity}</span><span>{formatPrice((i.price || 0) * i.quantity)}</span></li>)}</ul>
          <p className="mt-3 flex justify-between border-t border-slate-200 pt-3 font-bold"><span>Total</span><span>{formatPrice(subtotal)}</span></p>
          <button type="submit" disabled={submitting} className="btn-primary mt-4 w-full">{submitting ? 'Placing order…' : 'Place order'}</button>
        </div>
      </form>
    </div>
  );
}
