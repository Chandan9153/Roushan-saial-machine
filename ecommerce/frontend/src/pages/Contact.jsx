import { Instagram, MapPin, Phone, Star } from 'lucide-react';
import { useState } from 'react';
import { SHOP, whatsappUrl } from '../api';

export default function Contact() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  function submit(e) {
    e.preventDefault();
    // No backend contact endpoint is specified; the form opens WhatsApp with the message.
    window.open(whatsappUrl(`Namaste, I am ${name}. ${message}`), '_blank');
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold">Contact Us</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="card space-y-3 p-5">
          <p className="flex items-start gap-2 text-sm"><MapPin size={16} className="mt-0.5 shrink-0" /> {SHOP.address}</p>
          <p className="flex items-center gap-2 text-sm"><Phone size={16} /> <a href={`tel:${SHOP.phone}`} className="font-semibold text-brand-600">{SHOP.phoneDisplay}</a></p>
          <p className="flex items-center gap-2 text-sm"><Instagram size={16} /> <a href={`https://www.instagram.com/${SHOP.instagram}/`} target="_blank" rel="noreferrer" className="font-semibold text-brand-600">@{SHOP.instagram}</a></p>
          <p className="flex items-center gap-2 text-sm"><Star size={16} className="text-yellow-500" /> Google rating {SHOP.googleRating} / 5 ({SHOP.googleReviews} reviews)</p>
          <a href="https://www.google.com/maps/dir/?api=1&destination=Itkhori%20Chowk%2C%20Itkhori%2C%20Chatra%2C%20Jharkhand%20825408" target="_blank" rel="noreferrer" className="btn-primary mt-2">Get directions on Google Maps</a>
          <p className="text-xs text-slate-500">Business hours are confirmed in the shop — please call or WhatsApp before visiting.</p>
        </div>
        <form onSubmit={submit} className="card space-y-4 p-5">
          <h2 className="font-semibold">Send us a message</h2>
          <div><label className="label" htmlFor="c-name">Your name</label><input id="c-name" required value={name} onChange={(e) => setName(e.target.value)} className="input" /></div>
          <div><label className="label" htmlFor="c-message">Message</label><textarea id="c-message" required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className="input" /></div>
          <button type="submit" className="btn-accent">Send on WhatsApp</button>
          {sent && <p className="text-sm text-green-700">WhatsApp opened with your message. The shop will reply there.</p>}
        </form>
      </div>
    </div>
  );
}
