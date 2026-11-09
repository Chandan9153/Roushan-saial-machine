import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, categoryApi, formatPrice, productApi } from '../api';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [tab, setTab] = useState('overview');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState({ name: '', description: '', category: '', price: '', discountPrice: '', stock: '0', isSamplePrice: false });
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [catForm, setCatForm] = useState({ name: '', slug: '', description: '' });

  function loadAll() {
    adminApi.dashboard().then((r) => setStats(r.data.data)).catch(() => setError('Could not load the dashboard.'));
    adminApi.orders().then((r) => setOrders(r.data.data)).catch(() => {});
    productApi.list({ limit: 50 }).then((r) => setProducts(r.data.data)).catch(() => {});
    categoryApi.list().then((r) => setCategories(r.data.data)).catch(() => {});
    adminApi.customers().then((r) => setCustomers(r.data.data)).catch(() => {});
  }
  useEffect(loadAll, []);

  if (!user) return <div className="mx-auto max-w-7xl px-4 py-8"><p>Please log in.</p><Link to="/login" className="btn-primary mt-4">Log in</Link></div>;
  if (user.role !== 'admin') return <div className="mx-auto max-w-7xl px-4 py-8"><h1 className="text-2xl font-bold">Admin Dashboard</h1><p className="mt-3 text-sm text-red-600">Admin access required. This account is a customer account.</p></div>;

  async function saveProduct(e) {
    e.preventDefault(); setError(''); setNotice('');
    const fd = new FormData();
    fd.append('name', form.name); fd.append('description', form.description); fd.append('category', form.category);
    if (form.price !== '') fd.append('price', form.price);
    if (form.discountPrice !== '') fd.append('discountPrice', form.discountPrice);
    fd.append('stock', form.stock); fd.append('isSamplePrice', String(form.isSamplePrice));
    if (image) fd.append('images', image);
    try {
      if (editingId) await productApi.update(editingId, fd); else await productApi.create(fd);
      setNotice(editingId ? 'Product updated.' : 'Product added.');
      setForm({ name: '', description: '', category: '', price: '', discountPrice: '', stock: '0', isSamplePrice: false });
      setImage(null); setEditingId(null); loadAll();
    } catch (err) { setError(err.response?.data?.message || 'Could not save the product.'); }
  }

  function editProduct(p) {
    setEditingId(p._id);
    setForm({ name: p.name, description: p.description, category: p.category?._id || p.category, price: p.price ?? '', discountPrice: p.discountPrice ?? '', stock: String(p.stock ?? 0), isSamplePrice: !!p.isSamplePrice });
    setTab('products');
    window.scrollTo({ top: 0 });
  }

  async function deleteProduct(id, name) {
    if (!window.confirm(`Delete ${name}?`)) return;
    try { await productApi.remove(id); setNotice('Product deleted.'); loadAll(); } catch (err) { setError(err.response?.data?.message || 'Could not delete the product.'); }
  }

  async function saveCategory(e) {
    e.preventDefault(); setError(''); setNotice('');
    try { await categoryApi.create(catForm); setNotice('Category added.'); setCatForm({ name: '', slug: '', description: '' }); loadAll(); }
    catch (err) { setError(err.response?.data?.message || 'Could not save the category.'); }
  }

  async function deleteCategory(id, name) {
    if (!window.confirm(`Delete category ${name}? Products in it must be moved first.`)) return;
    try { await categoryApi.remove(id); setNotice('Category deleted.'); loadAll(); } catch (err) { setError(err.response?.data?.message || 'Could not delete the category.'); }
  }

  async function changeStatus(id, status) {
    try { await adminApi.updateOrderStatus(id, status); setNotice('Order status updated.'); loadAll(); } catch (err) { setError(err.response?.data?.message || 'Could not update the order status.'); }
  }

  const tabs = [['overview', 'Overview'], ['orders', 'Orders'], ['products', 'Products'], ['categories', 'Categories'], ['customers', 'Customers']];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Welcome, {user.name}. Manage products, categories, orders and customers.</p>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {notice && <p className="mt-4 text-sm text-green-700">{notice}</p>}
      <div className="mt-5 flex flex-wrap gap-2">{tabs.map(([key, label]) => <button key={key} onClick={() => setTab(key)} className={tab === key ? 'btn-primary !px-3 !py-1.5' : 'btn-outline !px-3 !py-1.5'}>{label}</button>)}</div>

      {tab === 'overview' && stats && (
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[['Total orders', stats.totalOrders], ['Total products', stats.totalProducts], ['Total customers', stats.totalCustomers], ['Revenue (non-cancelled)', formatPrice(stats.revenue)]].map(([label, value]) => (
            <div key={label} className="card p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>
          ))}
        </div>
      )}
      {tab === 'overview' && stats && (
        <div className="card mt-6 p-5"><h2 className="font-semibold">Recent orders</h2><ul className="mt-3 space-y-2 text-sm">{stats.recentOrders.map((o) => <li key={o._id} className="flex justify-between gap-2"><span>{o.user?.name || 'Customer'} · {o.orderStatus}</span><span className="font-semibold">{formatPrice(o.totalAmount)}</span></li>)}</ul></div>
      )}

      {tab === 'orders' && (
        <div className="mt-6 space-y-3">{orders.map((o) => (
          <div key={o._id} className="card p-5">
            <div className="flex flex-wrap justify-between gap-2"><p className="font-semibold">{o.user?.name} · {o.user?.phone}</p><span className="text-sm font-semibold">{formatPrice(o.totalAmount)}</span></div>
            <p className="mt-1 text-sm text-slate-500">{new Date(o.createdAt).toLocaleString('en-IN')} · {o.paymentMethod} · {o.shippingAddress.city} {o.shippingAddress.pinCode}</p>
            <ul className="mt-2 text-sm">{o.products?.map((p, i) => <li key={i}>{p.name} x {p.quantity}</li>)}</ul>
            <label className="mt-3 block text-sm font-medium">Order status
              <select value={o.orderStatus} onChange={(e) => changeStatus(o._id, e.target.value)} className="input mt-1 max-w-xs">{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
            </label>
          </div>
        ))}{orders.length === 0 && <p className="text-sm text-slate-500">No orders yet.</p>}</div>
      )}

      {tab === 'products' && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <form onSubmit={saveProduct} className="card h-fit space-y-4 p-5">
            <h2 className="font-semibold">{editingId ? 'Edit product' : 'Add product'}</h2>
            <div><label className="label" htmlFor="p-name">Name</label><input id="p-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" /></div>
            <div><label className="label" htmlFor="p-desc">Description</label><textarea id="p-desc" required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" /></div>
            <div><label className="label" htmlFor="p-cat">Category</label><select id="p-cat" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input"><option value="">Select a category</option>{categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label" htmlFor="p-price">Price (₹) — leave blank for Price on enquiry</label><input id="p-price" type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input" /></div>
              <div><label className="label" htmlFor="p-discount">Discount price (₹)</label><input id="p-discount" type="number" min="0" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input" /></div>
            </div>
            <div><label className="label" htmlFor="p-stock">Stock</label><input id="p-stock" type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input" /></div>
            <div><label className="label" htmlFor="p-image">Product photo (JPG/PNG/WebP/GIF, max 5 MB)</label><input id="p-image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => setImage(e.target.files?.[0] || null)} className="input" /></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isSamplePrice} onChange={(e) => setForm({ ...form, isSamplePrice: e.target.checked })} /> Sample price — assumed, please confirm in shop</label>
            <button type="submit" className="btn-primary">{editingId ? 'Update product' : 'Add product'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '', category: '', price: '', discountPrice: '', stock: '0', isSamplePrice: false }); }} className="btn-outline ml-2">Cancel edit</button>}
          </form>
          <div className="space-y-3">{products.map((p) => (
            <div key={p._id} className="card flex items-center justify-between gap-3 p-4">
              <div><p className="font-semibold">{p.name}</p><p className="text-sm text-slate-500">{p.category?.name} · {formatPrice(p.price)}{p.isSamplePrice ? ' (sample)' : ''} · Stock {p.stock}</p></div>
              <div className="flex gap-2"><button onClick={() => editProduct(p)} className="btn-outline !px-3 !py-1.5">Edit</button><button onClick={() => deleteProduct(p._id, p.name)} className="btn-outline !px-3 !py-1.5 !text-red-600">Delete</button></div>
            </div>
          ))}</div>
        </div>
      )}

      {tab === 'categories' && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <form onSubmit={saveCategory} className="card h-fit space-y-4 p-5">
            <h2 className="font-semibold">Add category</h2>
            <div><label className="label" htmlFor="c-name">Name</label><input id="c-name" required value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} className="input" /></div>
            <div><label className="label" htmlFor="c-slug">Slug (lowercase, e.g. sewing-machines)</label><input id="c-slug" required value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} className="input" /></div>
            <div><label className="label" htmlFor="c-desc">Description</label><input id="c-desc" value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} className="input" /></div>
            <button type="submit" className="btn-primary">Add category</button>
          </form>
          <div className="space-y-3">{categories.map((c) => (
            <div key={c._id} className="card flex items-center justify-between gap-3 p-4">
              <div><p className="font-semibold">{c.name}</p><p className="text-sm text-slate-500">{c.slug} · {c.productCount} product{c.productCount === 1 ? '' : 's'}</p></div>
              <button onClick={() => deleteCategory(c._id, c.name)} className="btn-outline !px-3 !py-1.5 !text-red-600">Delete</button>
            </div>
          ))}</div>
        </div>
      )}

      {tab === 'customers' && (
        <div className="card mt-6 divide-y divide-slate-100">{customers.map((c) => <div key={c._id} className="flex justify-between gap-2 p-4 text-sm"><span className="font-semibold">{c.name}</span><span>{c.email}</span><span>{c.phone}</span></div>)}{customers.length === 0 && <p className="p-4 text-sm text-slate-500">No customers yet.</p>}</div>
      )}
    </div>
  );
}
