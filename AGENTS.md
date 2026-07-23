# fomo-api

## Stack

Bun + Hono

## Commands

| Command | Action |
|---|---|
| `bun run src/server.ts` | Dev server (Bun, port 8787) |

## Known Quirks

- **Entrypoint confusion**: `src/server.ts` imports `./index` but the file is `src/app.ts`. `wrangler.jsonc` expects `src/index.ts`. No `index.ts` exists yet. Use `src/app.ts` as the app definition.
- **No test, lint, or formatter config** exists. Any added tooling needs setup from scratch.
- Environment secrets go in `.dev.vars` (dev) or Wrangler dashboard (prod).

## Architecture

```
src/
  app.ts         Hono app definition — routes, middleware, exports `default app`
  server.ts      Bun HTTP server bootstrap (for local dev)
  core/          Business logic, services, domain models
  modules/       Feature modules — each module gets its own file or subfolder
  shared/        Shared utilities, types, constants
```

- Place route handlers in `modules/` organized by feature (e.g. `modules/auth/`).
- Place pure business logic in `core/`.
- Place shared types/helpers in `shared/`.
- Keep `app.ts` thin — register routes, mount middleware, import modules.

## Environment

- `.env`, `.env.production`, `.dev.vars` are gitignored.
- `.dev.vars` is for local Wrangler secrets.

## Migrations (via Supabase + Prisma)

Supabase pooler (port 6543) doesn't support DDL through Prisma CLI. Migration workflow:

1. Edit `prisma/schema.prisma`
2. Generate migration SQL:
   ```
   bun run mg:diff
   ```
   Review the output, then save & create migration file:
   ```
   bun run mg:save
   ```
3. Apply the SQL via Supabase Dashboard (SQL Editor) or the Supabase MCP tool
4. Register in `_prisma_migrations` table (run via Supabase SQL Editor):
   ```sql
   INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "applied_steps_count")
   VALUES (
     gen_random_uuid()::text,
     -- ganti path sesuai nama migration
     sha256(pg_read_file('/path/to/migration.sql'))::text,
     now(),
     '20260723000000_nama_migration',
     1
   );
   ```
   Or compute checksum manually: `sha256sum prisma/migrations/[name]/migration.sql`

Note: `mg:diff` compares `schema-last.prisma` vs `schema.prisma`. The baseline is auto-updated after `mg:save`. If starting fresh after a clone, run `bun run mg:baseline` first.

## OpenCode

Hono skills (`honos`, `honod`) are pre-installed under `.opencode/skills/` — use them for Hono API code and docs.

