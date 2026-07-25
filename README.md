# Epicurean Haven 2.0

Dynamic restaurant website with online ordering, reservations, testimonials, gallery, and admin panel.

**Stack:** MongoDB · Express · React (Vite) · Node.js

## Project structure

```
restaurant/
├── client/          React app (node_modules, tests, .env)
├── server/          Express API (node_modules, tests, .env.local)
└── doc/             Plans, API reference, deploy guide
```

Each app is **self-contained** — install and run from its own folder.

## Getting started

### Prerequisites

- Node.js 18+
- MongoDB ([MongoDB Atlas](https://www.mongodb.com/atlas) recommended)

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

### 3. Seed data

```bash
cd server && npm run seed
```

Creates admin (`admin@gmail.com` / `User@123`), sample menu, and gallery images.

## Environment files

| File | Purpose | Committed? |
|------|---------|------------|
| `server/.env.example` | Server template | Yes |
| `server/.env.local` | Server secrets | No |
| `client/.env.example` | Client template | Yes |
| `client/.env` | `VITE_API_URL` | No |

**Local dev:** leave `VITE_API_URL` empty in `client/.env` to use the Vite proxy.

## Modules (all complete)

| # | Module | Status |
|---|--------|--------|
| 1 | Project Setup | Done |
| 2 | Design System | Done |
| 3 | Authentication | Done |
| 4 | Menu | Done |
| 5 | Ordering & Cart | Done |
| 6 | Reservations | Done |
| 7 | Testimonials | Done |
| 8 | Gallery & Content | Done |
| 9 | Admin Panel | Done |
| 10 | Polish & Launch | Done |

See [doc/PROJECT_PLAN.md](./doc/PROJECT_PLAN.md) for details.

## API & deploy

- API reference: [doc/API.md](./doc/API.md)
- Deployment: [doc/DEPLOY.md](./doc/DEPLOY.md)

## Tests

```bash
cd server && npm test    # server integration tests
cd client && npm test    # client unit tests
```
