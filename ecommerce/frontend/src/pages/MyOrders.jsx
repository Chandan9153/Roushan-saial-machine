import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, orderApi } from '../api';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.myOrders()
      .then((res) => setOrders(res.data.data))
      .catch(() => setError('Could not load your orders. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  if (!user) return <div className="mx-auto max-w-7xl px-4 py-8"><h1 className="text-2xl font-bold">My Orders</h1><p className="mt-3 text-sm">Please log in to see your orders.</p><Link to="/login" className="btn-primary mt-4">Log in</Link></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold">My Orders</h1>
      {loading && <p className="mt-4 text-sm text-slate-500">Loading orders…</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {!loading && !error && orders.length === 0 && <div className="mt-6"><EmptyState title="No orders yet" message="Orders you place will appear here with their status." /></div>}
      <div className="mt-6 space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="card p-5">
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-semibold">Order {o._id}</p>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{o.orderStatus}</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{new Date(o.createdAt).toLocaleString('en-IN')} · {o.paymentMethod === 'COD' ? 'Cash on Delivery' : 'WhatsApp'}</p>
            <ul className="mt-3 space-y-1 text-sm">{o.products.map((p, i) => <li key={i} className="flex justify-between"><span>{p.name} x {p.quantity}</span><span>{formatPrice(p.price)}</span></li>)}</ul>
            <p className="mt-3 flex justify-between border-t border-slate-200 pt-3 font-bold"><span>Total</span><span>{formatPrice(o.totalAmount)}</span></p>
            <p className="mt-1 text-sm text-slate-500">Deliver to: {o.shippingAddress.street}, {o.shippingAddress.city} {o.shippingAddress.pinCode}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
