import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../api';
import EmptyState from '../components/EmptyState';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();
  if (items.length === 0) return <div className="mx-auto max-w-7xl px-4 py-8"><h1 className="text-2xl font-bold">Your cart</h1><div className="mt-6"><EmptyState title="Your cart is empty" message="Browse the shop and add products you like." /></div><Link to="/shop" className="btn-primary mt-6">Browse products</Link></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold">Your cart</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {items.map((item) => (
            <div key={item.product} className="card flex items-center gap-4 p-4">
              <div className="flex-1"><p className="font-semibold">{item.name}</p><p className="text-sm text-slate-500">{formatPrice(item.price)}</p></div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.product, item.quantity - 1)} className="btn-outline !px-2 !py-1" aria-label="Decrease quantity"><Minus size={14} /></button>
                <span className="w-6 text-center font-semibold">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product, item.quantity + 1)} className="btn-outline !px-2 !py-1" aria-label="Increase quantity"><Plus size={14} /></button>
              </div>
              <p className="w-24 text-right font-bold">{formatPrice((item.price || 0) * item.quantity)}</p>
              <button onClick={() => removeFromCart(item.product)} className="text-red-600 hover:text-red-800" aria-label={`Remove ${item.name}`}><Trash2 size={18} /></button>
            </div>
          ))}
        </div>
        <div className="card h-fit p-5">
          <h2 className="font-semibold">Order summary</h2>
          <p className="mt-3 flex justify-between text-sm"><span>Subtotal</span><span className="font-bold">{formatPrice(subtotal)}</span></p>
          <p className="mt-1 flex justify-between text-sm"><span>Delivery</span><span>Confirmed by shop</span></p>
          <p className="mt-3 flex justify-between border-t border-slate-200 pt-3 font-bold"><span>Total</span><span>{formatPrice(subtotal)}</span></p>
          <p className="mt-2 text-xs text-slate-500">Price-on-enquiry items are charged at 0 here and confirmed by the shop before delivery.</p>
          <Link to="/checkout" className="btn-primary mt-4 w-full">Proceed to checkout</Link>
        </div>
      </div>
    </div>
  );
}
