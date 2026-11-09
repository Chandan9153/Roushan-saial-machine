import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categoryApi, productApi } from '../api';
import EmptyState from '../components/EmptyState';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const category = params.get('category') || '';
  const search = params.get('search') || '';
  const sort = params.get('sort') || 'newest';
  const minPrice = params.get('minPrice') || '';
  const maxPrice = params.get('maxPrice') || '';
  const page = Number(params.get('page')) || 1;

  useEffect(() => { categoryApi.list().then((res) => setCategories(res.data.data)).catch(() => {}); }, []);
  useEffect(() => {
    setLoading(true);
    productApi.list({ category: category || undefined, search: search || undefined, sort, minPrice: minPrice || undefined, maxPrice: maxPrice || undefined, page, limit: 12 })
      .then((res) => { setProducts(res.data.data); setPagination(res.data.pagination); setError(''); })
      .catch(() => setError('Could not load products. Please check that the backend is running and try again.'))
      .finally(() => setLoading(false));
  }, [category, search, sort, minPrice, maxPrice, page]);

  function update(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    next.set('page', '1');
    setParams(next);
  }

  const selectedCategory = categories.find((c) => c._id === category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold">Shop all products</h1>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <select value={category} onChange={(e) => update('category', e.target.value)} className="input" aria-label="Category">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name} ({c.productCount})</option>)}
        </select>
        <input value={search} onChange={(e) => update('search', e.target.value)} placeholder="Search products…" className="input" />
        <select value={sort} onChange={(e) => update('sort', e.target.value)} className="input" aria-label="Sort">
          <option value="newest">Newest first</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name A–Z</option>
        </select>
        <div className="flex gap-2">
          <input type="number" min="0" value={minPrice} onChange={(e) => update('minPrice', e.target.value)} placeholder="Min ₹" className="input" aria-label="Minimum price" />
          <input type="number" min="0" value={maxPrice} onChange={(e) => update('maxPrice', e.target.value)} placeholder="Max ₹" className="input" aria-label="Maximum price" />
        </div>
      </div>

      {selectedCategory && selectedCategory.productCount === 0 && (
        <div className="mt-6"><EmptyState title={`No products in ${selectedCategory.name} yet`} message="This category is empty for now. Please ask in the shop or on WhatsApp — no products have been invented for it." /></div>
      )}
      {loading && <p className="mt-6 text-sm text-slate-500">Loading products…</p>}
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
      {!loading && !error && products.length === 0 && !selectedCategory?.productCount && (
        <div className="mt-6"><EmptyState title="No products found" message="Try a different search, category, or price range." /></div>
      )}
      <p className="mt-4 text-sm text-slate-500">{pagination.total} product{pagination.total === 1 ? '' : 's'} found</p>
      <div className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-4">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div>
      {pagination.pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => { const next = new URLSearchParams(params); next.set('page', String(p)); setParams(next); }} className={p === page ? 'btn-primary !px-3 !py-1.5' : 'btn-outline !px-3 !py-1.5'}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
