// Seed the 8 categories and the 15 verified products.
// Run: npm run seed   (from backend/, with backend/.env configured)
// Idempotent: clears Product and Category collections first, then re-seeds.
// Prices: the 8 sample prices are flagged isSamplePrice: true and must be
// confirmed in the shop. The other 7 have price: null (Price on enquiry).
// Industrial Sewing Machines and Spare Parts are seeded empty on purpose —
// no products are invented for them.
const dotenv = require('dotenv');

dotenv.config();
const connectDB = require('./config/db');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');

const CATEGORIES = [
  { name: 'Sewing Machines', slug: 'sewing-machines', description: 'Sewing machines for home stitching and tailor work.' },
  { name: 'Electric Sewing Machines', slug: 'electric-sewing-machines', description: 'Electric sewing machines for everyday home use.' },
  { name: 'Manual Sewing Machines', slug: 'manual-sewing-machines', description: 'Hand-operated sewing machines for home stitching.' },
  { name: 'Industrial Sewing Machines', slug: 'industrial-sewing-machines', description: 'Industrial sewing machines — no products listed yet. Ask in the shop.' },
  { name: 'Sewing Machine Accessories', slug: 'sewing-machine-accessories', description: 'Needles, bobbins, thread and accessories for sewing machines.' },
  { name: 'Electronics', slug: 'electronics', description: 'LED bulbs, wires, holders, switch boards and small electronics.' },
  { name: 'Home Appliances', slug: 'home-appliances', description: 'Fans, induction cookers, mixers, irons and home appliances.' },
  { name: 'Spare Parts', slug: 'spare-parts', description: 'Spare parts — no products listed yet. Ask in the shop.' },
];

// [name, categorySlug, price, isSamplePrice, description]
const PRODUCTS = [
  ['Manual Sewing Machine', 'manual-sewing-machines', 6499, true, 'Classic hand-operated sewing machine for home stitching, alterations and tailor work.'],
  ['Electric Sewing Machine', 'electric-sewing-machines', 12499, true, 'Electric sewing machine with adjustable stitch settings for everyday home use.'],
  ['Mini Electric Sewing Machine', 'sewing-machines', 2999, true, 'Compact portable mini sewing machine, handy for quick repairs and small stitching jobs.'],
  ['Sewing Machine Accessories Kit', 'sewing-machine-accessories', 999, true, 'Needles, presser feet, bobbins and tools for sewing machines.'],
  ['Bobbin, Needle & Thread Kit', 'sewing-machine-accessories', 499, true, 'Bobbin box with bobbin cases, machine needles, thread and measuring tape.'],
  ['Table Fan', 'home-appliances', 2199, true, 'Table fan for home and shop use.'],
  ['Electric Dry Iron', 'home-appliances', 1099, true, 'Electric dry iron with temperature control for daily ironing.'],
  ['Mixer Grinder', 'home-appliances', 3799, true, 'Mixer grinder with stainless steel jars for chutney, masala and batter.'],
  ['Fans', 'home-appliances', null, false, 'Fans for home and shop use. Ask on WhatsApp or in the shop for the types and brands currently available.'],
  ['Induction Cooker', 'home-appliances', null, false, 'Induction cookers for everyday cooking. Ask in the shop for the models currently available.'],
  ['LED Bulbs', 'electronics', null, false, 'LED bulbs for home and shop lighting. Wattage and types are confirmed in the shop.'],
  ['Electric Wires & Cables', 'electronics', null, false, 'Electric wires and cables for house wiring and repairs. Sizes and lengths are confirmed in the shop.'],
  ['Holders', 'electronics', null, false, 'Bulb holders and related holders for home and shop fittings. Types are confirmed in the shop.'],
  ['Switch Boards', 'electronics', null, false, 'Switch boards for home and shop electrical fittings. Sizes and types are confirmed in the shop.'],
  ['Thread, Buttons, Collars & Buckram', 'sewing-machine-accessories', null, false, 'Thread, buttons, collars and buckram for tailoring and stitching work. Colours and types are confirmed in the shop.'],
];

async function seed() {
  await connectDB();
  await Product.deleteMany({});
  await Category.deleteMany({});
  const created = await Category.insertMany(CATEGORIES);
  const bySlug = Object.fromEntries(created.map((c) => [c.slug, c._id]));
  await Product.insertMany(PRODUCTS.map(([name, slug, price, isSamplePrice, description]) => ({
    name, description, category: bySlug[slug], price, isSamplePrice, stock: 0, images: [], specifications: [],
  })));
  // Optional admin account, only when explicitly configured in the environment.
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    await User.deleteOne({ email: process.env.ADMIN_EMAIL });
    await User.create({ name: 'Roushan', email: process.env.ADMIN_EMAIL, phone: '8797777269', password: process.env.ADMIN_PASSWORD, role: 'admin' });
    // eslint-disable-next-line no-console
    console.log(`Admin user created: ${process.env.ADMIN_EMAIL}`);
  } else {
    // eslint-disable-next-line no-console
    console.log('No admin user created. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env to create one, or register a customer and promote it to admin in MongoDB.');
  }
  // eslint-disable-next-line no-console
  console.log(`Seeded ${CATEGORIES.length} categories and ${PRODUCTS.length} products.`);
  process.exit(0);
}

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Seed failed:', err.message);
  process.exit(1);
});
