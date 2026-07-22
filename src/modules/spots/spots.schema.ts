import { z } from '@hono/zod-openapi'

// ===== Response Schemas =====

export const TagSchema = z.object({
  id: z.string().openapi({ example: 'clx123abc' }),
  name: z.string().openapi({ example: 'Cafe' }),
  createdAt: z.string().datetime(),
}).openapi('Tag')

export const ReviewUserSchema = z.object({
  id: z.string(),
  alias: z.string().nullable(),
  avatarUrl: z.string().nullable(),
}).openapi('ReviewUser')

export const ReviewSchema = z.object({
  id: z.string(),
  rating: z.number().int().min(1).max(5),
  content: z.string().nullable(),
  createdAt: z.string().datetime(),
  user: ReviewUserSchema,
}).openapi('Review')

export const SpotSchema = z.object({
  id: z.string().openapi({ example: 'clx456def' }),
  name: z.string().openapi({ example: 'Starbucks Grand Indonesia' }),
  description: z.string().nullable().openapi({ example: 'Coffee shop at Grand Indonesia' }),
  address: z.string().openapi({ example: 'Grand Indonesia, Jakarta' }),
  latitude: z.number().openapi({ example: -6.1945 }),
  longitude: z.number().openapi({ example: 106.8228 }),
  imageUrl: z.string().nullable().openapi({ example: 'https://example.com/photo.jpg' }),
  fomoScore: z.number().openapi({ example: 87.5 }),
  isActive: z.boolean(),
  claimedById: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).openapi('Spot')

export const SpotListItemSchema = SpotSchema.extend({
  tags: z.array(TagSchema),
  reviewCount: z.number().int(),
}).openapi('SpotListItem')

export const SpotDetailSchema = SpotSchema.extend({
  tags: z.array(TagSchema),
  reviewCount: z.number().int(),
  averageRating: z.number().min(0).max(5),
  reviews: z.array(ReviewSchema),
}).openapi('SpotDetail')

export const PaginationMetaSchema = z.object({
  page: z.number().int(),
  limit: z.number().int(),
  total: z.number().int(),
}).openapi('PaginationMeta')

export const ListSpotsResponseSchema = z.object({
  data: z.array(SpotListItemSchema),
  meta: PaginationMetaSchema,
}).openapi('ListSpotsResponse')

export const NearbySpotsResponseSchema = z.object({
  data: z.array(SpotSchema.extend({
    distance: z.number().optional(),
  })),
}).openapi('NearbySpotsResponse')

export const SingleSpotResponseSchema = z.object({
  data: SpotDetailSchema,
}).openapi('SingleSpotResponse')

export const SpotCreatedResponseSchema = z.object({
  data: SpotSchema.extend({
    tags: z.array(TagSchema),
  }),
}).openapi('SpotCreatedResponse')

export const DeleteSpotResponseSchema = z.object({
  data: z.object({
    message: z.string().openapi({ example: 'Spot deleted' }),
  }),
}).openapi('DeleteSpotResponse')

// ===== Request Schemas =====

export const createSpotSchema = z.object({
  name: z.string().min(1).max(200).openapi({
    example: 'Starbucks Grand Indonesia',
    description: 'Spot name',
  }),
  description: z.string().max(2000).openapi({
    example: 'Coffee shop at Grand Indonesia',
    description: 'Spot description',
  }).optional(),
  address: z.string().min(1).max(500).openapi({
    example: 'Grand Indonesia, Jakarta',
    description: 'Physical address',
  }),
  latitude: z.number().min(-90).max(90).openapi({
    example: -6.1945,
    description: 'Latitude coordinate',
  }),
  longitude: z.number().min(-180).max(180).openapi({
    example: 106.8228,
    description: 'Longitude coordinate',
  }),
  imageUrl: z.string().url().openapi({
    example: 'https://example.com/photo.jpg',
    description: 'Spot image URL',
  }).optional(),
  tagIds: z.array(z.string()).openapi({
    description: 'Tag IDs to associate',
    example: ['clx123abc'],
  }).optional(),
})

export const updateSpotSchema = z.object({
  name: z.string().min(1).max(200).openapi({ example: 'Starbucks Grand Indonesia' }).optional(),
  description: z.string().max(2000).openapi({ example: 'Updated description' }).optional(),
  address: z.string().min(1).max(500).openapi({ example: 'Grand Indonesia, Jakarta' }).optional(),
  latitude: z.number().min(-90).max(90).openapi({ example: -6.1945 }).optional(),
  longitude: z.number().min(-180).max(180).openapi({ example: 106.8228 }).optional(),
  imageUrl: z.string().url().openapi({ example: 'https://example.com/photo.jpg' }).optional(),
  tagIds: z.array(z.string()).openapi({ example: ['clx123abc'] }).optional(),
})

export const listSpotsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).openapi({
    param: { name: 'page', in: 'query' },
    example: 1,
  }),
  limit: z.coerce.number().int().min(1).max(100).default(10).openapi({
    param: { name: 'limit', in: 'query' },
    example: 10,
  }),
  tag: z.string().openapi({
    param: { name: 'tag', in: 'query' },
    example: 'Cafe',
    description: 'Filter by tag name',
  }).optional(),
  q: z.string().openapi({
    param: { name: 'q', in: 'query' },
    example: 'coffee',
    description: 'Search query',
  }).optional(),
})

export const nearbySpotsQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90).openapi({
    param: { name: 'lat', in: 'query' },
    example: -6.1945,
    description: 'Center latitude',
  }),
  lng: z.coerce.number().min(-180).max(180).openapi({
    param: { name: 'lng', in: 'query' },
    example: 106.8228,
    description: 'Center longitude',
  }),
  radius: z.coerce.number().min(0.1).max(100).default(5).openapi({
    param: { name: 'radius', in: 'query' },
    example: 5,
    description: 'Search radius in km',
  }),
})

export const spotIdParamSchema = z.object({
  id: z.string().openapi({
    param: { name: 'id', in: 'path' },
    example: 'clx456def',
    description: 'Spot ID',
  }),
})

export type CreateSpotInput = z.infer<typeof createSpotSchema>
export type UpdateSpotInput = z.infer<typeof updateSpotSchema>
export type ListSpotsQuery = z.infer<typeof listSpotsQuerySchema>
export type NearbySpotsQuery = z.infer<typeof nearbySpotsQuerySchema>
