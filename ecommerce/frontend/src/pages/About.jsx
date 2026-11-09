import { ShieldCheck, Wrench } from 'lucide-react';
import { SHOP } from '../api';

export default function About() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold">About Us</h1>
      <p className="mt-3 max-w-3xl text-slate-600">{SHOP.hindiName} ({SHOP.name}) is a local electronics and sewing machine shop at {SHOP.address}. We sell sewing machines, fans, induction cookers, mixers, irons, LED bulbs, wires, holders, switch boards, and thread, buttons, collars and buckram for tailoring work.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="card p-5"><h2 className="flex items-center gap-2 font-semibold"><ShieldCheck className="text-brand-600" /> Our promise</h2><p className="mt-2 text-sm text-slate-600">All items are sold with full guarantee. Repairs are also done with full guarantee.</p></div>
        <div className="card p-5"><h2 className="flex items-center gap-2 font-semibold"><Wrench className="text-brand-600" /> Our services</h2><p className="mt-2 text-sm text-slate-600">Sewing machine sales and repairs, electronics and home appliances, and tailoring supplies — with advice in the shop and on WhatsApp at {SHOP.phoneDisplay}.</p></div>
      </div>
      <div className="card mt-6 p-5"><h2 className="font-semibold">Our mission</h2><p className="mt-2 text-sm text-slate-600">To be the trusted local shop in Itkhori where customers can buy the right sewing machine or appliance, at a fair price confirmed in the shop, with honest after-sales support.</p><p className="mt-2 text-sm text-slate-500">Google rating: {SHOP.googleRating} / 5 from {SHOP.googleReviews} reviews. Customer testimonials are not shown here because none have been collected and verified yet.</p></div>
    </div>
  );
}
