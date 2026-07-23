import { z } from '@hono/zod-openapi'

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
  updatedAt: z.string().datetime(),
  user: ReviewUserSchema,
}).openapi('Review')

export const ReviewResponseSchema = z.object({
  data: ReviewSchema,
}).openapi('ReviewResponse')

export const ReviewListResponseSchema = z.object({
  data: z.array(ReviewSchema),
  meta: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
  }),
}).openapi('ReviewListResponse')

export const DeleteReviewResponseSchema = z.object({
  data: z.object({
    message: z.string().openapi({ example: 'Review deleted' }),
  }),
}).openapi('DeleteReviewResponse')

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).openapi({
    example: 4,
    description: 'Rating 1-5',
  }),
  content: z.string().max(2000).openapi({
    example: 'Great place to work!',
    description: 'Review content',
  }).optional(),
})

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).openapi({
    example: 3,
    description: 'Rating 1-5',
  }).optional(),
  content: z.string().max(2000).openapi({
    example: 'Updated review',
    description: 'Review content',
  }).optional(),
})

export const spotReviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).openapi({
    param: { name: 'page', in: 'query' },
    example: 1,
  }),
  limit: z.coerce.number().int().min(1).max(100).default(10).openapi({
    param: { name: 'limit', in: 'query' },
    example: 10,
  }),
})

export const reviewIdParamSchema = z.object({
  id: z.string().openapi({
    param: { name: 'id', in: 'path' },
    example: 'clx789ghi',
    description: 'Review ID',
  }),
})

export const spotReviewParamsSchema = z.object({
  spotId: z.string().openapi({
    param: { name: 'spotId', in: 'path' },
    example: 'clx456def',
    description: 'Spot ID',
  }),
})

export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>
export type SpotReviewsQuery = z.infer<typeof spotReviewsQuerySchema>
