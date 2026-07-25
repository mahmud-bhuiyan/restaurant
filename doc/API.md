# Epicurean Haven API Reference

> **Base URL:** `http://localhost:5000` (development)  
> **Last updated:** Module 4 — Menu  
> Keep this file in sync whenever routes change.

---

## Conventions

| Topic | Detail |
|-------|--------|
| **Version prefix** | All endpoints live under `/api/v1` (see [Versioning](#versioning)) |
| Content-Type | `application/json` for request bodies |
| Auth cookie | `token` (httpOnly JWT, 7-day expiry) |
| Error shape | `{ "message": "..." }` |
| Roles | `CUSTOMER`, `ADMIN` |

---

## Versioning

All routes use `/api/v1`. To add v2 later, mount the same (or updated) routes under `/api/v2` in `app.ts` and keep v1 until you are ready to remove it.

**`GET /api` response `200`**
```json
{
  "message": "Epicurean Haven API",
  "version": "v1",
  "basePath": "/api/v1"
}
```

---

## Health

### `GET /api/v1/health`

Public health check.

**Response `200`**
```json
{
  "status": "ok",
  "version": "v1",
  "message": "Epicurean Haven API is running",
  "timestamp": "2026-07-25T09:00:00.000Z"
}
```

---

## Authentication

### `POST /api/v1/auth/register`

Register a new **customer** account. Admin accounts cannot be created via this route.

**Body**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret12",
  "phone": "+1 555 123 4567",
  "address": "123 Main St"
}
```

| Field | Required | Notes |
|-------|----------|-------|
| name | yes | |
| email | yes | Lowercased, unique |
| password | yes | Min 6 characters |
| phone | no | |
| address | no | |

**Response `201`** — sets auth cookie  
```json
{
  "user": {
    "id": "...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "",
    "address": "",
    "role": "CUSTOMER",
    "createdAt": "..."
  }
}
```

**Errors:** `400` validation · `409` email taken · `500` server error

---

### `POST /api/v1/auth/login`

Login for customers and admins.

**Body**
```json
{
  "email": "jane@example.com",
  "password": "secret12"
}
```

**Response `200`** — sets auth cookie, same user shape as register.

**Errors:** `400` missing fields · `401` invalid credentials · `500`

---

### `POST /api/v1/auth/logout`

Clears the auth cookie.

**Response `200`**
```json
{ "message": "Logged out" }
```

---

### `GET /api/v1/auth/me`

Returns the current authenticated user.

**Auth:** required

**Response `200`**
```json
{ "user": { "id": "...", "name": "...", "email": "...", "role": "CUSTOMER", ... } }
```

**Errors:** `401` not authenticated

---

### `PATCH /api/v1/auth/profile`

Update profile fields for the logged-in user.

**Auth:** required

**Body** (all optional)
```json
{
  "name": "Jane Smith",
  "phone": "+1 555 999 0000",
  "address": "456 Oak Ave"
}
```

**Response `200`** — `{ "user": { ... } }`

**Errors:** `401` · `404` user not found · `500`

---

## Menu (Public)

### `GET /api/v1/menu`

Full menu grouped by category.

**Response `200`**
```json
{
  "categories": [
    {
      "id": "...",
      "name": "Starters",
      "sortOrder": 1,
      "items": [
        {
          "id": "...",
          "categoryId": "...",
          "categoryName": "Starters",
          "name": "Pan-Seared Scallops",
          "description": "...",
          "price": 28,
          "imageUrl": "https://...",
          "isAvailable": true,
          "isFeatured": true,
          "tags": ["seafood"]
        }
      ]
    }
  ],
  "items": [ "...flat list..." ]
}
```

---

### `GET /api/v1/menu/featured`

Featured items that are currently available (max 6).

**Response `200`**
```json
{ "items": [ "...MenuItem..." ] }
```

---

## Menu (Admin)

All admin menu routes require **auth + ADMIN role**.

### Categories

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/menu/categories` | Create category |
| `PATCH` | `/api/v1/menu/categories/:id` | Update category |
| `DELETE` | `/api/v1/menu/categories/:id` | Delete (only if empty) |

**Create body**
```json
{ "name": "Starters", "sortOrder": 1 }
```

---

### Items

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/menu/items` | Create item |
| `PATCH` | `/api/v1/menu/items/:id` | Update item |
| `DELETE` | `/api/v1/menu/items/:id` | Delete item |

**Create body**
```json
{
  "categoryId": "...",
  "name": "Wagyu Beef",
  "description": "...",
  "price": 58,
  "imageUrl": "https://...",
  "isAvailable": true,
  "isFeatured": false,
  "tags": ["gluten-free"]
}
```

**Errors:** `400` validation · `401` · `403` not admin · `404` not found · `500`

---

## Orders

Payment method: **Cash on Delivery** only.

### `POST /api/v1/orders`

Place a new order. **Auth:** required (customer).

**Body**
```json
{
  "orderType": "DELIVERY",
  "phone": "+1 555 123 4567",
  "deliveryAddress": "123 Main St",
  "notes": "Ring the bell",
  "items": [
    { "menuItemId": "...", "quantity": 2 }
  ]
}
```

| Field | Required | Notes |
|-------|----------|-------|
| orderType | yes | `DELIVERY` or `PICKUP` |
| phone | yes | |
| deliveryAddress | for delivery | Required when `orderType` is `DELIVERY` |
| notes | no | |
| items | yes | At least one line; items must be available |

**Response `201`**
```json
{
  "order": {
    "id": "...",
    "userId": "...",
    "status": "PENDING",
    "orderType": "DELIVERY",
    "deliveryAddress": "123 Main St",
    "phone": "+1 555 123 4567",
    "subtotal": 64,
    "total": 64,
    "notes": "",
    "items": [
      {
        "menuItemId": "...",
        "name": "Steak",
        "quantity": 2,
        "priceAtOrder": 32,
        "lineTotal": 64
      }
    ],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Status flow:** `PENDING` → `CONFIRMED` → `PREPARING` → `OUT_FOR_DELIVERY` → `DELIVERED` · `CANCELLED`

---

### `GET /api/v1/orders/mine`

List orders for the logged-in customer. **Auth:** required.

**Response `200`** — `{ "orders": [ "...Order..." ] }`

---

### `GET /api/v1/orders`

List all orders (newest first). **Auth:** admin.

**Query:** `?status=PENDING` (optional filter)

**Response `200`** — `{ "orders": [ "...Order with customerName..." ] }`

---

### `GET /api/v1/orders/:id`

Single order. **Auth:** order owner or admin.

**Response `200`** — `{ "order": { ... } }`

---

### `PATCH /api/v1/orders/:id/status`

Update order status. **Auth:** admin.

**Body**
```json
{ "status": "CONFIRMED" }
```

**Response `200`** — `{ "order": { ... } }`

---

## Reservations

Guest-friendly — no login required (logged-in users get reservations linked to their account).

Capacity is enforced per time slot using `maxCoversPerSlot` from Site Settings (default 24).

### `GET /api/v1/reservations/availability?date=YYYY-MM-DD`

Public slot availability for a date.

**Response `200`**
```json
{
  "date": "2026-07-26",
  "maxCoversPerSlot": 24,
  "slots": [
    {
      "time": "18:00",
      "bookedCovers": 4,
      "remainingCovers": 20,
      "available": true
    }
  ]
}
```

---

### `POST /api/v1/reservations`

Create a reservation. **Auth:** optional (links `userId` when logged in).

**Body**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1 555 123 4567",
  "date": "2026-07-26",
  "time": "18:00",
  "partySize": 4,
  "notes": "Anniversary dinner"
}
```

**Response `201`** — `{ "reservation": { ... } }` with status `PENDING`

**Errors:** `400` validation · `409` slot full · `500`

---

### `GET /api/v1/reservations/mine`

List reservations for the logged-in user. **Auth:** required.

**Response `200`** — `{ "reservations": [ ... ] }`

---

### `GET /api/v1/reservations`

List all reservations. **Auth:** admin.

**Query:** `?date=YYYY-MM-DD` · `?status=PENDING`

---

### `PATCH /api/v1/reservations/:id/status`

Update reservation status. **Auth:** admin.

**Body**
```json
{ "status": "CONFIRMED" }
```

Statuses: `PENDING` · `CONFIRMED` · `CANCELLED`

---

## Testimonials

Guest-friendly submissions — no login required. Only **APPROVED** reviews appear publicly.

### `GET /api/v1/testimonials`

Public list of approved testimonials.

**Query:** `?limit=3` (optional, for homepage preview)

**Response `200`**
```json
{
  "testimonials": [
    {
      "id": "...",
      "name": "Sarah Mitchell",
      "message": "An unforgettable evening…",
      "rating": 5,
      "status": "APPROVED",
      "createdAt": "..."
    }
  ]
}
```

---

### `POST /api/v1/testimonials`

Submit a review (starts as `PENDING`). **Auth:** optional.

**Body**
```json
{
  "name": "Sarah Mitchell",
  "message": "An unforgettable evening. The wagyu was perfect.",
  "rating": 5
}
```

| Field | Notes |
|-------|-------|
| rating | Integer 1–5 |
| message | Min 10 characters |

**Response `201`** — `{ "testimonial": { ... }, "message": "Thank you! …" }`

---

### `GET /api/v1/testimonials/all`

Moderation queue. **Auth:** admin.

**Query:** `?status=PENDING`

---

### `PATCH /api/v1/testimonials/:id/status`

Approve or reject. **Auth:** admin.

**Body**
```json
{ "status": "APPROVED" }
```

Statuses: `PENDING` · `APPROVED` · `REJECTED`

---

### `DELETE /api/v1/testimonials/:id`

Permanently delete. **Auth:** admin.

---

## Seed Scripts

```bash
cd server
npm run seed:admin   # admin@gmail.com / User@123
npm run seed:menu    # sample categories & dishes
```

---

## Changelog

| Module | Endpoints added |
|--------|-----------------|
| 1 | `GET /api/v1/health` |
| 3 | `/api/v1/auth/*` |
| 4 | `/api/v1/menu/*` |
| 5 | `/api/v1/orders/*` |
| 6 | `/api/v1/reservations/*` |
| 7 | `/api/v1/testimonials/*` |

---

## Testing

User/auth tests cover all endpoints in this document:

| Suite | Location | Count |
|-------|----------|-------|
| Auth service (unit) | `server/tests/users/auth.service.test.ts` | 12 |
| Auth routes (integration) | `server/tests/users/auth.routes.test.ts` | 10 |
| Order routes (integration) | `server/tests/users/orders.routes.test.ts` | 5 |
| Reservation routes (integration) | `server/tests/users/reservations.routes.test.ts` | 5 |
| Testimonial routes (integration) | `server/tests/users/testimonials.routes.test.ts` | 5 |
| API client | `client/tests/users/authApi.test.ts` | 3 |
| AuthContext | `client/tests/users/authContext.test.tsx` | 3 |
| Env helper | `client/tests/users/env.test.ts` | 3 |
| cn utility | `client/tests/users/cn.test.ts` | 3 |

Run: `cd server && npm test` and `cd client && npm test`.
