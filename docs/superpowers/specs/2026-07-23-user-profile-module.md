# User Profile Module

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/users/me` | Bearer | Get current user profile |
| PATCH | `/api/users/me` | Bearer | Update `alias` and/or `avatarUrl` |
| DELETE | `/api/users/me` | Bearer | Delete account (Supabase Auth + DB) |

## Files

```
src/modules/users/
  users.schema.ts   — UpdateProfileSchema, UserProfileSchema, response schemas
  users.service.ts  — getProfile, updateProfile, deleteProfile
  users.routes.ts   — 3 route handlers + authMiddleware
```

## Dependencies

- **Auth middleware** (`src/shared/middleware/auth.ts`) — already exists, validates Bearer token and sets `c.get('user')`
- **Supabase Admin** (`getSupabaseAdmin()`) — for deleting auth user
- **Prisma** (`getPrisma()`) — for CRUD on User model

## Delete Behaviour

1. Lookup user in Prisma (404 if not found)
2. Call `supabase.auth.admin.deleteUser(userId)` to remove auth identity
3. Delete Prisma user record (reviews & claimed spots cascade-deleted)
