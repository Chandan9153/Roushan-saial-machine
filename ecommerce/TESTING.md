# Testing Checklist — Roushan Sewing Machine & Electronics

Run the backend (`cd backend && npm run dev`) and frontend (`cd frontend && npm run dev`) first, with the seed already run (`npm run seed`).

## Smoke test
- [ ] `GET http://localhost:5000/api/health` returns success.
- [ ] Home page loads, shows shop name, address, Google rating 5.0 / 9 reviews, and products.
- [ ] No console errors on Home, Shop, or any product page.

## Authentication
- [ ] Register a new customer with a valid email and 10-digit mobile — account is created and logged in.
- [ ] Register with the same email again — rejected with a clear error.
- [ ] Register with a short password (< 6) or invalid phone — rejected.
- [ ] Log out, log back in with the wrong password — rejected.
- [ ] Log in with the correct password — succeeds; My Orders page opens.
- [ ] Open `/admin` as a customer — access denied message, no admin data shown.

## Shop & product details
- [ ] Shop shows 15 products. Industrial Sewing Machines and Spare Parts show an honest empty state (0 products).
- [ ] Search "mixer" finds only Mixer Grinder.
- [ ] Category filter narrows the list; the count matches.
- [ ] Price filter and sorting (low→high, high→low, name) change the order correctly.
- [ ] Pagination works when there are more than 12 products in a filtered view (seed more test products, or lower the limit).
- [ ] Product page shows price, sample-price label where applicable, Price on enquiry where applicable, description, quantity selector, and related products.
- [ ] WhatsApp enquiry button opens wa.me/918797777269 with the product name and price pre-filled.

## Cart & checkout
- [ ] Add to cart from a product card and from a product page; quantity updates; remove works.
- [ ] Cart survives a page reload (localStorage).
- [ ] Checkout without logging in redirects to Login.
- [ ] Checkout with an invalid PIN (not 6 digits) or phone — form is rejected.
- [ ] Place a COD order — order confirmation page shows the order ID, status Pending, and total.
- [ ] Click "Confirm order on WhatsApp" — opens wa.me with the order summary pre-filled.
- [ ] My Orders shows the new order with status Pending.
- [ ] Price-on-enquiry items in an order contribute 0 to the total and are noted as shop-confirmed.

## Admin dashboard (log in as admin)
- [ ] Dashboard shows total orders, total products (15 after seed), total customers, and revenue.
- [ ] Add a product with a photo — it appears in the Shop.
- [ ] Edit a product's price — the new price shows in the Shop.
- [ ] Delete a product — it disappears from the Shop.
- [ ] Add a category — it appears in the Shop filter.
- [ ] Delete a category that has products — refused with a clear error.
- [ ] Delete an empty category — succeeds.
- [ ] Change an order status Pending → Confirmed → Shipped → Delivered — My Orders (customer view) reflects the new status.
- [ ] Customers tab lists registered customers without showing passwords.

## Mobile responsiveness
- [ ] Home, Shop, Product, Cart, Checkout and Admin pages at 390 px width: no horizontal scrolling, buttons reachable, header menu opens.
- [ ] Same check at 768 px and 1280 px.

## Security spot-checks
- [ ] `GET /api/admin/dashboard` without a token — 401.
- [ ] `GET /api/admin/dashboard` with a customer token — 403.
- [ ] `POST /api/orders` with a product price changed in the request body — total is still calculated from the database price.
- [ ] Upload a non-image file as a product photo — rejected.
- [ ] No password hash appears in any API response (check `/api/auth/me` and `/api/admin/customers`).
