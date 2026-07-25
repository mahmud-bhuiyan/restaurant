# Epicurean Haven API Reference

> **Base URL:** `http://localhost:5000` (development)  
> **Last updated:** Module 4 — Menu  
> Keep this file in sync whenever routes change.

---

## Conventions

| Topic | Detail |
|-------|--------|
| Content-Type | `application/json` for request bodies |
| Auth cookie | `token` (httpOnly JWT, 7-day expiry) |
| Error shape | `{ "message": "..." }` |
| Roles | `CUSTOMER`, `ADMIN` |

---

## Health

### `GET /api/health`

Public health check.

**Response `200`**
```json
{
  "status": "ok",
  "message": "Epicurean Haven API is running",
  "timestamp": "2026-07-25T09:00:00.000Z"
}
```

---

## Authentication

### `POST /api/auth/register`

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

### `POST /api/auth/login`

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

### `POST /api/auth/logout`

Clears the auth cookie.

**Response `200`**
```json
{ "message": "Logged out" }
```

---

### `GET /api/auth/me`

Returns the current authenticated user.

**Auth:** required

**Response `200`**
```json
{ "user": { "id": "...", "name": "...", "email": "...", "role": "CUSTOMER", ... } }
```

**Errors:** `401` not authenticated

---

### `PATCH /api/auth/profile`

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

### `GET /api/menu`

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

### `GET /api/menu/featured`

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
| `POST` | `/api/menu/categories` | Create category |
| `PATCH` | `/api/menu/categories/:id` | Update category |
| `DELETE` | `/api/menu/categories/:id` | Delete (only if empty) |

**Create body**
```json
{ "name": "Starters", "sortOrder": 1 }
```

---

### Items

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/menu/items` | Create item |
| `PATCH` | `/api/menu/items/:id` | Update item |
| `DELETE` | `/api/menu/items/:id` | Delete item |

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

## Seed Scripts

```bash
cd server
npm run seed:admin   # admin@epicureanhaven.com / Admin123!
npm run seed:menu    # sample categories & dishes
```

---

## Changelog

| Module | Endpoints added |
|--------|-----------------|
| 1 | `GET /api/health` |
| 3 | `/api/auth/*` |
| 4 | `/api/menu/*` |

---

## Testing

User/auth tests cover all endpoints in this document:

| Suite | Location | Count |
|-------|----------|-------|
| Auth service (unit) | `server/tests/users/auth.service.test.ts` | 12 |
| Auth routes (integration) | `server/tests/users/auth.routes.test.ts` | 10 |
| API client | `client/tests/users/authApi.test.ts` | 3 |
| AuthContext | `client/tests/users/authContext.test.tsx` | 3 |
| Env helper | `client/tests/users/env.test.ts` | 3 |
| cn utility | `client/tests/users/cn.test.ts` | 3 |

Run: `cd server && npm test` and `cd client && npm test`.
