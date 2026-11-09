import { ArrowRight, MessageCircle, Phone, ShieldCheck, Star, Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SHOP, categoryApi, productApi, whatsappUrl } from '../api';
import EmptyState from '../components/EmptyState';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([productApi.list({ limit: 8 }), categoryApi.list()])
      .then(([p, c]) => { setProducts(p.data.data); setCategories(c.data.data); })
      .catch(() => setError('Could not load products. Please check that the backend is running and try again.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-brand-50">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">Itkhori Chowk · Itkhori · Chatra · Jharkhand</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">{SHOP.hindiName}<span className="mt-1 block text-xl font-semibold text-slate-600">{SHOP.name}</span></h1>
            <p className="mt-3 text-slate-600">Sewing machines, fans, induction cookers, mixers, irons, LED bulbs, wires, holders and switch boards — all items with full guarantee, and repairs with full guarantee.</p>
            <p className="mt-2 flex items-center gap-1 text-sm font-medium"><Star size={16} className="text-yellow-500" /> Google rating {SHOP.googleRating} / 5 · {SHOP.googleReviews} reviews</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary">Shop products <ArrowRight size={16} /></Link>
              <a href={`tel:${SHOP.phone}`} className="btn-outline"><Phone size={16} /> Call Now</a>
              <a href={whatsappUrl('Namaste, mujhe Roushan Sewing Machine & Electronics se kuchh poochhna hai.')} target="_blank" rel="noreferrer" className="btn-accent"><MessageCircle size={16} /> WhatsApp</a>
            </div>
          </div>
          <div className="card p-6">
            <h2 className="font-semibold">Why choose us</h2>
            <ul className="mt-3 space-y-3 text-sm text-slate-600">
              <li className="flex gap-2"><ShieldCheck size={18} className="shrink-0 text-brand-600" /> All items sold with full guarantee.</li>
              <li className="flex gap-2"><Wrench size={18} className="shrink-0 text-brand-600" /> Repairs also done with full guarantee.</li>
              <li className="flex gap-2"><Phone size={18} className="shrink-0 text-brand-600" /> Enquire or order on WhatsApp: {SHOP.phoneDisplay}.</li>
              <li className="flex gap-2"><Star size={18} className="shrink-0 text-brand-600" /> Rated {SHOP.googleRating} / 5 on Google ({SHOP.googleReviews} reviews).</li>
            </ul>
            <p className="mt-4 text-sm text-slate-500">Cash on Delivery available. Prices for some items are confirmed in the shop — ask on WhatsApp before ordering.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10">
        <h2 className="text-xl font-bold">Shop by category</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((c) => (
            <Link key={c._id} to={`/shop?category=${c._id}`} className="card p-4 transition hover:shadow-md">
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-slate-500">{c.productCount} product{c.productCount === 1 ? '' : 's'}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10">
        <div className="flex items-center justify-between"><h2 className="text-xl font-bold">Featured products</h2><Link to="/shop" className="text-sm font-semibold text-brand-600">View all →</Link></div>
        {loading && <p className="mt-4 text-sm text-slate-500">Loading products…</p>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {!loading && !error && products.length === 0 && <div className="mt-4"><EmptyState title="No products yet" message="Products will appear here once the shop adds them." /></div>}
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div>
        <p className="mt-4 text-xs text-slate-500">Prices marked “Sample price” are assumed prices, please confirm in the shop. Items marked “Price on enquiry” are confirmed in the shop or on WhatsApp.</p>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10">
        <div className="card bg-slate-50 p-6">
          <h2 className="text-xl font-bold">Visit the shop</h2>
          <p className="mt-2 text-sm text-slate-600">{SHOP.address}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="https://www.google.com/maps/dir/?api=1&destination=Itkhori%20Chowk%2C%20Itkhori%2C%20Chatra%2C%20Jharkhand%20825408" target="_blank" rel="noreferrer" className="btn-primary">Get directions</a>
            <Link to="/contact" className="btn-outline">Contact us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
