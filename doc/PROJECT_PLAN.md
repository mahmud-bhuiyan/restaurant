# Epicurean Haven 2.0 — MERN Build Plan

> **Reference:** See [restaurant-website-project-plan.md](./restaurant-website-project-plan.md) for the original feature spec and database model.

---

## Project Structure

```
restaurant/
├── client/          # React (Vite) — public site + admin UI
├── server/          # Express API — auth, CRUD, business logic
├── doc/             # Plans and documentation
└── README.md
```

---

## Tech Stack (MERN)

| Layer | Choice | Notes |
|---|---|---|
| Frontend | **React 18 + Vite + TypeScript** | SPA with React Router |
| Styling | **Tailwind CSS** | Theme tokens in `tailwind.config` |
| State (cart) | **Zustand** | Client-side cart before checkout |
| Backend | **Express + TypeScript** | REST API under `/api` |
| Database | **MongoDB** (local or Atlas) | Document model via **Mongoose** |
| Auth | **JWT** (httpOnly cookie or Bearer) | bcrypt for passwords; `CUSTOMER` / `ADMIN` roles |
| Image storage | **Cloudinary** or local `/uploads` for dev | Menu & gallery images |
| Email (optional) | **Nodemailer / Resend** | Order & reservation confirmations |

---

## Design Decisions (v1 defaults)

- **Branding:** Epicurean Haven
- **Design direction:** Dark moody fine-dining (charcoal + gold)
- **Single location** — no multi-branch
- **Order flow:** Pending → Confirmed → Preparing → Out for Delivery → Delivered → Cancelled
- **Order types:** Delivery + Pickup; payment = Cash on Delivery
- **Auth:** Login required for ordering; reservations & testimonials are guest-friendly
- **Reservations:** Time-slot based with max covers per slot (no table map in v1)
- **Testimonials:** Include 1–5 star rating; moderation queue (PENDING → APPROVED/REJECTED)

---

## MongoDB Collections (Mongoose models)

| Model | Key fields |
|---|---|
| `User` | name, email, passwordHash, phone, address, role |
| `MenuCategory` | name, sortOrder |
| `MenuItem` | categoryId, name, description, price, imageUrl, isAvailable, isFeatured, tags |
| `Order` | userId, status, orderType, deliveryAddress, phone, subtotal, total, notes, items[] |
| `Reservation` | userId?, name, email, phone, date, time, partySize, status, notes |
| `Testimonial` | userId?, name, message, rating, status |
| `GalleryImage` | imageUrl, caption, sortOrder |
| `SiteSettings` | restaurantName, address, phone, email, openingHours, heroImage, socialLinks |

---

## Module Progress

| # | Module | Status |
|---|---|---|
| 1 | Project Setup | **Done** |
| 2 | Design System | **Done** |
| 3 | Authentication | **Done** |
| 4 | Menu Module | **Done** |
| 5 | Ordering & Cart | **Next** |
| 6 | Reservations | Pending |
| 7 | Testimonials | Pending |
| 8 | Gallery & Content Pages | Pending |
| 9 | Admin Panel Shell | Pending |
| 10 | Polish, SEO & Launch | Pending |

---

## Coding standards

- **Separation of concerns:** routes → services → models (see `server/src/services/`)
- **Reusable UI:** `PageHeader`, `FormError`, `AuthFormLayout`, `MenuItemCard`, shared `ui/` components
- **API docs:** keep [doc/API.md](./doc/API.md) updated with every route change
- **Tests:** user tests in `tests/server/users/` and `client/tests/users/`

**Goal:** Runnable monorepo with client and server communicating locally.

### Server
- [x] Express + TypeScript scaffold
- [x] Mongoose connection helper
- [x] Health check route `GET /api/health`
- [x] CORS + JSON middleware
- [x] `server/.env.local` + `client/.env` (separate per deploy target)
- [ ] Connect to MongoDB and verify health endpoint *(needs your Atlas/local URI)*

### Client
- [x] Vite + React + TypeScript scaffold
- [x] Tailwind CSS configured
- [x] React Router stub
- [x] API proxy to server in dev
- [x] Home page with health-check ping to API

### Repo
- [x] Root README with dev instructions
- [ ] Git init + GitHub push *(when ready)*

**Run locally:**
```bash
# Terminal 1 — server
cd server && npm install && npm run dev

# Terminal 2 — client
cd client && npm install && npm run dev
```

---

## Module 2 — Design System ✅ (complete)

- [x] Tailwind theme: charcoal + gold, Playfair Display + Inter fonts
- [x] Core components: Button, Card, Input, Modal, Badge
- [x] Layout: Navbar, Footer, PublicLayout
- [x] Homepage skeleton (static mock data): hero, featured menu, about, gallery preview, testimonials, CTA
- [x] Placeholder routes for Menu, About, Gallery, Contact, Testimonials

---

## Module 3 — Authentication ✅ (complete)

- [x] User model (Mongoose) with CUSTOMER / ADMIN roles
- [x] Register, login, logout, me, profile update API routes
- [x] JWT in httpOnly cookie + auth middleware
- [x] Admin seed script (`npm run seed:admin`)
- [x] Client AuthContext + protected routes (`/account`, `/checkout`, `/admin`)
- [x] Login, Signup, Account pages
- [x] Navbar shows auth state

**Seed admin user:**
```bash
cd server && npm run seed:admin
# Default: admin@epicureanhaven.com / Admin123!
```

---

## Module 4 — Menu Module ✅ (complete)

- [x] MenuCategory & MenuItem Mongoose models
- [x] Public API: `GET /api/menu`, `GET /api/menu/featured`
- [x] Admin CRUD: categories & items (availability, featured, image URL)
- [x] Public `/menu` page with category filter + sold-out badges
- [x] Admin `/admin/menu` management UI
- [x] Homepage featured section loads from API
- [x] Seed script for sample menu data

**Seed menu:**
```bash
cd server && npm run seed:menu
```

---

## Module 5 — Ordering & Cart (next)

- Zustand cart; cart page/drawer
- Checkout (auth required): delivery/pickup, address, COD
- Order confirmation + optional email
- Admin orders dashboard with status updates

---

## Module 6 — Reservations

- Guest-friendly reservation form
- Slot availability (max covers in SiteSettings)
- Admin reservations dashboard

---

## Module 7 — Testimonials

- Guest submission form with star rating
- Public wall shows APPROVED only
- Admin moderation queue

---

## Module 8 — Gallery & Content

- Gallery from DB; admin upload/reorder
- About + Contact pages (SiteSettings-driven where useful)

---

## Module 9 — Admin Panel Shell

- Sidebar layout: Dashboard, Menu, Orders, Reservations, Testimonials, Gallery, Settings
- Dashboard stats; Site Settings editor

---

## Module 10 — Polish & Launch

- Mobile responsive pass
- SEO meta, favicon, sitemap
- Loading/empty/error states
- Rate limiting on public forms
- Production deploy (client static + server on Render/Railway/Fly; MongoDB Atlas)

---

## How to Work With Cursor

1. Say: *"We're on Module N — [module name]. Check doc/PROJECT_PLAN.md."*
2. Complete and test one module before moving on.
3. Do not skip ahead unless explicitly asked.

---

## Open Questions

- Final restaurant name (keep Epicurean Haven?)
- Delivery radius / minimum order?
- Email only or SMS for v1 notifications?
- Cloudinary vs local uploads for development?
