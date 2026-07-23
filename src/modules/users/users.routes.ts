import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { authMiddleware } from '../../shared/middleware/auth'
import { UpdateProfileSchema, UserProfileResponseSchema, DeleteUserResponseSchema } from './users.schema'
import { ErrorResponseSchema } from '../../shared/openapi'
import { getProfile, updateProfile, deleteProfile } from './users.service'
import type { AuthUser } from '../../shared/middleware/auth'

const users = new OpenAPIHono()

users.use('/*', authMiddleware)

const getProfileRoute = createRoute({
  method: 'get',
  path: '/me',
  tags: ['Users'],
  security: [{ Bearer: [] }],
  responses: {
    200: {
      content: { 'application/json': { schema: UserProfileResponseSchema } },
      description: 'User profile',
    },
    401: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Unauthorized',
    },
  },
})

const updateProfileRoute = createRoute({
  method: 'patch',
  path: '/me',
  tags: ['Users'],
  security: [{ Bearer: [] }],
  request: {
    body: {
      content: { 'application/json': { schema: UpdateProfileSchema } },
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: UserProfileResponseSchema } },
      description: 'Profile updated',
    },
    401: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Unauthorized',
    },
  },
})

const deleteProfileRoute = createRoute({
  method: 'delete',
  path: '/me',
  tags: ['Users'],
  security: [{ Bearer: [] }],
  responses: {
    200: {
      content: { 'application/json': { schema: DeleteUserResponseSchema } },
      description: 'Account deleted',
    },
    401: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Unauthorized',
    },
  },
})

users.openapi(getProfileRoute, async (c) => {
  const user: AuthUser = c.get('user')
  const result = await getProfile(user.id)
  return c.json(result)
})

users.openapi(updateProfileRoute, async (c) => {
  const user: AuthUser = c.get('user')
  const input = c.req.valid('json')
  const result = await updateProfile(user.id, input)
  return c.json(result)
})

users.openapi(deleteProfileRoute, async (c) => {
  const user: AuthUser = c.get('user')
  const result = await deleteProfile(user.id)
  return c.json(result)
})

export default users
