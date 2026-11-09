# API Documentation — Roushan Sewing Machine & Electronics

Base URL (local): `http://localhost:5000/api`
Health check: `GET /api/health` → `{ "success": true, "message": "Roushan e-commerce API is running" }`

All responses use `{ "success": true, "data": ... }` on success, or `{ "success": false, "message": "..." }` on error. List endpoints that paginate also return `pagination: { page, limit, total, pages }`.

## Authentication

Authenticated requests send: `Authorization: Bearer <JWT>`

| Method | Endpoint | Auth | Body | Response |
| --- | --- | --- | --- | --- |
| POST | `/api/auth/register` | — | `{ name, email, phone, password, address? }` | 201 `{ user, token }` — role is always `customer` |
| POST | `/api/auth/login` | — | `{ email, password }` | 200 `{ user, token }` |
| GET | `/api/auth/me` | Customer | — | 200 `{ user }` |

Phone must be a 10-digit Indian mobile starting 6–9. Password minimum 6 characters.

## Products

| Method | Endpoint | Auth | Query / Body |
| --- | --- | --- | --- |
| GET | `/api/products` | — | `?search=&category=<id>&minPrice=&maxPrice=&sort=newest\|price-asc\|price-desc\|name&page=&limit=` (max 50) |
| GET | `/api/products/:id` | — | — |
| GET | `/api/products/:id/related` | — | Up to 4 products in the same category |
| POST | `/api/products` | Admin | multipart/form-data: `name, description, category, price?, discountPrice?, stock?, isSamplePrice?, images[]` (max 5 images) |
| PUT | `/api/products/:id` | Admin | multipart/form-data, same fields as POST |
| DELETE | `/api/products/:id` | Admin | — |

`price: null` (or omitted) means Price on enquiry. `discountPrice` must be lower than `price` when both are set.

## Categories

| Method | Endpoint | Auth | Body |
| --- | --- | --- | --- |
| GET | `/api/categories` | — | Returns categories with `productCount` |
| POST | `/api/categories` | Admin | `{ name, slug, description?, image? }` |
| PUT | `/api/categories/:id` | Admin | Same as POST |
| DELETE | `/api/categories/:id` | Admin | Refused (400) if any product still uses the category |

## Orders

| Method | Endpoint | Auth | Body |
| --- | --- | --- | --- |
| POST | `/api/orders` | Customer | `{ products: [{ product, quantity }], shippingAddress: { name, phone, street, city, state?, pinCode }, paymentMethod: "COD" \| "WhatsApp" }` |
| GET | `/api/orders/my-orders` | Customer | Own orders, newest first |
| GET | `/api/orders/:id` | Customer/Admin | Own order, or any order for admin |

`POST /api/orders` returns `{ success: true, data: <created order>, whatsappUrl }` — `whatsappUrl` is a top-level field, not inside `data`. It is a pre-filled WhatsApp message to the shop number with product names, quantities, prices, total, payment method and delivery address. Prices are always taken from the database, never trusted from the client. Price-on-enquiry items contribute 0 to `totalAmount` and are confirmed by the shop.

## Admin

All `/api/admin/*` routes require a JWT with `role: "admin"`.

| Method | Endpoint | Response |
| --- | --- | --- |
| GET | `/api/admin/dashboard` | `{ totalOrders, totalProducts, totalCustomers, revenue, ordersByStatus, recentOrders }` — revenue excludes Cancelled orders |
| GET | `/api/admin/orders?status=` | All orders, newest first, optional status filter |
| PUT | `/api/admin/orders/:id/status` | `{ orderStatus }` — one of Pending, Confirmed, Processing, Shipped, Delivered, Cancelled |
| GET | `/api/admin/customers` | All customer users (passwords never returned) |

## Error codes

| Code | Meaning |
| --- | --- |
| 400 | Validation error (message lists the problem) |
| 401 | Missing, invalid or expired token |
| 403 | Logged in but not an admin (admin routes) / not your order |
| 404 | Product, category, order or route not found |
| 500 | Server error (details are logged server-side, not leaked to the client) |
