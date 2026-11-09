import { Instagram, MapPin, Phone, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SHOP, whatsappUrl } from '../api';

export default function Footer() {
  return (
    <footer className="mt-16 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-white">{SHOP.hindiName}</p>
          <p className="text-sm">{SHOP.name}</p>
          <p className="mt-3 flex items-start gap-2 text-sm"><MapPin size={16} className="mt-0.5 shrink-0" /> {SHOP.address}</p>
          <p className="mt-2 flex items-center gap-2 text-sm"><Star size={16} className="text-yellow-400" /> Google rating {SHOP.googleRating} / 5 ({SHOP.googleReviews} reviews)</p>
        </div>
        <div>
          <p className="font-semibold text-white">Quick links</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-white">Shop all products</Link></li>
            <li><Link to="/about" className="hover:text-white">About us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact us</Link></li>
            <li><Link to="/orders" className="hover:text-white">My orders</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Contact</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href={`tel:${SHOP.phone}`} className="flex items-center gap-2 hover:text-white"><Phone size={16} /> {SHOP.phoneDisplay}</a></li>
            <li><a href={whatsappUrl('Namaste, mujhe Roushan Sewing Machine & Electronics se kuchh poochhna hai.')} target="_blank" rel="noreferrer" className="hover:text-white">WhatsApp: {SHOP.phoneDisplay}</a></li>
            <li><a href={`https://www.instagram.com/${SHOP.instagram}/`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white"><Instagram size={16} /> @{SHOP.instagram}</a></li>
          </ul>
          <p className="mt-3 text-xs text-slate-400">All items with full guarantee. Repairs also with full guarantee.</p>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-400">© {new Date().getFullYear()} {SHOP.name}, Itkhori, Jharkhand. Cash on Delivery available.</div>
    </footer>
  );
}
