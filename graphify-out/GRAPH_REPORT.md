# Graph Report - fomo-api  (2026-07-22)

## Corpus Check
- 94 files · ~93,916 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1941 nodes · 1917 edges · 156 communities (155 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `91e48124`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- spots.service.ts
- Prisma 7 Driver Adapter Implementation Guide
- RPC
- Model Queries
- Driver Adapters
- Upgrade to Prisma ORM 7
- Relation Queries
- Removed Features
- dependencies
- Plugins
- honos/SKILL.md
- JWT Authentication Helper
- Raw Queries
- Language Middleware
- HonoRequest
- Prisma CLI Reference
- Client Methods
- Filter Conditions and Operators
- Query Options
- prisma db push
- prisma dev
- prisma generate
- prisma studio
- Prisma Client API Reference
- Troubleshooting Prisma Compute
- Prisma Config
- prisma migrate dev
- Options
- Context
- prisma db seed
- Prisma Compute
- Environment Variables
- prisma db pull
- prisma init
- prisma migrate deploy
- Prisma Database Setup
- Prisma Accelerate Users
- ESM and CommonJS Support
- Constructor Options
- Schema Changes
- JSX
- Transactions
- Workflow
- Bun
- Deno
- Cloudflare Workers
- Cloudflare Pages
- Options
- Prisma Compute Framework Readiness
- MongoDB Setup
- Core Workflows
- Node.js
- <Badge type="info" text="optional" /> verification: `VerifyOptions`
- Routing
- prisma db execute
- Prisma Platform CLI App Deploy
- MySQL Setup
- management-api
- Global Constraints
- Options
- HEAD Request Best Practices
- css Helper
- Cookie Helper
- prisma migrate diff
- prisma migrate reset
- PostgreSQL Setup
- Prisma Postgres Setup
- SQLite Setup
- Third-party Middleware
- Options
- Hono
- SQL Server Setup
- create-db-cli
- api-basics
- Spec: Modul Spots — Phase 1 MVP
- App - Hono
- Options
- Options
- Route Helper
- compilerOptions
- prisma format
- prisma migrate resolve
- prisma validate
- CockroachDB Setup
- decision-stay-or-migrate
- console-and-connections
- Getting Started
- JSX Renderer Middleware
- Request ID Middleware
- Middleware
- fomo-api
- prisma migrate status
- Prisma Compute Config
- create-prisma Compute Flow
- migrations-mapping
- schema-contract-mapping
- Prisma MongoDB Upgrade Path
- management-api-sdk
- endpoints
- Client Components
- AWS Lambda
- Options
- html Helper
- Method Override Middleware
- Create-hono
- Validation
- prisma mcp
- client-api-mapping
- Service Tokens
- Supabase Edge Functions
- Factory Helper
- Logger Middleware
- ETag Middleware
- WebSocket Helper
- Secure Headers Middleware
- prisma debug
- SDK and API Automation
- Prisma Client Setup
- verify-cutover-checklist
- Prisma 7 Client Instantiation
- WebAssembly (w/ WASI)
- Cloudflare Workers + Vite
- Body Limit Middleware
- Trailing Slash Middleware
- Compress Middleware
- Options
- Benchmarks
- Hono Stacks
- IP Restriction Middleware
- Azure Functions
- Google Cloud Run
- Fastly Compute
- Netlify
- Next.js
- Vercel
- Adapter Helper
- Dev Helper
- CSRF Protection
- Throwing HTTPExceptions
- Usage
- `proxy()`
- Streaming Helper
- Routers
- Hono
- Alibaba Cloud Function Compute
- Lambda@Edge
- Service Worker
- Presets
- Timeout Middleware
- opencode.json
- Context Storage Middleware
- Miscellaneous
- graphify.js

## God Nodes (most connected - your core abstractions)
1. `Troubleshooting Prisma Compute` - 20 edges
2. `RPC` - 19 edges
3. `Context` - 19 edges
4. `HonoRequest` - 19 edges
5. `JSX` - 16 edges
6. `Prisma Client API Reference` - 14 edges
7. `Prisma Compute Framework Readiness` - 14 edges
8. `Upgrade to Prisma ORM 7` - 14 edges
9. `Routing` - 14 edges
10. `getPrisma()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `createSpot()` --calls--> `getPrisma()`  [EXTRACTED]
  src/modules/spots/spots.service.ts → src/core/prisma.ts
- `deleteSpot()` --calls--> `getPrisma()`  [EXTRACTED]
  src/modules/spots/spots.service.ts → src/core/prisma.ts
- `getNearbySpots()` --calls--> `getPrisma()`  [EXTRACTED]
  src/modules/spots/spots.service.ts → src/core/prisma.ts
- `getSpotById()` --calls--> `getPrisma()`  [EXTRACTED]
  src/modules/spots/spots.service.ts → src/core/prisma.ts
- `listSpots()` --calls--> `getPrisma()`  [EXTRACTED]
  src/modules/spots/spots.service.ts → src/core/prisma.ts

## Import Cycles
- None detected.

## Communities (156 total, 1 thin omitted)

### Community 0 - "spots.service.ts"
Cohesion: 0.07
Nodes (36): app, AppError, ForbiddenError, NotFoundError, UnauthorizedError, ValidationError, createPrisma(), getPrisma() (+28 more)

### Community 1 - "Prisma 7 Driver Adapter Implementation Guide"
Cohesion: 0.07
Nodes (29): Architecture Overview, Argument Mapping (input), Checklist, Column Type Inference, ColumnTypeEnum values, Conversion Helpers, Database-Specific Notes, E2E Tests (with PrismaClient) (+21 more)

### Community 2 - "RPC"
Cohesion: 0.07
Nodes (29): Client, Compile your code before using it (recommended), Cookies, Custom `fetch` method, Custom query serializer, File Uploads, Global Response, Headers (+21 more)

### Community 3 - "Model Queries"
Cohesion: 0.07
Nodes (27): aggregate, Aggregation Operations, Atomic operations, count, create, Create Operations, createMany, createManyAndReturn (+19 more)

### Community 4 - "Driver Adapters"
Cohesion: 0.07
Nodes (27): Accept self-signed certificates, After (v7), Available Adapters, Before (v6), Configuration, Connection Pool Configuration, Driver Adapters, Installation (+19 more)

### Community 5 - "Upgrade to Prisma ORM 7"
Cohesion: 0.08
Nodes (25): 1. Update package.json for ESM-first projects, 2. Update tsconfig.json, 3. Update schema.prisma, 4. Create prisma.config.ts, 5. Install a driver adapter (SQL providers only), 6. Update client instantiation, 7. Replace Prisma.validator with satisfies, 8. Run migrations and generate (+17 more)

### Community 6 - "Relation Queries"
Cohesion: 0.08
Nodes (23): Connect existing, Count Relations, Create or connect, Create with relations, Delete related, Disconnect, every, Filter counted relations (+15 more)

### Community 7 - "Removed Features"
Cohesion: 0.08
Nodes (23): Alternatives, Auto-generate after migrate, Auto-seed after migrate, Automatic Behaviors Removed, CLI Flags Removed, Client Middleware, Common Middleware Patterns, Custom counter with extensions (+15 more)

### Community 8 - "dependencies"
Cohesion: 0.08
Nodes (23): hono, dependencies, hono, @prisma/client, @prisma/extension-accelerate, @supabase/supabase-js, zod, devDependencies (+15 more)

### Community 9 - "Plugins"
Cohesion: 0.08
Nodes (24): Advanced Plugin Example, Basic Plugin Examples, Default Plugin, disableSSG, File Extension, Generate File, Hook Types, Input (+16 more)

### Community 10 - "honos/SKILL.md"
Cohesion: 0.09
Nodes (22): API, Available Helpers, ConnInfo Helper, Developer Experience, Env, Examples, Frequently Asked Questions, Helpers (+14 more)

### Community 11 - "JWT Authentication Helper"
Cohesion: 0.09
Nodes (23): <Badge type="danger" text="required" /> alg: [AlgorithmTypes](#supported-algorithmtypes), <Badge type="danger" text="required" /> payload: `unknown`, <Badge type="danger" text="required" /> secret: `string`, <Badge type="danger" text="required" /> secret: `string`, <Badge type="danger" text="required" /> token: `string`, <Badge type="danger" text="required" /> token: `string`, <Badge type="info" text="optional" /> alg: [AlgorithmTypes](#supported-algorithmtypes), <Badge type="info" text="optional" /> aud: `string | string[] | RegExp` (+15 more)

### Community 12 - "Raw Queries"
Cohesion: 0.09
Nodes (21): BigInt handling, Database-Specific Features, Date handling, Delete example, Dynamic table/column names, $executeRaw, Handling Results, Insert example (+13 more)

### Community 13 - "Language Middleware"
Cohesion: 0.09
Nodes (22): Advanced Configuration, Advanced Options, Basic Options, Basic Usage, Client Examples, Common Recipes, Cookie Configuration, Cookie Options (+14 more)

### Community 14 - "HonoRequest"
Cohesion: 0.09
Nodes (11): Dot notation, HonoRequest, matchedRoutes, method, Multiple files, Multiple files or fields with same name, parseBody(), path (+3 more)

### Community 15 - "Prisma CLI Reference"
Cohesion: 0.10
Nodes (20): Boundary: Compute, Bun Runtime, Client Generation, Command Categories, Current Command Behavior, Current Prisma CLI Setup, Database Operations, Environment Variables (+12 more)

### Community 16 - "Client Methods"
Cohesion: 0.10
Nodes (18): Add custom methods, Add model methods, Chain extensions, Client Methods, $connect(), $disconnect(), $extends(), Graceful shutdown (+10 more)

### Community 17 - "Filter Conditions and Operators"
Cohesion: 0.10
Nodes (20): AND (explicit), AND (implicit), Array Field Filters, Combined, Comparison, Equality, every, Filter Conditions and Operators (+12 more)

### Community 18 - "Query Options"
Cohesion: 0.10
Nodes (20): cursor, distinct, Filtered include, include, Include relation count, Multiple distinct fields, Negative take (reverse), Nested include (+12 more)

### Community 19 - "prisma db push"
Cohesion: 0.10
Nodes (19): Accept data loss, Basic push, Command, Common Patterns, Comparison with migrate dev, Examples, Follow-up Command, Force reset (+11 more)

### Community 20 - "prisma dev"
Cohesion: 0.10
Nodes (19): Background mode, Command, Configuration, Custom ports, Examples, Force remove (stops first), Instance Management, List all instances (+11 more)

### Community 21 - "prisma generate"
Cohesion: 0.10
Nodes (19): After schema changes, Basic generation, Bun Runtime, CI/CD pipeline, Command, Common Patterns, Compiler Build Tuning, Current Generator Behavior (+11 more)

### Community 22 - "prisma studio"
Cohesion: 0.10
Nodes (19): Command, Common Workflow, Custom port, Don't open browser, Edit Records, Examples, Features, Filter Data (+11 more)

### Community 23 - "Prisma Client API Reference"
Cohesion: 0.10
Nodes (19): Client Instantiation, Client Methods, Create records, Delete records, Filter Operators, Find records, How to Use, Model Query Methods (+11 more)

### Community 24 - "Troubleshooting Prisma Compute"
Cohesion: 0.10
Nodes (20): Accidental Prisma Postgres Provisioning, Auth Fails, Bun Entrypoint Missing, Compute Config Invalid, `create-prisma --yes` Did Not Deploy, Database Wiring or Schema Did Not Apply, Env Changes Did Not Apply, First Checks (+12 more)

### Community 25 - "Prisma Config"
Cohesion: 0.10
Nodes (19): After (v7) - prisma.config.ts, Basic Configuration, Before (v6) - schema.prisma, Configuration Options, Custom Config Path, datasource.directUrl, datasource.shadowDatabaseUrl, datasource.url (+11 more)

### Community 26 - "prisma migrate dev"
Cohesion: 0.11
Nodes (18): After schema changes, Command, Common Patterns, Create and apply migration, Create without applying, Examples, Follow-up Commands, Full workflow (+10 more)

### Community 27 - "Options"
Cohesion: 0.11
Nodes (19): <Badge type="danger" text="required" /> alg: `AsymmetricAlgorithm[]`, <Badge type="info" text="optional" /> allow_anon: `boolean`, <Badge type="info" text="optional" /> cookie: `string`, <Badge type="info" text="optional" /> headerName: `string`, <Badge type="info" text="optional" /> jwks_uri: `string` | `(c: Context) => Promise<string>`, <Badge type="info" text="optional" /> keys: `HonoJsonWebKey[] | (c: Context) => Promise<HonoJsonWebKey[]>`, <Badge type="info" text="optional" /> verification: `VerifyOptions`, <Badge type="info" text="optional" /> VerifyOptions.aud: `string | string[] | RegExp` (+11 more)

### Community 28 - "Context"
Cohesion: 0.11
Nodes (9): Context, ContextVariableMap, env, error, event, executionCtx, req, res (+1 more)

### Community 29 - "prisma db seed"
Cohesion: 0.11
Nodes (17): Best Practices, Command, Common Patterns, Common seed commands, Conditional seeding, Configuration, Current Workflow, Development reset (+9 more)

### Community 30 - "Prisma Compute"
Cohesion: 0.11
Nodes (18): 1. Command Verification, 2. Auth and Workspace Selection, 3. Framework Readiness, 4. Runtime Host and Port Binding, 5. Typed Compute Config, 6. Branch, Environment, and Database, 7. Deploy Operations, 8. SDK and API (+10 more)

### Community 31 - "Environment Variables"
Cohesion: 0.11
Nodes (17): 1. Install dotenv, 2. Import in prisma.config.ts, Application Code, Bun Users, CI/CD Considerations, Entry point, Environment Variables, Multiple .env Files (+9 more)

### Community 32 - "prisma db pull"
Cohesion: 0.12
Nodes (16): Basic introspection, Command, Examples, Force overwrite, Generated Schema Example, MongoDB Introspection, Options, Post-Introspection Cleanup (+8 more)

### Community 33 - "prisma init"
Cohesion: 0.12
Nodes (16): Add an example model, Basic initialization, Bun Runtime, Command, Examples, Generated Config (Bun), Generated Config (Node.js default), Generated Schema (+8 more)

### Community 34 - "prisma migrate deploy"
Cohesion: 0.12
Nodes (16): Basic deployment, Best Practices, Check status first, Command, Comparison with migrate dev, Configuration, Docker deployment, Error Handling (+8 more)

### Community 35 - "Prisma Database Setup"
Cohesion: 0.12
Nodes (16): Bun Runtime, Configuration Files, Driver Adapters, How to Use, MongoDB, MySQL, PostgreSQL, Prisma Client Setup (Required) (+8 more)

### Community 36 - "Prisma Accelerate Users"
Cohesion: 0.12
Nodes (16): 1. Keep your Accelerate URL, 2. Install Accelerate extension, 3. Configure prisma.config.ts, 4. Instantiate client with accelerateUrl, Caching with Accelerate, Correct v7 Setup for Accelerate, Edge Runtime, Important (+8 more)

### Community 37 - "ESM and CommonJS Support"
Cohesion: 0.12
Nodes (16): Browser-Safe Types, Bun, "Cannot use import statement outside a module", CommonJS Projects, "ERR_REQUIRE_ESM", ESM and CommonJS Support, ESM Projects, File Extensions (+8 more)

### Community 38 - "Constructor Options"
Cohesion: 0.12
Nodes (15): accelerateUrl (For Accelerate users), adapter (Required for the SQL provider workflow), Basic Instantiation, comments, Constructor Options, errorFormat, log, Log Events (+7 more)

### Community 39 - "Schema Changes"
Cohesion: 0.12
Nodes (15): 1. Provider name, 2. Output is required, 3. engineType changed, 4. moduleFormat is explicit when needed, After Schema Changes, Datasource Block, Example Output Paths, Generated Entrypoints (+7 more)

### Community 40 - "JSX"
Cohesion: 0.12
Nodes (16): Async Component, Context, ErrorBoundary <Badge style="vertical-align: middle;" type="warning" text="Experimental" />, Fragment, Inserting Raw HTML, Integration with html Middleware, JSX, Memoization (+8 more)

### Community 41 - "Transactions"
Cohesion: 0.13
Nodes (14): All or nothing, Best Practices, Handle errors, Interactive Transactions, Isolation levels, Keep transactions short, Nested Writes, OrThrow in Transactions (+6 more)

### Community 42 - "Workflow"
Cohesion: 0.13
Nodes (14): Error Handling, Prerequisites, Prisma Postgres Setup, Reference Files, Step 1: Authenticate, Step 2: List available regions, Step 3: Create a project with a database, Step 4: Create a named connection (optional) (+6 more)

### Community 43 - "Bun"
Cohesion: 0.13
Nodes (15): 1. Install Bun, 2.1. Setup a new project, 2.2. Setup an existing project, 2. Setup, 3. Hello World, 4. Run, Bun, Change port number (+7 more)

### Community 44 - "Deno"
Cohesion: 0.13
Nodes (15): 1. Install Deno, 2. Setup, 3. Hello World, 4. Run, Change port number, Deno, Deno Deploy, `mimes` (+7 more)

### Community 45 - "Cloudflare Workers"
Cohesion: 0.13
Nodes (15): 1. Setup, 2. Hello World, 3. Run, 4. Deploy, Bindings, Change port number, Cloudflare Workers, Deploy from GitHub Actions (+7 more)

### Community 46 - "Cloudflare Pages"
Cohesion: 0.13
Nodes (15): 1. Setup, 2. Hello World, 3. Run, 4. Deploy, Accessing `EventContext`, Bindings, Client-side, Cloudflare Pages (+7 more)

### Community 47 - "Options"
Cohesion: 0.13
Nodes (15): <Badge type="danger" text="required" /> password: `string`, <Badge type="danger" text="required" /> username: `string`, <Badge type="info" text="optional" /> hashFunction: `Function`, <Badge type="info" text="optional" /> invalidUserMessage: `string | object | MessageFunction`, <Badge type="info" text="optional" /> onAuthSuccess: `(c: Context, username: string) => void | Promise<void>`, <Badge type="info" text="optional" /> realm: `string`, <Badge type="info" text="optional" /> ...users: `{ username: string, password: string }[]`, <Badge type="info" text="optional" /> verifyUser: `(username: string, password: string, c: Context) => boolean | Promise<boolean>` (+7 more)

### Community 48 - "Prisma Compute Framework Readiness"
Cohesion: 0.14
Nodes (14): Astro, Bun, Elysia, and Plain Source Servers, CLI-First Model, CLI Matrix, Custom Build Artifacts, Hono, NestJS, Next.js (+6 more)

### Community 49 - "MongoDB Setup"
Cohesion: 0.14
Nodes (13): 1. Schema Configuration, 2. Environment Variable, Common Issues, Current Verification Notes, Driver Adapters, ID Field Requirement, "Invalid ObjectID", Migrations vs Introspection (+5 more)

### Community 50 - "Core Workflows"
Cohesion: 0.14
Nodes (13): 1. Console-first workflow, 2. Quick provisioning with create-db, 2b. Persistent databases with the Platform CLI, 3. Link an existing local project, 4. Programmatic provisioning with Management API, 5. Type-safe integration with Management API SDK, Core Workflows, How to Use (+5 more)

### Community 51 - "Node.js"
Cohesion: 0.14
Nodes (14): 1. Setup, 2. Hello World, 3. Run, Access the raw Node.js APIs, Building & Deployment, Change port number, Dockerfile, encrypted http2 (+6 more)

### Community 52 - "<Badge type="info" text="optional" /> verification: `VerifyOptions`"
Cohesion: 0.14
Nodes (14): <Badge type="danger" text="required" /> alg: `string`, <Badge type="danger" text="required" /> secret: `string`, <Badge type="info" text="optional" /> cookie: `string`, <Badge type="info" text="optional" /> headerName: `string`, <Badge type="info" text="optional" /> verification: `VerifyOptions`, <Badge type="info" text="optional" /> VerifyOptions.aud: `string | string[] | RegExp`, <Badge type="info" text="optional" /> VerifyOptions.exp: `boolean`, <Badge type="info" text="optional" /> VerifyOptions.iat: `boolean` (+6 more)

### Community 53 - "Routing"
Cohesion: 0.14
Nodes (14): Base path, Basic, Chained route, Grouping, Grouping ordering, Grouping without changing base, Including slashes, Optional Parameter (+6 more)

### Community 54 - "prisma db execute"
Cohesion: 0.15
Nodes (12): Command, Configuration, Current Option Surface, Examples, Execute from file, Execute from stdin, Execute `migrate diff` output, Limitations (+4 more)

### Community 55 - "Prisma Platform CLI App Deploy"
Cohesion: 0.15
Nodes (13): Agent Skill Installation, Auth and Project Binding, Build and Run Locally, Database and Env, Deploy, Deployment Story: GitHub vs CLI, Operations, Output Handling (+5 more)

### Community 56 - "MySQL Setup"
Cohesion: 0.15
Nodes (12): 1. Schema Configuration, 2. Config Configuration, 3. Environment Variable, Common Issues, Connection String Format, Driver Adapter, JSON Support, MySQL Setup (+4 more)

### Community 57 - "management-api"
Cohesion: 0.15
Nodes (12): API exploration, Authentication methods, Base URL, Common endpoints, management-api, Notes, OAuth flow summary, Priority (+4 more)

### Community 58 - "Global Constraints"
Cohesion: 0.15
Nodes (12): Global Constraints, Modul Spots — Phase 1 MVP Implementation Plan, Task 10: Verify Dev Server, Task 1: Fix Entrypoint & Create Directory Structure, Task 2: Install Dependencies & Initialize Prisma, Task 3: Create Core Utils, Task 4: Shared Middleware (Auth + Admin Guard), Task 5: Auth Routes (Google OAuth) (+4 more)

### Community 59 - "Options"
Cohesion: 0.15
Nodes (13): <Badge type="danger" text="required" /> token: `string` | `string[]`, <Badge type="info" text="optional" /> hashFunction: `Function`, <Badge type="info" text="optional" /> headerName: `string`, <Badge type="info" text="optional" /> invalidAuthenticationHeader: `object`, <Badge type="info" text="optional" /> invalidToken: `object`, <Badge type="info" text="optional" /> noAuthenticationHeader: `object`, <Badge type="info" text="optional" /> prefix: `string`, <Badge type="info" text="optional" /> realm: `string` (+5 more)

### Community 60 - "HEAD Request Best Practices"
Cohesion: 0.15
Nodes (13): Best Practices, Building a larger application, Don't make "Controllers" when possible, `factory.createHandlers()` in `hono/factory`, HEAD Request Best Practices, If you want to use RPC features, Notes, Performance Considerations (+5 more)

### Community 61 - "css Helper"
Cohesion: 0.15
Nodes (13): `classNameSlug`, `createCssContext` <Badge style="vertical-align: middle;" type="warning" text="Experimental" />, `css` <Badge style="vertical-align: middle;" type="warning" text="Experimental" />, css Helper, `cx` <Badge style="vertical-align: middle;" type="warning" text="Experimental" />, Extending, Global styles, Import (+5 more)

### Community 62 - "Cookie Helper"
Cohesion: 0.15
Nodes (13): Cookie Generation, Cookie Helper, `deleteCookie`, Following the best practices, `generateCookie`, `generateSignedCookie`, Import, Options (+5 more)

### Community 63 - "prisma migrate diff"
Cohesion: 0.17
Nodes (11): Check for drift (CI), Command, Create baseline migration, Examples, Generate SQL for a schema change, Options, prisma migrate diff, Review pending migrations (+3 more)

### Community 64 - "prisma migrate reset"
Cohesion: 0.17
Nodes (11): Basic reset, Command, Configuration, Examples, Follow-up Steps, Force reset (CI/Automation), Options, prisma migrate reset (+3 more)

### Community 65 - "PostgreSQL Setup"
Cohesion: 0.17
Nodes (11): 1. Schema Configuration, 2. Config Configuration, 3. Environment Variable, "Authentication failed", "Can't reach database server", Common Issues, Connection String Format, Driver Adapter (+3 more)

### Community 66 - "Prisma Postgres Setup"
Cohesion: 0.17
Nodes (11): 1. Schema Configuration, 2. Config Configuration, Connection String, Driver Adapter, Edge/serverless option, Features, Overview, Prisma Postgres Setup (+3 more)

### Community 67 - "SQLite Setup"
Cohesion: 0.17
Nodes (11): 1. Schema Configuration, 2. Config Configuration, 3. Environment Variable, Common Issues, Connection String Format, "Database file not found", Driver Adapter, Limitations (+3 more)

### Community 68 - "Third-party Middleware"
Cohesion: 0.17
Nodes (12): Authentication, Development, Internationalization, Monitoring / Tracing, OpenAPI, Queue / Job Processing, Server / Adapter, Third-party Middleware (+4 more)

### Community 69 - "Options"
Cohesion: 0.17
Nodes (12): <Badge type="info" text="optional" /> allowHeaders: `string[]`, <Badge type="info" text="optional" /> allowMethods: `string[]` | `(origin:string, c:Context) => string[]`, <Badge type="info" text="optional" /> credentials: `boolean`, <Badge type="info" text="optional" /> exposeHeaders: `string[]`, <Badge type="info" text="optional" /> maxAge: `number`, <Badge type="info" text="optional" /> origin: `string` | `string[]` | `(origin:string, c:Context) => string`, CORS Middleware, Environment-dependent CORS configuration (+4 more)

### Community 70 - "Hono"
Cohesion: 0.17
Nodes (12): Developer Experience, Features, Hono, Hono in 1 minute, Lightweight, Middleware & Helpers, Multiple routers, Quick Start (+4 more)

### Community 71 - "SQL Server Setup"
Cohesion: 0.18
Nodes (10): 1. Schema Configuration, 2. Config Configuration, 3. Environment Variable, Common Issues, Connection String Format, Driver Adapter, "Login failed for user", Prerequisites (+2 more)

### Community 72 - "create-db-cli"
Cohesion: 0.18
Nodes (10): Command discovery (`--help`), Commands, Common patterns, create-db-cli, `create` options, Lifecycle and claim flow, Priority, Programmatic usage (library API) (+2 more)

### Community 73 - "api-basics"
Cohesion: 0.18
Nodes (10): api-basics, Base URL, Collection, Error codes by HTTP status, Error Responses, Pagination, Resource ID Prefixes, Response Envelope (+2 more)

### Community 74 - "Spec: Modul Spots — Phase 1 MVP"
Cohesion: 0.18
Nodes (10): Auth Flow, Data Model (Prisma), Entrypoint Fix, New Dependencies, Prisma Accelerate Setup, Project Structure, Response Format, Spec: Modul Spots — Phase 1 MVP (+2 more)

### Community 75 - "App - Hono"
Cohesion: 0.18
Nodes (7): App - Hono, Error Handling, Generics, Methods, Not Found, router option, strict mode

### Community 76 - "Options"
Cohesion: 0.18
Nodes (11): <Badge type="danger" text="required" /> cacheName: `string` | `(c: Context) => string` | `Promise<string>`, <Badge type="info" text="optional" /> cacheableStatusCodes: `number[]`, <Badge type="info" text="optional" /> cacheControl: `string`, <Badge type="info" text="optional" /> keyGenerator: `(c: Context) => string | Promise<string>`, <Badge type="info" text="optional" /> onCacheNotAvailable: `(() => void | Promise<void>)` | `false`, <Badge type="info" text="optional" /> vary: `string` | `string[]`, <Badge type="info" text="optional" /> wait: `boolean`, Cache Middleware (+3 more)

### Community 77 - "Options"
Cohesion: 0.18
Nodes (11): <Badge type="info" text="optional" /> autoEnd: `boolean`, <Badge type="info" text="optional" /> crossOrigin: `boolean` | `string` | `(c: Context) => boolean | string`, <Badge type="info" text="optional" /> enabled: `boolean` | `(c: Context) => boolean`, <Badge type="info" text="optional" /> total: `boolean`, <Badge type="info" text="optional" /> totalDescription: `boolean`, Conditionally enabled, Import, Options (+3 more)

### Community 78 - "Route Helper"
Cohesion: 0.18
Nodes (11): `basePath()`, `baseRoutePath()`, Basic route information, Import, `matchedRoutes()`, Route Helper, `routePath()`, Usage (+3 more)

### Community 79 - "compilerOptions"
Cohesion: 0.18
Nodes (10): ESNext, compilerOptions, jsx, jsxImportSource, lib, module, moduleResolution, skipLibCheck (+2 more)

### Community 80 - "prisma format"
Cohesion: 0.20
Nodes (9): Behavior, Command, Examples, Format default schema, Format specific schema, Options, prisma format, Use in Editor (+1 more)

### Community 81 - "prisma migrate resolve"
Cohesion: 0.20
Nodes (9): Command, Examples, Mark as Applied (Baselining), Mark as Rolled Back (Fixing Failures), Options, prisma migrate resolve, References, Use Cases (+1 more)

### Community 82 - "prisma validate"
Cohesion: 0.20
Nodes (9): Command, Common Errors, Examples, Options, prisma validate, Use in CI, Validate default schema, Validate specific schema (+1 more)

### Community 83 - "CockroachDB Setup"
Cohesion: 0.20
Nodes (9): 1. Schema Configuration, 2. Config Configuration, 3. Environment Variable, CockroachDB Setup, Common Issues, Driver Adapter, ID Generation, Prerequisites (+1 more)

### Community 84 - "decision-stay-or-migrate"
Cohesion: 0.20
Nodes (9): Bad, Blocker checks before migrating, decision-stay-or-migrate, Good, Priority, References, Stay-on-v6 hygiene, The facts the decision rests on (+1 more)

### Community 85 - "console-and-connections"
Cohesion: 0.20
Nodes (9): Adapter choices, Connection setup, console-and-connections, Console workflow, Linking an existing project, Local Studio, Priority, References (+1 more)

### Community 86 - "Getting Started"
Cohesion: 0.20
Nodes (10): Adapter, Getting Started, Hello World, Next step, Request and Response, Return HTML, Return JSON, Return raw Response (+2 more)

### Community 87 - "JSX Renderer Middleware"
Cohesion: 0.20
Nodes (10): <Badge type="info" text="optional" /> docType: `boolean` | `string`, <Badge type="info" text="optional" /> stream: `boolean` | `Record<string, string>`, Extending `ContextRenderer`, Function-based Options, Import, JSX Renderer Middleware, Nested Layouts, Options (+2 more)

### Community 88 - "Request ID Middleware"
Cohesion: 0.20
Nodes (10): <Badge type="info" text="optional" /> generator: `(c: Context) => string`, <Badge type="info" text="optional" /> headerName: `string`, <Badge type="info" text="optional" /> limitLength: `number`, Import, Options, Platform specific links, Platform specific Request IDs, Request ID Middleware (+2 more)

### Community 89 - "Middleware"
Cohesion: 0.20
Nodes (10): Built-in Middleware, Context access inside Middleware arguments, Custom Middleware, Definition of Middleware, Execution order, Extending the Context in Middleware, Middleware, Modify the Response After Next (+2 more)

### Community 90 - "fomo-api"
Cohesion: 0.22
Nodes (8): Architecture, Commands, Environment, fomo-api, graphify, Known Quirks, OpenCode, Stack

### Community 91 - "prisma migrate status"
Cohesion: 0.22
Nodes (8): Check status, Command, Examples, Exit Codes, Options, prisma migrate status, What It Does, When to Use

### Community 92 - "Prisma Compute Config"
Cohesion: 0.22
Nodes (9): App Fields, Basic Shape, Database Scope, File Names and Discovery, Generating a Config with `init`, Monorepos and Multi-App Repos, Precedence, Prisma Compute Config (+1 more)

### Community 93 - "create-prisma Compute Flow"
Cohesion: 0.22
Nodes (9): Addon Notes, Basic Commands, create-prisma Compute Flow, Failure Handling, Generated Deploy Script, Generated Files to Preserve, PostgreSQL and Database Behavior, Reference (+1 more)

### Community 94 - "migrations-mapping"
Cohesion: 0.22
Nodes (8): Bad, Good, migrations-mapping, Priority, Prisma Next: first-class, contract-driven migrations (Mongo included), References, v6: `db push` only, Why It Matters

### Community 95 - "schema-contract-mapping"
Cohesion: 0.22
Nodes (8): Bad, Environment requirements, Good, Priority, References, schema-contract-mapping, The mapping, Why It Matters

### Community 96 - "Prisma MongoDB Upgrade Path"
Cohesion: 0.22
Nodes (8): Decision table, Hand-off rule, If staying on v6: hygiene (a deliberate stay, not neglect), Prisma MongoDB Upgrade Path, Reference files, The decision, up front, The version landscape, Verified against

### Community 97 - "management-api-sdk"
Cohesion: 0.22
Nodes (8): Full SDK (OAuth + refresh), Install, management-api-sdk, OAuth SDK flow, Priority, References, Simple client (existing token), Why It Matters

### Community 98 - "endpoints"
Cohesion: 0.22
Nodes (8): Create connection, Create project (with database), Delete database, Delete project, endpoints, Get database, List projects, List regions

### Community 99 - "Client Components"
Cohesion: 0.22
Nodes (9): 1. A very simple example, 2. Using `viewTransition()` with `keyframes()`, 3. Using `useViewTransition`, Client Components, Counter example, Hooks compatible with React, `render()`, `startViewTransition()` family (+1 more)

### Community 100 - "AWS Lambda"
Cohesion: 0.22
Nodes (9): 1. Setup, 2. Hello World, 3. Deploy, Access AWS Lambda Object, Access RequestContext, AWS Lambda, Before v3.10.0 (deprecated), Lambda response streaming (+1 more)

### Community 101 - "Options"
Cohesion: 0.22
Nodes (9): `AcceptHeader` type, `accepts()`, Accepts Helper, <Badge type="danger" text="required" /> default: `string`, <Badge type="danger" text="required" /> header: `AcceptHeader`, <Badge type="danger" text="required" /> supports: `string[]`, <Badge type="info" text="optional" /> match: `(accepts: Accept[], config: acceptsConfig) => string`, Import (+1 more)

### Community 102 - "html Helper"
Cohesion: 0.22
Nodes (9): Act as functional component, `html`, html Helper, Import, Insert snippets into JSX, `raw()`, Receives props and embeds values, Tips (+1 more)

### Community 103 - "Method Override Middleware"
Cohesion: 0.22
Nodes (9): <Badge type="danger" text="required" /> app: `Hono`, <Badge type="info" text="optional" /> form: `string`, <Badge type="info" text="optional" /> header: `boolean`, <Badge type="info" text="optional" /> query: `boolean`, For example, Import, Method Override Middleware, Options (+1 more)

### Community 104 - "Create-hono"
Cohesion: 0.22
Nodes (9): Commonly used arguments, Create-hono, Example flows, Links & references, Minimal, interactive, Non-interactive, pick template and package manager, Passing arguments:, Troubleshooting & tips (+1 more)

### Community 105 - "Validation"
Cohesion: 0.22
Nodes (9): Manual validator, Multiple validators, Standard Schema Validator Middleware, Validation, With ArkType, With Valibot, With Zod, With Zod (+1 more)

### Community 106 - "prisma mcp"
Cohesion: 0.25
Nodes (7): Command, Notes, prisma mcp, References, Typical Use Cases, Usage, What It Does

### Community 107 - "client-api-mapping"
Cohesion: 0.25
Nodes (7): Bad, client-api-mapping, Good, Priority, References, The mapping, Why It Matters

### Community 108 - "Service Tokens"
Cohesion: 0.25
Nodes (7): auth, Creating a service token, OAuth 2.0 (for user-scoped access), Security practices, Service Tokens, Token scope, Using a service token

### Community 109 - "Supabase Edge Functions"
Cohesion: 0.25
Nodes (8): 1. Setup, 2. Hello World, 3. Run, 4. Deploy, Adding an Edge Function, Creating a New Project, Prerequisites, Supabase Edge Functions

### Community 110 - "Factory Helper"
Cohesion: 0.25
Nodes (8): <Badge type="info" text="optional" /> defaultAppOptions: `HonoOptions`, `createFactory()`, `createMiddleware()`, `factory.createApp()`, `factory.createHandlers()`, Factory Helper, Import, Options

### Community 111 - "Logger Middleware"
Cohesion: 0.25
Nodes (8): <Badge type="info" text="optional" /> fn: `PrintFunc(str: string, ...rest: string[])`, Example, Import, Logger Middleware, Logging Details, Options, PrintFunc, Usage

### Community 112 - "ETag Middleware"
Cohesion: 0.25
Nodes (8): <Badge type="info" text="optional" /> generateDigest: `(body: Uint8Array) => ArrayBuffer | Promise<ArrayBuffer>`, <Badge type="info" text="optional" /> retainedHeaders: `string[]`, <Badge type="info" text="optional" /> weak: `boolean`, ETag Middleware, Import, Options, The retained headers, Usage

### Community 113 - "WebSocket Helper"
Cohesion: 0.25
Nodes (8): Bun with JSX, Examples, Import, Node.js, RPC-mode, Server and Client, `upgradeWebSocket()`, WebSocket Helper

### Community 114 - "Secure Headers Middleware"
Cohesion: 0.25
Nodes (8): Import, Middleware Conflict, `nonce` attribute, Secure Headers Middleware, Setting Content-Security-Policy, Setting Permission-Policy, Supported Options, Usage

### Community 115 - "prisma debug"
Cohesion: 0.29
Nodes (6): Command, Example Output, Options, prisma debug, What It Does, When to Use

### Community 117 - "SDK and API Automation"
Cohesion: 0.29
Nodes (7): Compute SDK, Management API Concepts, Prefer the CLI for App Workflows, Regions, SDK and API Automation, SDK Build Strategies, Secrets and Redaction

### Community 118 - "Prisma Client Setup"
Cohesion: 0.29
Nodes (6): 1. Install dependencies, 2. Add generator block, 3. Generate Prisma Client, 4. Instantiate Prisma Client, 5. Use a single instance, Prisma Client Setup

### Community 119 - "verify-cutover-checklist"
Cohesion: 0.29
Nodes (6): Checklist, Ground rules, Priority, References, verify-cutover-checklist, Why It Matters

### Community 120 - "Prisma 7 Client Instantiation"
Cohesion: 0.29
Nodes (6): Basic instantiation, Common mistakes, Key rules, Prisma 7 Client Instantiation, Required packages, Usage in application code

### Community 121 - "WebAssembly (w/ WASI)"
Cohesion: 0.29
Nodes (7): 1. Setup, 2. Set up WIT interface & dependencies, 3. Hello Wasm, 4. Build, 5. Run, More information, WebAssembly (w/ WASI)

### Community 122 - "Cloudflare Workers + Vite"
Cohesion: 0.29
Nodes (7): 1. Setup, 2. Hello World, 3. Run, 4. Deploy, Bindings, Client-side, Cloudflare Workers + Vite

### Community 123 - "Body Limit Middleware"
Cohesion: 0.29
Nodes (7): <Badge type="danger" text="required" /> maxSize: `number`, <Badge type="info" text="optional" /> onError: `OnError`, Body Limit Middleware, Import, Options, Usage, Usage with Bun for large requests

### Community 124 - "Trailing Slash Middleware"
Cohesion: 0.29
Nodes (7): <Badge type="info" text="optional" /> alwaysRedirect: `boolean`, <Badge type="info" text="optional" /> skip: `(path: string) => boolean`, Import, Note, Options, Trailing Slash Middleware, Usage

### Community 125 - "Compress Middleware"
Cohesion: 0.29
Nodes (7): <Badge type="info" text="optional" /> contentTypeFilter: `RegExp` | `(contentType: string) => boolean`, <Badge type="info" text="optional" /> encoding: `'gzip'` | `'deflate'`, <Badge type="info" text="optional" /> threshold: `number`, Compress Middleware, Import, Options, Usage

### Community 126 - "Options"
Cohesion: 0.29
Nodes (7): <Badge type="info" text="optional" /> force: `boolean`, <Badge type="info" text="optional" /> query: `string`, <Badge type="info" text="optional" /> space: `number`, Import, Options, Pretty JSON Middleware, Usage

### Community 127 - "Benchmarks"
Cohesion: 0.29
Nodes (7): Benchmarks, Bun, Cloudflare Workers, Deno, On Bun, On Node.js, Routers

### Community 128 - "Hono Stacks"
Cohesion: 0.29
Nodes (7): Client, Hono Stacks, RPC, Sharing the Types, Validation with Zod, With React, Writing API

### Community 129 - "IP Restriction Middleware"
Cohesion: 0.29
Nodes (7): Error handling, Import, IP Restriction Middleware, IPv4, IPv6, Rules, Usage

### Community 130 - "Azure Functions"
Cohesion: 0.33
Nodes (6): 1. Install CLI, 2. Setup, 3. Hello World, 4. Run, 5. Deploy, Azure Functions

### Community 131 - "Google Cloud Run"
Cohesion: 0.33
Nodes (6): 1. Install the CLI, 2. Project setup, 3. Hello World, 4. Deploy, Changing runtimes, Google Cloud Run

### Community 132 - "Fastly Compute"
Cohesion: 0.33
Nodes (6): 1. Setup, 2. Hello World, 3. Run, 4. Deploy, Bindings, Fastly Compute

### Community 133 - "Netlify"
Cohesion: 0.33
Nodes (6): 1. Setup, 2. Hello World, 3. Run, 4. Deploy, `Context`, Netlify

### Community 134 - "Next.js"
Cohesion: 0.33
Nodes (6): 1. Setup, 2. Hello World, 3. Run, 4. Deploy, Next.js, Pages Router

### Community 135 - "Vercel"
Cohesion: 0.33
Nodes (6): 1. Setup, 2. Hello World, 3. Run, 4. Deploy, Further reading, Vercel

### Community 136 - "Adapter Helper"
Cohesion: 0.33
Nodes (6): Adapter Helper, Available Runtimes Keys, `env()`, `getRuntimeKey()`, Import, Specify the runtime

### Community 137 - "Dev Helper"
Cohesion: 0.33
Nodes (6): <Badge type="info" text="optional" /> colorize: `boolean`, <Badge type="info" text="optional" /> verbose: `boolean`, Dev Helper, `getRouterName()`, Options, `showRoutes()`

### Community 138 - "CSRF Protection"
Cohesion: 0.33
Nodes (6): <Badge type="info" text="optional" /> origin: `string` | `string[]` | `Function`, <Badge type="info" text="optional" /> secFetchSite: `string` | `string[]` | `Function`, CSRF Protection, Import, Options, Usage

### Community 139 - "Throwing HTTPExceptions"
Cohesion: 0.33
Nodes (6): Cause, Custom Message, Custom Response, Handling HTTPExceptions, HTTPException, Throwing HTTPExceptions

### Community 140 - "Usage"
Cohesion: 0.33
Nodes (6): Combine Middleware, every, except, Import, some, Usage

### Community 141 - "`proxy()`"
Cohesion: 0.33
Nodes (6): Connection Header Processing, Examples, Import, `proxy()`, Proxy Helper, `ProxyFetch`

### Community 142 - "Streaming Helper"
Cohesion: 0.33
Nodes (6): Error Handling, Import, `stream()`, Streaming Helper, `streamSSE()`, `streamText()`

### Community 143 - "Routers"
Cohesion: 0.33
Nodes (6): LinearRouter, PatternRouter, RegExpRouter, Routers, SmartRouter, TrieRouter

### Community 144 - "Hono"
Cohesion: 0.40
Nodes (4): Docs, Examples, Hono, Optional

### Community 145 - "Alibaba Cloud Function Compute"
Cohesion: 0.40
Nodes (5): 1. Setup, 2. Hello World, 3. Setup serverless-devs, 4. Deploy, Alibaba Cloud Function Compute

### Community 146 - "Lambda@Edge"
Cohesion: 0.40
Nodes (5): 1. Setup, 2. Hello World, 3. Deploy, Callback, Lambda@Edge

### Community 147 - "Service Worker"
Cohesion: 0.40
Nodes (5): 1. Setup, 2. Hello World, 3. Run, Service Worker, Using `fire()`

### Community 148 - "Presets"
Cohesion: 0.40
Nodes (5): `hono`, `hono/quick`, `hono/tiny`, Presets, Which preset should I use?

### Community 149 - "Timeout Middleware"
Cohesion: 0.40
Nodes (5): Import, Middleware Conflicts, Notes, Timeout Middleware, Usage

### Community 150 - "opencode.json"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

### Community 151 - "Context Storage Middleware"
Cohesion: 0.50
Nodes (4): Context Storage Middleware, Import, tryGetContext, Usage

### Community 152 - "Miscellaneous"
Cohesion: 0.50
Nodes (4): Contributing, Miscellaneous, Other Resources, Sponsoring

## Knowledge Gaps
- **1400 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `name`, `type`, `dev` (+1395 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SSG Helper` connect `Plugins` to `honos/SKILL.md`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `Language Middleware` connect `Language Middleware` to `honos/SKILL.md`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `Method Override Middleware` connect `Method Override Middleware` to `honos/SKILL.md`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `name` to the rest of the system?**
  _1400 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `spots.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07058001397624039 - nodes in this community are weakly interconnected._
- **Should `Prisma 7 Driver Adapter Implementation Guide` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `RPC` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._