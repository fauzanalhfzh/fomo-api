<p align="center">
  <img src="https://img.shields.io/badge/Bun-000?logo=bun&logoColor=fff" alt="Bun">
  <img src="https://img.shields.io/badge/Hono-E36002?logo=hono&logoColor=fff" alt="Hono">
  <img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=fff" alt="Prisma">
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=fff" alt="Supabase">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=fff" alt="PostgreSQL">
</p>

# FOMO API

**FOMO** (_Find Out Must-visit cOffee_) — Cafe discovery & AI itinerary platform API.

Backend REST API built with Bun + Hono, using Supabase Auth & Prisma ORM on PostgreSQL.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | [Bun](https://bun.sh) 1.x |
| Framework | [Hono](https://hono.dev) 4.x |
| ORM | [Prisma](https://www.prisma.io) 7.x (`@prisma/adapter-pg`) |
| Database | PostgreSQL 17 (Supabase) |
| Auth | Supabase Auth (Google OAuth) |
| Validation | Zod 4 + `@hono/zod-openapi` |

## Features (Phase 1 — MVP)

- **Auth** — Google OAuth login/register, JWT refresh, session logout
- **Spots** — CRUD with nearby geo-search, facility & toilet detail
- **Tags** — Amenity categories (Wi-Fi, Plugs, etc.)
- **Reviews** — Create, read, update, delete (owner-guarded)
- **Vault** — Save/favorite spots for later
- **User Profile** — View & update profile, delete account
- **Suggestions** — Crowdsource spot suggestions (admin approval workflow)

## Quick Start

### Prerequisites

- Bun 1.x
- Supabase project (free tier works)
- PostgreSQL connection string (Supabase)

### Setup

```bash
# 1. Clone & install
git clone https://github.com/fauzanalhfzh/fomo-api.git
cd fomo-api
bun install

# 2. Set environment variables
cp .env.example .env
# edit .env with your Supabase credentials

# 3. Generate Prisma client
bunx prisma generate

# 4. Seed database (optional)
bun run seed

# 5. Start dev server
bun run src/server.ts
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (Supabase pooled or direct) |
| `SUPABASE_URL` | ✅ | Supabase project URL |
| `SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service_role key (admin operations) |
| `PORT` | ❌ | Server port (default: `8787`) |

## Deployment

### Docker (recommended)

```bash
# Build & run
docker compose up -d

# Or build manually
docker build -t fomo-api .
docker run -p 8787:8787 --env-file .env fomo-api
```

### Manual (VPS / bare metal)

```bash
bun install
bunx prisma generate
bun run src/server.ts
```

## Project Structure

```
src/
  app.ts                Hono app — routes, middleware, OpenAPI docs
  server.ts             Bun HTTP server entrypoint
  core/
    prisma.ts           Prisma client singleton
    supabase.ts         Supabase admin client
  modules/
    auth/               Auth routes & handlers
    spots/              Spot CRUD + nearby search
    tags/               Tag listing
    reviews/            Review CRUD
    vault/              User saved spots
    users/              User profile
    suggestions/        Crowdsourced suggestions
  shared/
    middleware/
      auth.ts           Auth middleware & guards
prisma/
  schema.prisma         Full database schema
  seed.ts               Seed data (spots, tags, reviews, facilities)
  migrations/           SQL migration files
tests/
  helpers.ts            Shared test utilities
  run-all.ts            Sequential test runner
```

## API Endpoints

| Module | Endpoints | Auth |
|--------|-----------|------|
| Auth | `POST /api/auth/google`, `/refresh`, `/logout` | Public / Bearer |
| Spots | `GET /api/spots`, `/nearby`, `/:id`<br>`POST`, `PATCH /:id`, `DELETE /:id` | Public / Admin |
| Tags | `GET /api/tags` | Public |
| Reviews | `GET /api/spots/:spotId/reviews`<br>`POST`, `GET /api/reviews/:id`, `PATCH`, `DELETE` | Public / Bearer |
| Vault | `GET`, `POST /api/vault`<br>`DELETE /api/vault/:spotId` | Bearer |
| Users | `GET`, `PATCH`, `DELETE /api/users/me` | Bearer |
| Suggestions | `POST /api/suggestions`<br>`GET`, `PATCH /:id` | Bearer / Admin |

See [docs/API-list.md](docs/API-list.md) for the full endpoint reference.

## Database Migrations

```bash
# Preview migration SQL
bun run mg:diff

# Save migration files
bun run mg:save

# Apply via Supabase Dashboard (SQL Editor)
# then register in _prisma_migrations
```

## Testing

```bash
# Run all tests
bun run test:all

# Run single module
bun run test:tags
bun run test:spots
```

## License

MIT
