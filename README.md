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

Set an absolute API URL on your host (build-time env):

```bash
VITE_API_BASE_URL=https://YOUR-API-HOST/api/v1
```

`/api/v1` only works locally via the Vite proxy. Without a real backend URL in production, the console will show `404` on every API request.

### Demo logins

| Page | Email | Password |
|---|---|---|
| Dashboard | `sara@raida.local` | `Password123!` |
| Admin | `admin@raida.local` | `Password123!` |
