# FOMO API — Integrasi Frontend (Next.js / TanStack)

## Base URL

```
Development : http://localhost:6767
Production  : https://fomo-api.yourdomain.com
```

Tambahkan ke `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:6767
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## Authentication

Login hanya via Google OAuth. Flow:

1. Frontend login pake **Supabase Auth** client (Google OAuth)
2. Dapetin `id_token` dari hasil login
3. Kirim `id_token` ke `POST /api/auth/google`
4. Simpan `access_token` & `refresh_token` dari response

### Sign In

```ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// 1. Trigger Google OAuth (redirect user)
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${window.location.origin}/auth/callback` },
})

// 2. Di halaman callback, ambil session
const { data: { session } } = await supabase.auth.getSession()
const idToken = session?.provider_token
if (!idToken) throw new Error('No Google ID token')

// 3. Exchange ke backend
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id_token: idToken }),
})

const { data } = await res.json()
// data.access_token   — JWT untuk Authorization header
// data.refresh_token  — untuk refresh session
// data.user           — { id, email, alias, avatarUrl, role }
```

### API Client Fetcher

```ts
// lib/api-client.ts
let accessToken: string | null = null

export function setToken(token: string | null) { accessToken = token }
export function getToken() { return accessToken }

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message)
  }
}

export async function fetcher<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  }

  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...init,
    headers,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body.error?.code ?? 'UNKNOWN', body.error?.message ?? res.statusText)
  }

  return res.json()
}
```

### Refresh Token

Panggil saat dapat 401:

```ts
export async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
  if (!res.ok) throw new Error('Refresh failed')
  const body = await res.json()
  setToken(body.data.access_token)
  return body.data
}
```

### Logout

```ts
export async function logout() {
  await fetcher('/api/auth/logout', { method: 'POST' })
  setToken(null)
}
```

---

## TanStack Query Hooks

### Spots

```ts
// hooks/use-spots.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetcher } from '@/lib/api-client'

export function useSpots(page = 1, tag?: string, q?: string) {
  const params = new URLSearchParams({ page: String(page), limit: '10' })
  if (tag) params.set('tag', tag)
  if (q) params.set('q', q)

  return useQuery({
    queryKey: ['spots', { page, tag, q }],
    queryFn: () => fetcher(`/api/spots?${params}`),
  })
}

export function useNearbySpots(lat: number, lng: number, radius = 5) {
  return useQuery({
    queryKey: ['spots', 'nearby', { lat, lng, radius }],
    queryFn: () => fetcher(`/api/spots/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
    enabled: !!lat && !!lng,
  })
}

export function useSpot(id: string) {
  return useQuery({
    queryKey: ['spots', id],
    queryFn: () => fetcher(`/api/spots/${id}`),
    enabled: !!id,
  })
}
```

### Tags

```ts
// hooks/use-tags.ts
export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => fetcher('/api/tags'),
    staleTime: 5 * 60_000, // tags jarang berubah, cache 5 menit
  })
}
```

### Reviews

```ts
// hooks/use-reviews.ts
export function useSpotReviews(spotId: string, page = 1) {
  return useQuery({
    queryKey: ['reviews', spotId, { page }],
    queryFn: () => fetcher(`/api/spots/${spotId}/reviews?page=${page}`),
    enabled: !!spotId,
  })
}

export function useCreateReview(spotId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { rating: number; content?: string }) =>
      fetcher(`/api/spots/${spotId}/reviews`, { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews', spotId] })
      qc.invalidateQueries({ queryKey: ['spots', spotId] })
    },
  })
}

export function useUpdateReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string; rating?: number; content?: string }) =>
      fetcher(`/api/reviews/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews'] }),
  })
}

export function useDeleteReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => fetcher(`/api/reviews/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews'] }),
  })
}
```

### Users

```ts
// hooks/use-users.ts
export function useProfile() {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: () => fetcher('/api/users/me'),
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { alias?: string; avatarUrl?: string }) =>
      fetcher('/api/users/me', { method: 'PATCH', body: JSON.stringify(body) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users', 'me'] }),
  })
}
```

---

## TypeScript Types

Generate otomatis dari OpenAPI spec backend:

```bash
npx openapi-typescript http://localhost:6767/doc -o types/api.ts
```

Akses spec langsung:
- `GET /api/doc` — JSON format
- `GET /swagger` — Swagger UI

Contoh tipe yang dihasilkan:

```ts
export interface Spot {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  photoUrls: string[]
  fomoScore: number
  priceMin: number | null
  priceMax: number | null
  openDays: string | null
  openTime: string | null
  closeTime: string | null
  website: string | null
  socialMedia: Record<string, string> | null
  createdAt: string
  updatedAt: string
}

export interface SpotListItem extends Spot {
  tags: Tag[]
  reviewCount: number
  facility: SpotFacility | null
}

export interface Review {
  id: string
  rating: number
  content: string | null
  user: { id: string; alias: string | null; avatarUrl: string | null }
}
```

---

## Error Handling

Format error API:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Spot not found"
  }
}
```

| Kode | Status | Penyebab |
|------|--------|----------|
| `VALIDATION_ERROR` | 400 | Input tidak valid |
| `UNAUTHORIZED` | 401 | Token tidak ada / expired |
| `FORBIDDEN` | 403 | Bukan owner / bukan admin |
| `NOT_FOUND` | 404 | Resource tidak ditemukan |
| `INTERNAL_ERROR` | 500 | Server error |

Contoh handling:

```tsx
const { data, error } = useSpot('invalid-id')
if (error instanceof ApiError && error.code === 'NOT_FOUND') {
  return <NotFound />
}
```

---

## Pagination → Infinite Query

Semua list endpoint return pagination:

```json
{
  "data": [...],
  "meta": { "page": 1, "limit": 10, "total": 42 }
}
```

Implementasi infinite scroll dengan TanStack Query:

```ts
export function useInfiniteSpotReviews(spotId: string) {
  return useInfiniteQuery({
    queryKey: ['reviews', spotId, 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      fetcher(`/api/spots/${spotId}/reviews?page=${pageParam}&limit=10`),
    getNextPageParam: (lastPage) => {
      const { page, limit, total } = lastPage.meta
      return page * limit < total ? page + 1 : undefined
    },
    enabled: !!spotId,
  })
}
```

---

## Struktur Folder yang Disarankan

```
src/
  lib/
    api-client.ts     — fetcher, token management, ApiError
    auth.ts           — Supabase client, login/logout
  hooks/
    use-spots.ts
    use-tags.ts
    use-reviews.ts
    use-users.ts
  types/
    api.ts            — generated from openapi-typescript
  app/
    auth/callback/
    spots/[id]/
  components/
    SpotCard.tsx
    ReviewList.tsx
    ReviewForm.tsx
```

---

## Checklist Integrasi

- [ ] Setup Supabase client di frontend
- [ ] Implement Google OAuth login flow
- [ ] Simpan & kirim `access_token` via Authorization header
- [ ] Setup TanStack Query provider
- [ ] Generate TypeScript types dari OpenAPI spec (`/doc`)
- [ ] Implement custom hooks per modul
- [ ] Handle refresh token saat 401
- [ ] Tambah error boundary untuk API errors
