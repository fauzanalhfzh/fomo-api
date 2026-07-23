import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { authMiddleware } from '../../shared/middleware/auth'
import { UnauthorizedError } from '../../core/errors'
import { ErrorResponseSchema } from '../../shared/openapi'
import type { AuthUser } from '../../shared/middleware/auth'
import * as reviewService from './reviews.service'
import {
  createReviewSchema,
  updateReviewSchema,
  spotReviewsQuerySchema,
  reviewIdParamSchema,
  spotReviewParamsSchema,
  ReviewResponseSchema,
  ReviewListResponseSchema,
  DeleteReviewResponseSchema,
} from './reviews.schema'

const listRoute = createRoute({
  method: 'get',
  path: '/{spotId}/reviews',
  tags: ['Spots', 'Reviews'],
  request: {
    params: spotReviewParamsSchema,
    query: spotReviewsQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: ReviewListResponseSchema } },
      description: 'List of reviews for a spot',
    },
    404: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Spot not found',
    },
  },
})

const createRouteDef = createRoute({
  method: 'post',
  path: '/{spotId}/reviews',
  tags: ['Spots', 'Reviews'],
  security: [{ Bearer: [] }],
  request: {
    params: spotReviewParamsSchema,
    body: { content: { 'application/json': { schema: createReviewSchema } } },
  },
  responses: {
    201: {
      content: { 'application/json': { schema: ReviewResponseSchema } },
      description: 'Review created',
    },
    401: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Unauthorized',
    },
    404: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Spot not found',
    },
  },
})

const getRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['Reviews'],
  security: [{ Bearer: [] }],
  request: { params: reviewIdParamSchema },
  responses: {
    200: {
      content: { 'application/json': { schema: ReviewResponseSchema } },
      description: 'Review detail',
    },
    404: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Review not found',
    },
  },
})

const updateRouteDef = createRoute({
  method: 'patch',
  path: '/{id}',
  tags: ['Reviews'],
  security: [{ Bearer: [] }],
  request: {
    params: reviewIdParamSchema,
    body: { content: { 'application/json': { schema: updateReviewSchema } } },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: ReviewResponseSchema } },
      description: 'Review updated',
    },
    401: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Unauthorized',
    },
    403: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Forbidden - not your review',
    },
    404: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Review not found',
    },
  },
})

const deleteRouteDef = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: ['Reviews'],
  security: [{ Bearer: [] }],
  request: { params: reviewIdParamSchema },
  responses: {
    200: {
      content: { 'application/json': { schema: DeleteReviewResponseSchema } },
      description: 'Review deleted',
    },
    401: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Unauthorized',
    },
    403: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Forbidden - not your review',
    },
    404: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Review not found',
    },
  },
})

// Router for /api/spots — list is public
export const spotReviewsRouter = new OpenAPIHono()

spotReviewsRouter.openapi(listRoute, async (c) => {
  const { spotId } = c.req.valid('param')
  const query = c.req.valid('query')
  const result = await reviewService.listSpotReviews(spotId, query)
  return c.json(result)
})

spotReviewsRouter.openapi(createRouteDef, async (c) => {
  const user = c.get('user') as AuthUser | null
  if (!user) throw new UnauthorizedError()
  const { spotId } = c.req.valid('param')
  const body = c.req.valid('json')
  const result = await reviewService.createReview(spotId, user.id, body)
  return c.json(result, 201 as any)
})

// Router for /api/reviews — all require auth
export const reviewRouter = new OpenAPIHono()
reviewRouter.use('/*', authMiddleware)

reviewRouter.openapi(getRoute, async (c) => {
  const { id } = c.req.valid('param')
  const result = await reviewService.getReview(id)
  return c.json(result)
})

reviewRouter.openapi(updateRouteDef, async (c) => {
  const user: AuthUser = c.get('user')
  const { id } = c.req.valid('param')
  const body = c.req.valid('json')
  const result = await reviewService.updateReview(id, user.id, body)
  return c.json(result)
})

reviewRouter.openapi(deleteRouteDef, async (c) => {
  const user: AuthUser = c.get('user')
  const { id } = c.req.valid('param')
  const result = await reviewService.deleteReview(id, user.id)
  return c.json(result)
})
