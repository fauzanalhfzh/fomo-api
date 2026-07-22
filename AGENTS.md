# fomo-api

## Stack

Bun + Hono + Cloudflare Workers (Wrangler).

## Commands

| Command | Action |
|---|---|
| `bun run src/server.ts` | Dev server (Bun, port 8787) |
| `npm run wrangler-dev` | Dev via Wrangler (`--ip 0.0.0.0`) |
| `npm run deploy` | Deploy to Cloudflare Workers (`--minify`) |
| `npm run cf-typegen` | Regenerate `CloudflareBindings` types |

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

## OpenCode

Hono skills (`honos`, `honod`) are pre-installed under `.opencode/skills/` — use them for Hono API code and docs.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
