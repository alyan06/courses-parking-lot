# Learning Parking Lot

A personal command center for saving courses, certifications, and videos — so you never lose that link again.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** + shadcn/ui components
- **Turso / libsql** — local SQLite file in dev, Turso cloud in production
- **Sonner** — toast notifications

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (no .env needed — uses a local dev.db file)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The database is created automatically on first run and seeded with example entries.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | Open "Add Item" modal from anywhere |

## Deploying to Vercel

Vercel's serverless functions have a read-only filesystem, so you need a cloud database (Turso).

### 1. Create a Turso database

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash   # macOS/Linux
# or: winget install turso                          # Windows

# Login and create a DB
turso auth login
turso db create learning-parking-lot
```

### 2. Get your credentials

```bash
turso db show learning-parking-lot --url
# → libsql://learning-parking-lot-<username>.turso.io

turso db tokens create learning-parking-lot
# → eyJ...  (your token)
```

### 3. Add env vars to Vercel

In your Vercel project → Settings → Environment Variables:

| Name | Value |
|------|-------|
| `TURSO_DATABASE_URL` | `libsql://learning-parking-lot-<username>.turso.io` |
| `TURSO_AUTH_TOKEN` | `eyJ...` |

### 4. Deploy

```bash
npx vercel --prod
```

Or connect your GitHub repo in the Vercel dashboard and push — it deploys automatically.

## Environment Variables

See [`.env.example`](.env.example).

```env
# Leave blank for local dev (uses file:dev.db by default)
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=eyJ...
```

## Features

- **Dashboard** — live stats + last 5 of each type
- **Courses page** — filter by status/priority, sort, table/card toggle, inline status cycling, edit/delete
- **Videos page** — filter by status/platform, mark as watched, open URL
- **Add/Edit modal** — single modal handles courses and videos (tab switcher)
- **Keyboard shortcut** — press `N` anywhere to add
- **Dark-mode-first** — deep navy/slate aesthetic with electric blue, emerald, amber accents
- **Responsive** — works on mobile for quick saves
