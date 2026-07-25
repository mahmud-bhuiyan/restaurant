# Epicurean Haven 2.0 — Full Project Plan
### Dynamic Restaurant Website with Online Ordering, Reservations, Testimonials & Admin Panel

---

## 0. Reference: What You Had Before

Your old site (`epicurean-haven.vercel.app` / `.web.app`) was a **static HTML/CSS site**:
- Home, Menu, About, Gallery, Contact sections
- A separate `reservation.html` page (likely a form with no backend/storage)
- No login, no ordering, no database, no admin

This plan replaces it with a **full-stack dynamic app**: real database, accounts, live menu managed from an admin panel, cart + order flow, table booking with availability, and a moderated testimonials wall.

---

## 1. Tech Stack (recommended for Cursor + fast solo build)

| Layer | Choice | Why |
|---|---|---|
| Frontend framework | **Next.js 14+ (App Router, TypeScript)** | One codebase for public site + admin panel, great SEO for public pages, API routes built-in |
| Styling | **Tailwind CSS + shadcn/ui** | Fast to build a modern, unique look; easy to theme |
| Database | **PostgreSQL** (via **Supabase** or **Neon**) | Relational data (orders, items, users) fits SQL well; Supabase also gives you auth + storage for free |
| ORM | **Prisma** | Type-safe queries, easy migrations, pairs perfectly with Cursor's autocomplete |
| Auth | **NextAuth.js (Auth.js)** or **Supabase Auth** | Email/password signup for customers + separate admin role |
| Image storage | **Supabase Storage** or **Cloudinary** | For menu photos, gallery, testimonial avatars |
| State (cart) | **Zustand** or React Context | Lightweight cart state before checkout |
| Hosting | **Vercel** (frontend+API) + **Supabase/Neon** (DB) | Free tier is enough to start, matches your old Vercel deploy habit |
| Notifications (optional) | **Resend** (email) | Order confirmation / reservation confirmation emails |

> Tell Cursor to scaffold with: `npx create-next-app@latest --typescript --tailwind --app`

---

## 2. Suggestions Before You Start (worth deciding now)

1. **Unique design direction** — pick ONE distinct personality instead of generic "elegant restaurant" template:
   - Dark moody fine-dining (charcoal + gold accents, big food photography)
   - Warm bistro (cream/terracotta, hand-drawn accents, playful type)
   - Modern minimal (lots of white space, editorial typography, small pops of color)
   Decide this before Cursor starts on UI — it changes the Tailwind theme, fonts, and component style.
2. **Single restaurant, single location** for v1 — don't build multi-branch support yet, it adds real complexity (inventory per branch, delivery zones per branch). Add later if needed.
3. **Order status flow** — decide the stages now so DB schema matches: `Pending → Confirmed → Preparing → Out for Delivery → Delivered → Cancelled`.
4. **Delivery vs Pickup** — even though payment is COD, decide if you support both delivery and pickup at launch (recommend: yes, both, it's cheap to add and doubles use-cases).
5. **Guest checkout** — you said signup is required for ordering. Confirm reservations and testimonials do NOT require signup (lower friction), only ordering does. This matches your original ask — just documenting it so Cursor scaffolds auth-gating correctly.
6. **Testimonials vs Reviews** — decide if testimonials are free-text only, or include a star rating. A star rating adds almost no extra work and adds credibility — recommend including it.
7. **Table booking model** — simple version: pick date/time/party size, no live table-map. Advanced version: visual table map with real slot availability. **Recommend starting simple** (time-slot based with a max-covers-per-slot limit), upgrade to visual table map in v2.

---

## 3. Database Schema (give this directly to Cursor to generate the Prisma schema)

```
User
- id, name, email, passwordHash, phone, address, role (CUSTOMER | ADMIN), createdAt

MenuCategory
- id, name (Starters, Mains, Desserts, Cocktails...), sortOrder

MenuItem
- id, categoryId, name, description, price, imageUrl, isAvailable, isFeatured, spiceLevel/tags, createdAt

Order
- id, userId, status, orderType (DELIVERY | PICKUP), deliveryAddress, phone, subtotal, total, notes, createdAt

OrderItem
- id, orderId, menuItemId, quantity, priceAtOrder

Reservation
- id, userId (nullable if guest), name, email, phone, date, time, partySize, status (PENDING | CONFIRMED | CANCELLED), notes, createdAt

Testimonial
- id, userId (nullable if guest), name, message, rating (1-5), status (PENDING | APPROVED | REJECTED), createdAt

GalleryImage
- id, imageUrl, caption, sortOrder

SiteSettings (single row)
- restaurantName, address, phone, email, openingHours (JSON), heroImage, socialLinks (JSON)
```

Prompt for Cursor:
> "Generate a Prisma schema based on this data model: [paste above]. Use PostgreSQL as the provider, add appropriate relations, enums for status/role fields, and timestamps."

---

## 4. Module-by-Module Build Plan

Build in this order — each module is testable on its own before moving to the next.

### **Module 1 — Project Setup**
- Scaffold Next.js + TypeScript + Tailwind + shadcn/ui
- Connect Prisma to Supabase/Neon Postgres, run first migration
- Set up folder structure: `/app/(public)`, `/app/(auth)`, `/app/admin`, `/app/api`
- Set up `.env` for DB URL, NextAuth secret, image storage keys
- Push to GitHub, connect to Vercel for auto-deploy from day 1

### **Module 2 — Design System**
- Define Tailwind theme: colors, fonts (pick 2 Google Fonts — one display, one body), spacing scale
- Build core reusable components: Button, Card, Input, Modal, Badge, Navbar, Footer
- Build the homepage layout skeleton (hero, featured menu, about, gallery preview, testimonials preview, footer) — static content for now, wire to DB later

### **Module 3 — Authentication**
- Customer signup/login (email + password, or add Google OAuth)
- Admin login (seed one admin user manually in DB, no public admin signup)
- Middleware to protect `/admin/*` routes (ADMIN role only) and `/checkout`, `/account` (logged-in only)
- Account page: view profile, past orders, past reservations

### **Module 4 — Menu Module**
- Public: `/menu` page pulling categories + items from DB, filter by category, show unavailable items as "sold out"
- Admin: CRUD UI for categories and menu items (add/edit/delete, toggle availability, upload image, mark featured)
- Homepage "featured items" pulls `isFeatured` items

### **Module 5 — Ordering & Cart**
- Add-to-cart from menu page (client-side cart state via Zustand)
- Cart drawer/page: adjust quantity, remove item, see subtotal
- Checkout page (requires login): choose delivery or pickup, enter/confirm address & phone, add notes, place order → payment method fixed as **Cash on Delivery**
- Order confirmation page + confirmation email (optional)
- Customer order history in account page with live status
- Admin: Orders dashboard — list all orders, filter by status, update status (Pending → Confirmed → Preparing → Out for Delivery → Delivered), view order detail

### **Module 6 — Reservations**
- Public reservation form: name, email, phone, date, time, party size, notes (no login required, but pre-fill if logged in)
- Simple availability logic: define max covers per time-slot in Site Settings, block/warn if slot is full
- Confirmation message + optional email
- Admin: Reservations dashboard — list, filter by date, approve/confirm/cancel, see daily view

### **Module 7 — Testimonials**
- Public: "Share your experience" form (name, message, star rating) — open to guests
- Submissions go in as `PENDING`, NOT shown publicly yet
- Public testimonials section only shows `APPROVED` ones (homepage carousel + dedicated `/testimonials` page)
- Admin: Testimonials moderation queue — approve / reject / delete

### **Module 8 — Gallery & Content Pages**
- Gallery page pulling images from DB (admin can upload/reorder/delete)
- About page (can be simple static content, or make key fields editable via Site Settings so no code redeploy is needed for text changes)
- Contact page with map embed + contact form (optional: store contact messages in DB, or just email via a form service)

### **Module 9 — Admin Panel Shell**
- Sidebar layout: Dashboard, Menu, Orders, Reservations, Testimonials, Gallery, Settings, Users
- Dashboard home: quick stats (today's orders, pending reservations, pending testimonials, revenue this week)
- Site Settings page: edit restaurant name, address, phone, hours, social links, hero image — feeds the public footer/header/homepage

### **Module 10 — Polish, SEO, and Launch Prep**
- Responsive check on mobile (this is where most first-time diners will land)
- Add meta tags, Open Graph images, favicon, sitemap.xml, robots.txt
- Add loading states, empty states, error states (e.g., empty cart, no reservations today)
- Add basic analytics (Vercel Analytics or Plausible)
- Rate-limit or captcha the testimonial/reservation forms to avoid spam
- Final QA pass: full order flow, full reservation flow, full testimonial flow, admin approve/reject flow
- Deploy: connect custom domain, set production env vars, run production DB migration

---

## 5. Suggested "Nice-to-Have" Features for Later (v2)

- Loyalty points / repeat-customer discounts
- Live order tracking with map (bigger lift, skip for v1)
- WhatsApp/SMS order & reservation confirmations
- Multi-language support
- Online payment (Stripe/local gateway) once you're ready to move off COD
- Visual table-map booking instead of time-slot only
- Dietary tag filters on menu (vegan, gluten-free, spicy) — cheap to add, worth doing in v1 if time allows
- Dark mode toggle

---

## 6. How to Feed This to Cursor

Recommended approach — don't paste this whole doc as one giant prompt. Work module by module:

1. Start a fresh repo, paste **Module 1** instructions, let Cursor scaffold and get it running locally first.
2. Paste the **schema (Section 3)** and ask Cursor to generate `schema.prisma` + run migration.
3. Then go module by module (2 → 10), pasting only that module's section as your prompt, and test after each one before moving on.
4. Keep this file in your repo root as `PROJECT_PLAN.md` — Cursor can reference it for context in later prompts (e.g., "check PROJECT_PLAN.md, we're now on Module 5").

---

## 7. Open Questions to Settle Before/During Build

- Final restaurant name/branding (keep "Epicurean Haven" or rename?)
- Which design direction from Section 2.1?
- Delivery radius / minimum order amount for delivery orders?
- Do you want SMS notifications, or is email enough for v1?
- One location or are you planning multiple branches eventually? (affects schema now vs. later)
