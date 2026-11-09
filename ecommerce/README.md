# Roushan Sewing Machine & Electronics — E-Commerce

Premium full-stack e-commerce website for **Roushan Sewing Machine & Electronics** (रोशन सिलाई मशीन एंड इलेक्ट्रॉनिक), Itkhori Chowk, Itkhori, Chatra, Jharkhand 825408, India.

- Phone / WhatsApp: +91 87977 77269 (`wa.me/918797777269`)
- Instagram: @roushan_sewing_machine
- Google rating: 5.0 / 5 from 9 reviews (verified Google listing)
- All items with full guarantee; repairs with full guarantee.

## What is in this repo

| Folder | Stack |
| --- | --- |
| `frontend/` | React 18 + Vite, React Router, Tailwind CSS, Axios, Lucide icons, Context API (auth + cart) |
| `backend/` | Node.js + Express, MongoDB + Mongoose, JWT, bcrypt, Multer, express-validator, rate limiting, Helmet, CORS |

Pages: Home, Shop (search, category, price filter, sort, pagination), Product Details, Cart, Checkout (COD + WhatsApp), About, Contact, Login, Register, My Orders, Admin Dashboard (overview, orders, products, categories, customers).

## Honest data notes

- The 15 products in `backend/seed.js` are the verified shop range. The 8 priced products are **sample prices, assumed, please confirm in shop** — they are flagged `isSamplePrice: true` in the code and labelled on the site.
- The other 7 products have `price: null` (Price on enquiry) — the shop confirms their price.
- **Industrial Sewing Machines** and **Spare Parts** are seeded as empty categories on purpose. No products, prices, stock, testimonials or best-sellers have been invented for them.
- Business hours are not shown on the site because no verified hours were supplied — confirm them in the shop before adding.

## Local development

### Prerequisites
- Node.js 18 or later
- MongoDB running locally, or a MongoDB Atlas cluster (see `backend/.env.example`)

### 1. Backend
```bash
cd backend
cp .env.example .env
# Edit .env: set MONGO_URI, JWT_SECRET, WHATSAPP_NUMBER, FRONTEND_URL
npm install
npm run seed        # seeds 8 categories + 15 products
npm run dev         # http://localhost:5000  (health: GET /api/health)
```

Create an admin account for the dashboard:
```bash
# In backend/.env, set ADMIN_EMAIL and ADMIN_PASSWORD, then run:
npm run seed
# Or: register a customer in the app, then set role: "admin" for that user in MongoDB.
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000/api
npm install
npm run dev         # http://localhost:5173
npm run build       # production build (outputs dist/)
```

## Production deployment

### Backend — Render (free tier)
1. Push this repo to GitHub.
2. In Render, create a **Web Service** from the repo, root directory `backend`.
3. Build command: `npm install`. Start command: `npm start`.
4. Environment variables (from `backend/.env.example`): `MONGO_URI` (Atlas), `JWT_SECRET` (long random secret), `WHATSAPP_NUMBER=918797777269`, `FRONTEND_URL=<your Vercel URL>`, `NODE_ENV=production`.
5. No file is uploaded to a public URL by default; product images are served from `/uploads` on the same service. For a larger shop, move uploads to a cloud store (e.g. Cloudinary/S3) — see `backend/services/upload.js`.

### Frontend — Vercel
1. In Vercel, import the same repo, root directory `frontend`.
2. Build command: `npm run build`. Output directory: `dist`.
3. Environment variable: `VITE_API_URL=https://<your-render-service>.onrender.com/api`.
4. Redeploy after changing the API URL.

### Database — MongoDB Atlas
1. Create a free Atlas cluster, a database user, and allow network access (0.0.0.0/0 for testing, or Render's IPs for production).
2. Use the Atlas connection string as `MONGO_URI`.
3. Run the seed once against Atlas: `MONGO_URI=<atlas-uri> npm run seed` from `backend/`.

### After deployment
- Open the frontend URL, register, log in as admin, and check the Admin Dashboard.
- Test the flow in `TESTING.md`.
- Update the Google Business Profile Website field to the new frontend URL (only that field).
- This repo is **not** the GitHub Pages static site. GitHub Pages serves only the single static `index.html` already in `Chandan9153/Roushan-saial-machine`; the full-stack app needs Render + Vercel (or equivalent) as above.

## API
See [API.md](API.md) for every endpoint, request/response shapes, and auth rules.

## Testing
See [TESTING.md](TESTING.md) for the full checklist.

## Security
- Passwords are hashed with bcrypt; JWTs are signed with `JWT_SECRET` from the environment. No secrets are hardcoded.
- Admin routes require a JWT with `role: "admin"`. Self-registration always creates a customer.
- Uploads are validated by type (JPG/PNG/WebP/GIF) and size (default 5 MB).
- No payment card information is collected or stored. Payment is Cash on Delivery or WhatsApp confirmation only.
- Rate limiting is enabled on `/api/auth` (50 requests / 15 min) and `/api` (500 / 15 min).
