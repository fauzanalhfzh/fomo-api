# Modul Spots — Phase 1 MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Modul Spots (Phase 1 MVP) — 6 endpoints for spot CRUD, nearby search, and tag-based filtering — with Google OAuth via Supabase, Prisma + Accelerate, and Cloudflare Workers deployment.

**Architecture:** Layered feature modules in `src/modules/spots/` with route handlers, service layer, and Zod validation. Auth middleware in `shared/middleware/`. Prisma client via Accelerate adapter in `core/prisma.ts`.

**Tech Stack:** Bun (dev), Hono v4, Prisma + Accelerate, Supabase (PostgreSQL + Auth), Zod, Cloudflare Workers (prod)

## Global Constraints

- All new files in `src/` follow ES Module syntax (`import`/`export`)
- `app.ts` stays thin — only route mounting and middleware registration
- Business logic lives in `services/`, not routes
- Auth middleware always runs before admin guard
- Soft delete via `isActive` boolean field
- Response format: `{ data: ... }` for single, `{ data: [...], meta: { page, limit, total } }` for lists
- Error format: `{ error: { code: string, message: string } }`

---

### Task 1: Fix Entrypoint & Create Directory Structure

**Files:**
- Create: `src/index.ts`
- Modify: `wrangler.jsonc`
- Create: `src/modules/auth/`
- Create: `src/modules/spots/`
- Create: `src/core/`
- Create: `src/shared/middleware/`
- Skip: `prisma/` (created by prisma init)

- [ ] **Step 1: Create `src/index.ts`**

```ts
export { default } from './app'
```

- [ ] **Step 2: Update `wrangler.jsonc`**

Verify `wrangler.jsonc` already points to `src/index.ts`.

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "fomo-api",
  "main": "src/index.ts",
  "compatibility_date": "2026-07-22"
}
```

- [ ] **Step 3: Create directories**

```bash
mkdir -p src/modules/auth src/modules/spots src/core src/shared/middleware
```

- [ ] **Step 4: Verify dev server starts**

Run: `bun run src/server.ts`
Expected: `Listening on http://localhost:8787`

---

### Task 2: Install Dependencies & Initialize Prisma

**Files:**
- Modify: `package.json`
- Create: `prisma/schema.prisma`
- Create: `.env`

- [ ] **Step 1: Install dependencies**

```bash
cd /mnt/c/Users/LENOVO/Documents/Development/fomo-api
bun add @prisma/client @prisma/extension-accelerate @supabase/supabase-js zod
bun add -d prisma
```

- [ ] **Step 2: Initialize Prisma**

```bash
bunx prisma init --datasource-provider postgresql
```

- [ ] **Step 3: Write `prisma/schema.prisma`**

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id
  email     String?  @unique
  alias     String?
  avatarUrl String?
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  reviews Review[]
}

model Spot {
  id          String   @id @default(cuid())
  name        String
  description String?
  address     String
  latitude    Float
  longitude   Float
  imageUrl    String?
  fomoScore   Float    @default(0)
  isActive    Boolean  @default(true)
  claimedById String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  claimedBy User?      @relation(fields: [claimedById], references: [id])
  tags      SpotTag[]
  reviews   Review[]
}

model Tag {
  id        String   @id @default(cuid())
  name      String   @unique
  createdAt DateTime @default(now())

  spots SpotTag[]
}

model SpotTag {
  spotId String
  tagId  String
  spot   Spot @relation(fields: [spotId], references: [id], onDelete: Cascade)
  tag    Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([spotId, tagId])
}

model Review {
  id        String   @id @default(cuid())
  rating    Int
  content   String?
  userId    String
  spotId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id])
  spot Spot @relation(fields: [spotId], references: [id])
}
```

- [ ] **Step 4: Add `DATABASE_URL` to `.env`**

```
DATABASE_URL="prisma://accelerate..."
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

- [ ] **Step 5: Generate Prisma client**

```bash
bunx prisma generate
```

---

### Task 3: Create Core Utils

**Files:**
- Create: `src/core/prisma.ts`
- Create: `src/core/supabase.ts`
- Create: `src/core/errors.ts`

- [ ] **Step 1: Create `src/core/prisma.ts`**

```ts
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

export const prisma = new PrismaClient().$extends(withAccelerate())
```

- [ ] **Step 2: Create `src/core/supabase.ts`**

```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export type { User as SupabaseUser } from '@supabase/supabase-js'
```

- [ ] **Step 3: Create `src/core/errors.ts`**

```ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, 'NOT_FOUND', message)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, 'UNAUTHORIZED', message)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, 'FORBIDDEN', message)
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(400, 'VALIDATION_ERROR', message)
  }
}
```

---

### Task 4: Shared Middleware (Auth + Admin Guard)

**Files:**
- Create: `src/shared/middleware/auth.ts`

- [ ] **Step 1: Create `src/shared/middleware/auth.ts`**

```ts
import { Context, Next } from 'hono'
import { supabaseAdmin } from '../../core/supabase'
import { prisma } from '../../core/prisma'
import { UnauthorizedError, ForbiddenError } from '../../core/errors'

export interface AuthUser {
  id: string
  email: string | null
  alias: string | null
  avatarUrl: string | null
  role: string
}

export async function authMiddleware(c: Context, next: Next) {
  const header = c.req.header('Authorization')
  if (!header?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header')
  }

  const token = header.slice(7)
  const { data, error } = await supabaseAdmin.auth.getUser(token)

  if (error || !data.user) {
    throw new UnauthorizedError('Invalid or expired token')
  }

  let user = await prisma.user.findUnique({
    where: { id: data.user.id },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: data.user.id,
        email: data.user.email,
        alias: data.user.user_metadata?.name as string ?? null,
        avatarUrl: data.user.user_metadata?.avatar_url as string ?? null,
      },
    })
  }

  c.set('user', {
    id: user.id,
    email: user.email,
    alias: user.alias,
    avatarUrl: user.avatarUrl,
    role: user.role,
  } satisfies AuthUser)

  await next()
}

export function adminGuard(c: Context, next: Next) {
  const user: AuthUser = c.get('user')
  if (user.role !== 'admin') {
    throw new ForbiddenError('Admin access required')
  }
  return next()
}

export function optionalAuthMiddleware(c: Context, next: Next) {
  const header = c.req.header('Authorization')
  if (!header?.startsWith('Bearer ')) {
    c.set('user', null)
    return next()
  }
  return authMiddleware(c, next)
}
```

---

### Task 5: Auth Routes (Google OAuth)

**Files:**
- Create: `src/modules/auth/auth.schema.ts`
- Create: `src/modules/auth/auth.routes.ts`

- [ ] **Step 1: Create `src/modules/auth/auth.schema.ts`**

```ts
import { z } from 'zod'

export const googleLoginSchema = z.object({
  id_token: z.string().min(1, 'ID token is required'),
})

export const refreshSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required'),
})
```

- [ ] **Step 2: Create `src/modules/auth/auth.routes.ts`**

```ts
import { Hono } from 'hono'
// Zod validation done inline in route handlers
import { supabaseAdmin } from '../../core/supabase'
import { prisma } from '../../core/prisma'
import { googleLoginSchema, refreshSchema } from './auth.schema'
import { AppError } from '../../core/errors'

const auth = new Hono()

auth.post('/google', async (c) => {
  const body = await c.req.json()
  const parsed = googleLoginSchema.parse(body)

  const { data, error } = await supabaseAdmin.auth.signInWithIdToken({
    provider: 'google',
    token: parsed.id_token,
  })

  if (error || !data.user) {
    throw new AppError(401, 'AUTH_FAILED', 'Google authentication failed')
  }

  const supabaseUser = data.user

  let user = await prisma.user.findUnique({
    where: { id: supabaseUser.id },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        alias: supabaseUser.user_metadata?.name as string ?? null,
        avatarUrl: supabaseUser.user_metadata?.avatar_url as string ?? null,
      },
    })
  }

  return c.json({
    data: {
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      user: {
        id: user.id,
        email: user.email,
        alias: user.alias,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    },
  })
})

auth.post('/refresh', async (c) => {
  const body = await c.req.json()
  const parsed = refreshSchema.parse(body)

  const { data, error } = await supabaseAdmin.auth.refreshSession({
    refresh_token: parsed.refresh_token,
  })

  if (error) {
    throw new AppError(401, 'REFRESH_FAILED', 'Token refresh failed')
  }

  return c.json({
    data: {
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
    },
  })
})

auth.post('/logout', async (c) => {
  const header = c.req.header('Authorization')
  if (header?.startsWith('Bearer ')) {
    const token = header.slice(7)
    await supabaseAdmin.auth.admin.signOut(token)
  }

  return c.json({ data: { message: 'Logged out' } })
})

export default auth
```

---

### Task 6: Spot Schema & Types

**Files:**
- Create: `src/modules/spots/spots.schema.ts`
- Create: `src/shared/types.ts`

- [ ] **Step 1: Create `src/shared/types.ts`**

```ts
export interface PaginationMeta {
  page: number
  limit: number
  total: number
}

export interface ListResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface SingleResponse<T> {
  data: T
}

export interface ErrorResponse {
  error: {
    code: string
    message: string
  }
}
```

- [ ] **Step 2: Create `src/modules/spots/spots.schema.ts`**

```ts
import { z } from 'zod'

export const createSpotSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  address: z.string().min(1).max(500),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  imageUrl: z.string().url().optional(),
  tagIds: z.array(z.string()).optional(),
})

export const updateSpotSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  address: z.string().min(1).max(500).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  imageUrl: z.string().url().optional(),
  tagIds: z.array(z.string()).optional(),
})

export const listSpotsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  tag: z.string().optional(),
  q: z.string().optional(),
})

export const nearbySpotsQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(0.1).max(100).default(5),
})

export type CreateSpotInput = z.infer<typeof createSpotSchema>
export type UpdateSpotInput = z.infer<typeof updateSpotSchema>
export type ListSpotsQuery = z.infer<typeof listSpotsQuerySchema>
export type NearbySpotsQuery = z.infer<typeof nearbySpotsQuerySchema>
```

---

### Task 7: Spot Service

**Files:**
- Create: `src/modules/spots/spots.service.ts`

- [ ] **Step 1: Create `src/modules/spots/spots.service.ts`**

```ts
import { prisma } from '../../core/prisma'
import { NotFoundError } from '../../core/errors'
import type { CreateSpotInput, UpdateSpotInput, ListSpotsQuery, NearbySpotsQuery } from './spots.schema'
import type { PaginationMeta } from '../../shared/types'

export async function listSpots(query: ListSpotsQuery) {
  const { page, limit, tag, q } = query
  const skip = (page - 1) * limit

  const where: any = { isActive: true }

  if (tag) {
    where.tags = { some: { tag: { name: tag } } }
  }

  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
  }

  const [spots, total] = await Promise.all([
    prisma.spot.findMany({
      where,
      skip,
      take: limit,
      include: {
        tags: { include: { tag: true } },
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.spot.count({ where }),
  ])

  const meta: PaginationMeta = { page, limit, total }

  const data = spots.map((spot) => ({
    ...spot,
    tags: spot.tags.map((st) => st.tag),
    reviewCount: spot._count.reviews,
    _count: undefined,
  }))

  return { data, meta }
}

export async function getNearbySpots(query: NearbySpotsQuery) {
  const { lat, lng, radius } = query

  const spots: any[] = await prisma.$queryRaw`
    SELECT * FROM (
      SELECT 
        s.*,
        (6371 * acos(
          cos(radians(${lat})) * cos(radians(s.latitude)) *
          cos(radians(s.longitude) - radians(${lng})) +
          sin(radians(${lat})) * sin(radians(s.latitude))
        )) AS distance
      FROM "Spot" s
      WHERE s."isActive" = true
    ) sub
    WHERE distance <= ${radius}
    ORDER BY distance ASC
  `

  return { data: spots }
}

export async function getSpotById(id: string) {
  const spot = await prisma.spot.findFirst({
    where: { id, isActive: true },
    include: {
      tags: { include: { tag: true } },
      reviews: {
        select: {
          id: true,
          rating: true,
          content: true,
          createdAt: true,
          user: { select: { id: true, alias: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: { select: { reviews: true } },
    },
  })

  if (!spot) throw new NotFoundError('Spot not found')

  const avgRating = await prisma.review.aggregate({
    where: { spotId: id },
    _avg: { rating: true },
  })

  return {
    data: {
      ...spot,
      tags: spot.tags.map((st) => st.tag),
      reviewCount: spot._count.reviews,
      averageRating: avgRating._avg.rating ?? 0,
      _count: undefined,
    },
  }
}

export async function createSpot(input: CreateSpotInput) {
  const { tagIds, ...data } = input

  const spot = await prisma.spot.create({
    data: {
      ...data,
      tags: tagIds
        ? { create: tagIds.map((tagId) => ({ tagId })) }
        : undefined,
    },
    include: {
      tags: { include: { tag: true } },
    },
  })

  return {
    data: {
      ...spot,
      tags: spot.tags.map((st) => st.tag),
    },
  }
}

export async function updateSpot(id: string, input: UpdateSpotInput) {
  const existing = await prisma.spot.findUnique({ where: { id } })
  if (!existing) throw new NotFoundError('Spot not found')

  const { tagIds, ...data } = input

  const spot = await prisma.$transaction(async (tx) => {
    if (tagIds) {
      await tx.spotTag.deleteMany({ where: { spotId: id } })
      await tx.spotTag.createMany({
        data: tagIds.map((tagId) => ({ spotId: id, tagId })),
      })
    }

    return tx.spot.update({
      where: { id },
      data,
      include: {
        tags: { include: { tag: true } },
      },
    })
  })

  return {
    data: {
      ...spot,
      tags: spot.tags.map((st) => st.tag),
    },
  }
}

export async function deleteSpot(id: string) {
  const existing = await prisma.spot.findUnique({ where: { id } })
  if (!existing) throw new NotFoundError('Spot not found')

  await prisma.spot.update({
    where: { id },
    data: { isActive: false },
  })

  return { data: { message: 'Spot deleted' } }
}
```

---

### Task 8: Spot Routes

**Files:**
- Create: `src/modules/spots/spots.routes.ts`

- [ ] **Step 1: Create `src/modules/spots/spots.routes.ts`**

```ts
import { Hono } from 'hono'
import { authMiddleware, adminGuard, optionalAuthMiddleware } from '../../shared/middleware/auth'
import * as spotService from './spots.service'
import {
  createSpotSchema,
  updateSpotSchema,
  listSpotsQuerySchema,
  nearbySpotsQuerySchema,
} from './spots.schema'
import { ValidationError } from '../../core/errors'

const spots = new Hono()

spots.get('/', optionalAuthMiddleware, async (c) => {
  const query = listSpotsQuerySchema.parse(c.req.query())
  const result = await spotService.listSpots(query)
  return c.json(result)
})

spots.get('/nearby', optionalAuthMiddleware, async (c) => {
  const query = nearbySpotsQuerySchema.parse(c.req.query())
  const result = await spotService.getNearbySpots(query)
  return c.json(result)
})

spots.get('/:id', optionalAuthMiddleware, async (c) => {
  const id = c.req.param('id')
  const result = await spotService.getSpotById(id)
  return c.json(result)
})

spots.post('/', authMiddleware, adminGuard, async (c) => {
  const body = await c.req.json()
  const parsed = createSpotSchema.parse(body)
  const result = await spotService.createSpot(parsed)
  return c.json(result, 201)
})

spots.patch('/:id', authMiddleware, adminGuard, async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const parsed = updateSpotSchema.parse(body)
  const result = await spotService.updateSpot(id, parsed)
  return c.json(result)
})

spots.delete('/:id', authMiddleware, adminGuard, async (c) => {
  const id = c.req.param('id')
  const result = await spotService.deleteSpot(id)
  return c.json(result)
})

export default spots
```

---

### Task 9: Error Handler & Wire App

**Files:**
- Modify: `src/app.ts`

- [ ] **Step 1: Update `src/app.ts`**

```ts
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import authRoutes from './modules/auth/auth.routes'
import spotsRoutes from './modules/spots/spots.routes'
import { AppError } from './core/errors'
import { ZodError } from 'zod'

const app = new Hono()

app.onError((err, c) => {
  if (err instanceof ZodError) {
    return c.json({
      error: {
        code: 'VALIDATION_ERROR',
        message: err.errors.map((e) => e.message).join(', '),
      },
    }, 400)
  }

  if (err instanceof AppError) {
    return c.json({
      error: { code: err.code, message: err.message },
    }, err.statusCode)
  }

  if (err instanceof HTTPException) {
    return c.json({
      error: { code: 'HTTP_ERROR', message: err.message },
    }, err.status)
  }

  console.error('Unhandled error:', err)
  return c.json({
    error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
  }, 500)
})

app.route('/api/auth', authRoutes)
app.route('/api/spots', spotsRoutes)

app.get('/', (c) => {
  return c.text('FOMO API')
})

export default app
```

---

### Task 10: Verify Dev Server

- [ ] **Step 1: Start dev server**

```bash
bun run src/server.ts
```

Expected: `Listening on http://localhost:8787`

- [ ] **Step 2: Test root endpoint**

```bash
curl http://localhost:8787/
```
Expected: `FOMO API`

- [ ] **Step 3: Test spots list (empty)**

```bash
curl http://localhost:8787/api/spots
```
Expected: `{ "data": [], "meta": { "page": 1, "limit": 10, "total": 0 } }`

- [ ] **Step 4: Test 404 for unknown spot**

```bash
curl http://localhost:8787/api/spots/nonexistent
```
Expected: `{ "error": { "code": "NOT_FOUND", "message": "Spot not found" } }`

- [ ] **Step 5: Test auth endpoint without token**

```bash
curl -X POST http://localhost:8787/api/auth/google -H "Content-Type: application/json" -d '{"id_token":"test"}'
```
Expected: `{ "error": { "code": "AUTH_FAILED", "message": "..." } }`
