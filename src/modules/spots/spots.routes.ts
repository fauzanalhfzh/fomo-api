import { Hono } from 'hono'
import {
  authMiddleware,
  adminGuard,
  optionalAuthMiddleware,
} from '../../shared/middleware/auth'
import * as spotService from './spots.service'
import {
  createSpotSchema,
  updateSpotSchema,
  listSpotsQuerySchema,
  nearbySpotsQuerySchema,
} from './spots.schema'

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
  const id = c.req.param('id')!
  const result = await spotService.getSpotById(id)
  return c.json(result)
})

spots.post('/', authMiddleware, adminGuard, async (c) => {
  const body = await c.req.json()
  const parsed = createSpotSchema.parse(body)
  const result = await spotService.createSpot(parsed)
  return c.json(result, 201 as any)
})

spots.patch('/:id', authMiddleware, adminGuard, async (c) => {
  const id = c.req.param('id')!
  const body = await c.req.json()
  const parsed = updateSpotSchema.parse(body)
  const result = await spotService.updateSpot(id, parsed)
  return c.json(result)
})

spots.delete('/:id', authMiddleware, adminGuard, async (c) => {
  const id = c.req.param('id')!
  const result = await spotService.deleteSpot(id)
  return c.json(result)
})

export default spots
