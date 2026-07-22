# Spec: Modul Spots — Phase 1 MVP

## Stack

- **Runtime:** Bun (dev) + Cloudflare Workers (prod)
- **Framework:** Hono v4
- **ORM:** Prisma + Prisma Accelerate
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (Google OAuth)
- **Validation:** Zod

## Data Model (Prisma)

```prisma
model User {
  id        String   @id                // = Supabase Auth UUID
  email     String?  @unique
  alias     String?
  avatarUrl String?
  role      String   @default("user")   // "user" | "admin"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  reviews     Review[]
  // vault, suggestion — defined in later modules
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
  spots     SpotTag[]
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

## Project Structure

```
src/
├── app.ts                  # Mount routes
├── server.ts               # Bun bootstrap
├── index.ts                # Re-export app.ts (fixes entrypoint)
├── modules/
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   └── auth.schema.ts
│   └── spots/
│       ├── spots.routes.ts
│       ├── spots.service.ts
│       └── spots.schema.ts
├── core/
│   ├── prisma.ts
│   └── errors.ts
└── shared/
    ├── middleware/
    │   ├── auth.ts
    │   └── admin.ts
    └── types.ts
prisma/
└── schema.prisma
```

## Spots API

| Method | Endpoint | Auth | Params | Description |
|--------|----------|------|--------|-------------|
| GET | `/api/spots` | Optional | `?page=1&limit=10&tag=wifi&q=coffee` | List active spots, paginated. Filter by tag name, search name/description |
| GET | `/api/spots/nearby` | Optional | `?lat=-6.2&lng=106.8&radius=5` | Haversine query, sorted by distance |
| GET | `/api/spots/:id` | Optional | — | Detail: tags, review count, avg rating, FOMO score |
| POST | `/api/spots` | Admin | Body: name, address, lat, lng, tagIds, etc. | Create spot with tags |
| PATCH | `/api/spots/:id` | Admin only (owner claim in Phase 2) | Body: partial fields | Update spot fields |
| DELETE | `/api/spots/:id` | Admin | — | Soft delete (isActive = false) |

### Response Format

List endpoints return:
```json
{
  "data": [ ... ],
  "meta": { "page": 1, "limit": 10, "total": 42 }
}
```

Error responses:
```json
{
  "error": { "code": "NOT_FOUND", "message": "Spot not found" }
}
```

## Auth Flow

1. Client sends `{ id_token }` to `POST /api/auth/google`
2. Backend verifies via `supabase.auth.signInWithIdToken()`
3. Upsert User in DB (keyed by Supabase user UUID)
4. Return `{ access_token, refresh_token, user }`
5. Subsequent requests: `Authorization: Bearer <token>`
6. Middleware: verify via `supabase.auth.getUser()` → `c.set('user', user)`
7. Admin guard: `user.role === 'admin'`

## New Dependencies

```json
{
  "@prisma/client": "^6.x",
  "@prisma/extension-accelerate": "^1.x",
  "@supabase/supabase-js": "^2.x",
  "zod": "^3.x"
}
```

## Prisma Accelerate Setup

- Generate Accelerate API key from Prisma dashboard
- Set `DATABASE_URL` to `prisma://accelerate...` in env
- `@prisma/extension-accelerate` adapter in Prisma client

## Entrypoint Fix

- Create `src/index.ts` re-exporting from `app.ts`
- Update `wrangler.jsonc` `main` → `"src/index.ts"`
- Update `server.ts` import from `./index` (already correct)
