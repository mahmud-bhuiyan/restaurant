# Deployment Guide

Epicurean Haven uses **separate client and server** deployments.

## Prerequisites

- MongoDB Atlas cluster (connection string in `MONGODB_URI`)
- Node.js 18+

## Environment variables

### Server (`server/.env.local` or host env panel)

| Variable | Example |
|----------|---------|
| `MONGODB_URI` | `mongodb+srv://...` |
| `ADMIN_JWT_SECRET` | long random string |
| `CLIENT_URL` | `https://your-frontend.vercel.app` |
| `PORT` | `5000` (local only) |
| `ADMIN_EMAIL` | seed admin email |
| `ADMIN_PASSWORD` | seed admin password |

### Client (`client/.env`)

| Variable | Example |
|----------|---------|
| `VITE_API_URL` | `https://your-api.vercel.app` |

Leave empty in local dev to use the Vite proxy.

## Seed production database

```bash
cd server
npm run seed    # admin + menu + gallery
```

## Deploy server

### Vercel

1. Import the `server/` folder as a project
2. Set environment variables in the Vercel dashboard
3. `vercel.json` routes all requests to `api/index.ts`

### Render / Railway / Fly.io

```bash
cd server
npm install
npm run build
npm start
```

Start command: `node dist/index.js` (run `npm run build` first).

## Deploy client

### Vercel / Netlify / Cloudflare Pages

```bash
cd client
npm install
npm run build
```

Publish the `dist/` folder. `vercel.json` includes SPA fallback for client-side routing.

Set `VITE_API_URL` to your deployed API origin **before** building.

## Post-deploy checklist

- [ ] `CLIENT_URL` on server matches frontend URL (CORS + cookies)
- [ ] `VITE_API_URL` on client matches API URL
- [ ] Run seeds on production DB
- [ ] Login as admin → verify dashboard stats
- [ ] Test order flow, reservation, testimonial submission
- [ ] Update `client/public/sitemap.xml` and `robots.txt` with your domain

## Health checks

- Server: `GET /api/health`
- API: `GET /api/v1/menu` (public)
