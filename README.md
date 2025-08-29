# MERN Travel Planner

## Quick Start

1. Install MongoDB locally and make sure it is running.
2. Backend:

```
cd backend
npm install
npm run seed
npm run dev
```

3. Frontend:

```
cd ../frontend
npm install
npm start
```

4. Open http://localhost:3000 and login `admin@example.com` / `admin123` (from seed).

## What’s inside

- JWT auth, JOI validation, RBAC
- Cities & Routes CRUD (pagination/sorting in APIs)
- D3 graph visualization & Dijkstra shortest path (returns pathIds + pathNames)
- Modern Tailwind UI + form to create routes
