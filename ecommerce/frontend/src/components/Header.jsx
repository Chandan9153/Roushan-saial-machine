import { LogOut, Menu, Phone, Search, ShoppingCart, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { SHOP } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const link = 'text-sm font-medium text-slate-700 hover:text-brand-600';

  function search(e) {
    e.preventDefault();
    navigate(`/shop${query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ''}`);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="bg-brand-700 text-xs text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-1.5">
          <span>{SHOP.hindiName} · {SHOP.address}</span>
          <a href={`tel:${SHOP.phone}`} className="inline-flex items-center gap-1 font-semibold"><Phone size={12} /> {SHOP.phoneDisplay}</a>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
        <Link to="/" className="leading-tight">
          <span className="block text-base font-bold text-brand-700 sm:text-lg">{SHOP.hindiName}</span>
          <span className="block text-[11px] font-medium text-slate-500">{SHOP.name}</span>
        </Link>
        <form onSubmit={search} className="mx-auto hidden w-full max-w-md items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 md:flex">
          <Search size={16} className="text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('search')} className="w-full text-sm outline-none" />
        </form>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')} className="btn-outline !px-3 !py-1.5">{lang === 'hi' ? 'English' : 'हिंदी'}</button>
          <Link to="/cart" className="btn-outline relative !px-3 !py-2" aria-label="Cart"><ShoppingCart size={18} />{count > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-accent-500 px-1.5 text-[11px] font-bold text-white">{count}</span>}</Link>
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/orders'} className="btn-outline hidden !px-3 !py-2 sm:inline-flex"><User size={16} /> {user.name.split(' ')[0]}</Link>
              <button onClick={logout} className="btn-outline !px-3 !py-2" aria-label="Logout"><LogOut size={16} /></button>
            </>
          ) : (<Link to="/login" className="btn-primary">{t('login')}</Link>)}
        </div>
      </div>
      <nav className={`border-t border-slate-100 ${open ? 'block' : 'hidden'} lg:block`}>
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-2 lg:flex-row lg:gap-6">
          <NavLink to="/" className={link}>{t('home')}</NavLink>
          <NavLink to="/shop" className={link}>{t('shop')}</NavLink>
          <NavLink to="/about" className={link}>{t('about')}</NavLink>
          <NavLink to="/contact" className={link}>{t('contact')}</NavLink>
          {user && <NavLink to="/orders" className={link}>My Orders</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" className={link}>Admin Dashboard</NavLink>}
        </div>
      </nav>
    </header>
  );
}
