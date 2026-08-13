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

### Demo logins

| Page | Email | Password |
|---|---|---|
| Dashboard | `sara@raida.local` | `Password123!` |
| Admin | `admin@raida.local` | `Password123!` |
