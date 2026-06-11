# Hopcity Brew Co.

Premium coming-soon site for **Hopcity Brew Co.** — Sarath City Capital Mall, 5th Floor, Hyderabad.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- PostgreSQL on [Railway](https://railway.app)
- Prisma ORM

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables**

   Copy the example file and add your Railway Postgres URLs:

   ```bash
   cp .env.example .env.local
   ```

   From Railway → your Postgres service → **Connect** → **Public Network**:

   - `DATABASE_URL` — public Postgres URL (Vercel + local dev)
   - `DATABASE_PUBLIC_URL` — optional; same public URL for local dev

   **Vercel:** Project → Settings → Environment Variables → set `DATABASE_URL`
   to the **public** Railway URL. Never use `postgres.railway.internal` on Vercel.

3. **Run database migration**

   ```bash
   npm run db:migrate
   ```

   Or push schema without migration history:

   ```bash
   npm run db:push
   ```

4. **Start dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## GitHub

```bash
git remote add origin https://github.com/Nikhilesh-cheepu/hopcity.git
git push -u origin main
```

## Roadmap

- [x] Phase 1 — Coming Soon landing + waitlist
- [ ] Phase 2 — Beer catalog + food pairings
- [ ] Phase 3 — Tasting scorecard
- [ ] Phase 4 — Visit / booking
- [ ] Phase 5 — Automations & integrations
