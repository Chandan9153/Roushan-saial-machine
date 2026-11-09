import { MessageCircle, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice, imageUrl, whatsappUrl } from '../api';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const img = product.images?.[0] ? imageUrl(product.images[0]) : '';
  return (
    <article className="card flex flex-col overflow-hidden transition hover:shadow-md">
      <Link to={`/product/${product._id}`} className="block aspect-[4/3] bg-slate-100">
        {img ? <img src={img} alt={product.name} loading="lazy" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-400">No photo yet — ask in the shop</div>}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-600">{product.category?.name || ''}</p>
        <Link to={`/product/${product._id}`} className="font-semibold leading-snug hover:text-brand-700">{product.name}</Link>
        <p className="text-lg font-bold">{formatPrice(product.price)}</p>
        {product.isSamplePrice && <p className="text-xs text-amber-700">Sample price — assumed, please confirm in shop</p>}
        {product.price == null && <p className="text-xs text-slate-500">Price confirmed in shop / on WhatsApp</p>}
        <div className="mt-auto flex gap-2 pt-2">
          <button onClick={() => addToCart(product)} className="btn-primary flex-1 !px-2"><ShoppingCart size={16} /> Add to cart</button>
          <a href={whatsappUrl(`Namaste, I want to enquire about ${product.name} — ${formatPrice(product.price)}. Please confirm the price and availability.`)} target="_blank" rel="noreferrer" className="btn-outline !px-3" aria-label="Enquire on WhatsApp"><MessageCircle size={16} /></a>
        </div>
      </div>
    </article>
  );
}
