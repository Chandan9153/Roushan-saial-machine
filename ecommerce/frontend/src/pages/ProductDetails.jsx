import { MessageCircle, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatPrice, imageUrl, productApi, whatsappUrl } from '../api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setError(''); setProduct(null);
    Promise.all([productApi.get(id), productApi.related(id)])
      .then(([p, r]) => { setProduct(p.data.data); setRelated(r.data.data); })
      .catch(() => setError('Product not found or the backend is not running.'));
  }, [id]);

  if (error) return <div className="mx-auto max-w-7xl px-4 py-8"><p className="text-red-600">{error}</p><Link to="/shop" className="btn-outline mt-4">Back to shop</Link></div>;
  if (!product) return <div className="mx-auto max-w-7xl px-4 py-8"><p className="text-sm text-slate-500">Loading product…</p></div>;

  const img = product.images?.[0] ? imageUrl(product.images[0]) : '';
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link to="/shop" className="text-sm font-semibold text-brand-600">← Back to shop</Link>
      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <div className="card flex aspect-[4/3] items-center justify-center overflow-hidden bg-slate-100">
          {img ? <img src={img} alt={product.name} className="h-full w-full object-cover" /> : <p className="px-4 text-center text-sm text-slate-400">No photo yet — ask in the shop</p>}
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-brand-600">{product.category?.name || ''}</p>
          <h1 className="mt-1 text-2xl font-bold">{product.name}</h1>
          <p className="mt-2 text-2xl font-bold">{formatPrice(product.price)}</p>
          {product.discountPrice != null && product.price != null && <p className="text-sm text-slate-500">Discount price: {formatPrice(product.discountPrice)} (was {formatPrice(product.price)})</p>}
          {product.isSamplePrice && <p className="mt-1 text-sm text-amber-700">Sample price — assumed, please confirm in shop.</p>}
          {product.price == null && <p className="mt-1 text-sm text-slate-600">Price on enquiry — the shop will confirm the price on WhatsApp or in person.</p>}
          <p className="mt-3 text-slate-600">{product.description}</p>
          {product.specifications?.length > 0 && (
            <table className="mt-4 w-full text-sm"><tbody>{product.specifications.map((s) => <tr key={s.key} className="border-t border-slate-100"><td className="py-2 pr-4 font-medium">{s.key}</td><td className="py-2">{s.value}</td></tr>)}</tbody></table>
          )}
          <p className="mt-3 text-sm text-slate-500">Availability: {product.stock > 0 ? `In stock (${product.stock})` : 'Please confirm availability in the shop — stock is not tracked online yet.'}</p>
          <div className="mt-5 flex items-center gap-3">
            <span className="text-sm font-medium">Quantity</span>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="btn-outline !px-2 !py-1.5" aria-label="Decrease quantity"><Minus size={16} /></button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="btn-outline !px-2 !py-1.5" aria-label="Increase quantity"><Plus size={16} /></button>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={() => { addToCart(product, quantity); setAdded(true); }} className="btn-primary"><ShoppingCart size={16} /> Add to cart</button>
            <a href={whatsappUrl(`Namaste, I want to enquire about ${product.name} x ${quantity} — ${formatPrice(product.price)}. Please confirm the price and availability.`)} target="_blank" rel="noreferrer" className="btn-accent"><MessageCircle size={16} /> Enquire on WhatsApp</a>
          </div>
          {added && <p className="mt-3 text-sm font-medium text-green-700">Added to cart. <Link to="/cart" className="underline">View cart →</Link></p>}
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-12"><h2 className="text-xl font-bold">Related products</h2><div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">{related.map((p) => <ProductCard key={p._id} product={p} />)}</div></section>
      )}
    </div>
  );
}
