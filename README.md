# Epicurean Haven 2.0

Dynamic restaurant website with online ordering, reservations, testimonials, and admin panel.

**Stack:** MongoDB · Express · React (Vite) · Node.js

## Project structure

```
restaurant/
├── client/          React app (node_modules, tests, .env)
├── server/          Express API (node_modules, tests, .env.local)
└── doc/             Project plans, API reference
```

Each app is **self-contained** — install and run from its own folder.

## Getting started

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Server

```bash
cd server
npm install
cp .env.example .env.local   # set MONGODB_URI, ADMIN_JWT_SECRET, CLIENT_URL
npm run dev
```

API runs at `http://localhost:5000`

### 2. Client

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

App runs at `http://localhost:5173`

## Environment files (separate hosting)

Client and server each have their own env — they are **not** shared.

| File | Purpose | Committed? |
|------|---------|------------|
| `server/.env.example` | Server template | Yes |
| `server/.env.local` | Server secrets (DB, ADMIN_JWT_SECRET, CORS, IMGBB) | No |
| `client/.env.example` | Client template | Yes |
| `client/.env` | Client config (`VITE_API_URL`) | No |

**Local dev**
- `server/.env.local` → `CLIENT_URL=http://localhost:5173`
- `client/.env` → `VITE_API_URL=` (empty, uses Vite proxy)

**Separate production hosts**
- `server/.env.local` → `CLIENT_URL=https://your-frontend.com`
- `client/.env` → `VITE_API_URL=https://your-api.com`

Then build & deploy each folder independently.

## Build plan

See [doc/PROJECT_PLAN.md](./doc/PROJECT_PLAN.md) for the step-by-step module plan.

| Module | Status |
|--------|--------|
| 1. Project Setup | Done |
| 2. Design System | Done |
| 3. Authentication | Done |
| 4. Menu Module | Done |
| 5. Ordering & Cart | Next |

## API

Full reference: [doc/API.md](./doc/API.md) — update this file whenever routes change.

## Seed data

```bash
cd server && npm run seed:admin   # admin@epicureanhaven.com / Admin123!
cd server && npm run seed:menu      # sample categories & dishes
```

## Tests

Run from each app folder (uses that app's `node_modules`):

```bash
cd server && npm test    # 22 tests — tests/users/
cd client && npm test    # 12 tests — tests/users/
```

See `server/tests/README.md` and `client/tests/README.md`.
