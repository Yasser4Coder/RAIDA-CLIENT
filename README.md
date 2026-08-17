# RAIDA Client

Premium Arabic RTL platform for women entrepreneurs.

## Stack

- React 19 + Vite
- TypeScript
- Tailwind CSS v4
- React Router
- Lucide Icons

## API

The client talks to `RAIDA-SERVER` through Vite’s `/api` proxy (`VITE_API_BASE_URL=/api/v1`).

1. Start MySQL and the server:

```bash
cd ../RAIDA-SERVER
npm run db:setup
npm run dev
```

2. Start the client:

```bash
cd ../RAIDA-CLIENT
npm install
npm run dev
```

Open http://localhost:5173

### Production

```bash
cp .env.production.example .env.production
# set VITE_SITE_URL and VITE_API_BASE_URL (https only, or same-origin /api/v1)
npm run build:production
```

Output: `dist/`. The script refuses localhost/placeholder URLs, disables source maps, and fails if demo passwords leak into the bundle.

`VITE_API_BASE_URL=/api/v1` only works when the website and API share a host (reverse proxy). Otherwise use `https://<api-host>/api/v1`.

Update `public/robots.txt` and `public/sitemap.xml` to match your real domain if it is not `raaida.net`.

Demo accounts (`sara@raida.local` / `admin@raida.local`) exist only after a **local** `npm run seed`. Do not create them on production. First admin: `npm run create-admin` on the server.
