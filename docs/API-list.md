# API List — FOMO (NestJS Backend)

Daftar lengkap REST API endpoints untuk platform FOMO (Cafe Finder & AI Itinerary Platform), dikelompokkan per modul.

---

## Phase 1 — MVP

### Modul 1: Authentication
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/google` | Google OAuth login/register |
| POST | `/api/auth/refresh` | Refresh JWT access token |
| POST | `/api/auth/logout` | Invalidate user session |

### Modul 2: Spots
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/spots` | List spots (pagination, filter by tag, search query) |
| GET | `/api/spots/nearby` | Get spots by geolocation (`lat`, `lng`, `radius`) |
| GET | `/api/spots/:id` | Get spot detail (FOMO Score, facilities, AI Verified Vibes) |
| POST | `/api/spots` | Create new spot (admin only) |
| PATCH | `/api/spots/:id` | Update spot (admin / claimed owner) |
| DELETE | `/api/spots/:id` | Soft delete spot (admin only) |

### Modul 3: Tags / Categories
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/tags` | List all amenity tags (Wi-Fi, Plugs, Noise Level, Night Owl, etc.) |

### Modul 4: Reviews
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/spots/:spotId/reviews` | List reviews for a spot (paginated, newest first) |
| POST | `/api/spots/:spotId/reviews` | Submit a new review |
| GET | `/api/reviews/:id` | Get single review detail |
| PATCH | `/api/reviews/:id` | Update own review |
| DELETE | `/api/reviews/:id` | Delete own review |

### Modul 5: User Vault (Favorites)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/vault` | Get current user's saved spots |
| POST | `/api/vault` | Add a spot to vault |
| DELETE | `/api/vault/:spotId` | Remove a spot from vault |

### Modul 6: Suggestions (Crowdsourcing)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/suggestions` | Submit "Have a Spot to Spill?" form |
| GET | `/api/suggestions` | List all suggestions (admin only) |
| PATCH | `/api/suggestions/:id` | Update status — approve / reject (admin only) |

### Modul 7: User Profile
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/users/me` | Get current authenticated user profile |
| PATCH | `/api/users/me` | Update profile (alias, avatar, preferences) |
| DELETE | `/api/users/me` | Delete user account |

### Modul 8: AI Processing (Internal Worker)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/spots/:spotId/ai-vibes` | Get current AI-generated "AI Verified Vibes" summary for a spot |
| GET | `/api/spots/:spotId/ai-summaries` | Get versioned history of AI analyses for a spot |
| *(Internal)* | BullMQ Queue | Async review processing pipeline (review → queue → AI NLP → DB update) |

---

## Phase 2 — Monetization

### Modul 9: FOMO Pro (Subscription)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/subscriptions` | Create a new subscription |
| GET | `/api/subscriptions/current` | Check current subscription status |
| PATCH | `/api/subscriptions/current` | Cancel active subscription (set status to cancelled) |

### Modul 10: Spot Claim (B2B)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/spots/:id/claim` | Claim ownership of a spot (pemilik kafe) |
| GET | `/api/claims` | List all claimed spots for current user |
| PATCH | `/api/claims/:id` | Update claim verification status (admin only) |

### Modul 11: Spot Promotion (B2B)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/promotions` | Create a promotion campaign (CPM / CPC) |
| GET | `/api/promotions` | List user's promotion campaigns |
| PATCH | `/api/promotions/:id` | Update promotion campaign |
| GET | `/api/promotions/stats` | Get promotion performance analytics |

### Modul 12: Analytics Dashboard (B2B)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/analytics/overview` | Aggregated regional insights (trend pencarian, demografi) |
| GET | `/api/analytics/region/:regionId` | Region-specific analytics data |

### Modul 13: OpenTrip
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/trips` | List available OpenTrip tours |
| GET | `/api/trips/:id` | Get trip detail (route, schedule, price) |
| POST | `/api/trips/:id/book` | Book a trip ticket |
| GET | `/api/bookings` | List user's trip bookings |
| POST | `/api/guides/apply` | Apply as a tour guide (marketplace) |
| GET | `/api/guides` | List registered guides (admin only) |
| PATCH | `/api/guides/:id` | Update guide verification status (admin only) |

---

## Ringkasan

| Modul | Endpoints | Status |
|-------|-----------|--------|
| Authentication | 3 | Phase 1 |
| Spots | 6 | Phase 1 |
| Tags | 1 | Phase 1 |
| Reviews | 5 | Phase 1 |
| User Vault | 3 | Phase 1 |
| Suggestions | 3 | Phase 1 |
| User Profile | 3 | Phase 1 |
| AI Processing | 1 + queue | Phase 1 |
| FOMO Pro | 3 | Phase 2 |
| Spot Claim | 3 | Phase 2 |
| Promotion | 4 | Phase 2 |
| Analytics | 2 | Phase 2 |
| OpenTrip | 7 | Phase 2 |
| **Total** | **~44 endpoints** | |

