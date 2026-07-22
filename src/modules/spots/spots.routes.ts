import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import {
  optionalAuthMiddleware,
} from '../../shared/middleware/auth'
import { ForbiddenError } from '../../core/errors'
import type { AuthUser } from '../../shared/middleware/auth'
import * as spotService from './spots.service'
import {
  createSpotSchema,
  updateSpotSchema,
  listSpotsQuerySchema,
  nearbySpotsQuerySchema,
  spotIdParamSchema,
  ListSpotsResponseSchema,
  NearbySpotsResponseSchema,
  SingleSpotResponseSchema,
  SpotCreatedResponseSchema,
  DeleteSpotResponseSchema,
} from './spots.schema'
import { ErrorResponseSchema } from '../../shared/openapi'

const spots = new OpenAPIHono()
spots.use('*', optionalAuthMiddleware)

const listRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Spots'],
  request: { query: listSpotsQuerySchema },
  responses: {
    200: {
      content: { 'application/json': { schema: ListSpotsResponseSchema } },
      description: 'List of spots',
    },
  },
})

const nearbyRoute = createRoute({
  method: 'get',
  path: '/nearby',
  tags: ['Spots'],
  request: { query: nearbySpotsQuerySchema },
  responses: {
    200: {
      content: { 'application/json': { schema: NearbySpotsResponseSchema } },
      description: 'Nearby spots',
    },
  },
})

const detailRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['Spots'],
  request: { params: spotIdParamSchema },
  responses: {
    200: {
      content: { 'application/json': { schema: SingleSpotResponseSchema } },
      description: 'Spot detail',
    },
    404: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Spot not found',
    },
  },
})

const createRouteDef = createRoute({
  method: 'post',
  path: '/',
  tags: ['Spots'],
  security: [{ Bearer: [] }],
  request: {
    body: { content: { 'application/json': { schema: createSpotSchema } } },
  },
  responses: {
    201: {
      content: { 'application/json': { schema: SpotCreatedResponseSchema } },
      description: 'Spot created',
    },
    401: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Unauthorized',
    },
    403: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Forbidden - admin only',
    },
  },
})

const updateRouteDef = createRoute({
  method: 'patch',
  path: '/{id}',
  tags: ['Spots'],
  security: [{ Bearer: [] }],
  request: {
    params: spotIdParamSchema,
    body: { content: { 'application/json': { schema: updateSpotSchema } } },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: SpotCreatedResponseSchema } },
      description: 'Spot updated',
    },
    401: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Unauthorized',
    },
    403: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Forbidden - admin only',
    },
    404: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Spot not found',
    },
  },
})

const deleteRouteDef = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: ['Spots'],
  security: [{ Bearer: [] }],
  request: { params: spotIdParamSchema },
  responses: {
    200: {
      content: { 'application/json': { schema: DeleteSpotResponseSchema } },
      description: 'Spot deleted',
    },
    401: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Unauthorized',
    },
    403: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Forbidden - admin only',
    },
    404: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Spot not found',
    },
  },
})

spots.openapi(listRoute, async (c) => {
  const query = c.req.valid('query')
  const result = await spotService.listSpots(query)
  return c.json(result)
})

spots.openapi(nearbyRoute, async (c) => {
  const query = c.req.valid('query')
  const result = await spotService.getNearbySpots(query)
  return c.json(result)
})

spots.openapi(detailRoute, async (c) => {
  const { id } = c.req.valid('param')
  const result = await spotService.getSpotById(id)
  return c.json(result)
})

spots.openapi(createRouteDef, async (c) => {
  const user = c.get('user') as AuthUser | null
  if (!user || user.role !== 'admin') throw new ForbiddenError('Admin access required')
  const body = c.req.valid('json')
  const result = await spotService.createSpot(body)
  return c.json(result, 201 as any)
})

spots.openapi(updateRouteDef, async (c) => {
  const user = c.get('user') as AuthUser | null
  if (!user || user.role !== 'admin') throw new ForbiddenError('Admin access required')
  const { id } = c.req.valid('param')
  const body = c.req.valid('json')
  const result = await spotService.updateSpot(id, body)
  return c.json(result)
})

spots.openapi(deleteRouteDef, async (c) => {
  const user = c.get('user') as AuthUser | null
  if (!user || user.role !== 'admin') throw new ForbiddenError('Admin access required')
  const { id } = c.req.valid('param')
  const result = await spotService.deleteSpot(id)
  return c.json(result)
})

export default spots
