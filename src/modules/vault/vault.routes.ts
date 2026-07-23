import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { authMiddleware } from '../../shared/middleware/auth'
import { ErrorResponseSchema } from '../../shared/openapi'
import type { AuthUser } from '../../shared/middleware/auth'
import * as vaultService from './vault.service'
import {
  AddToVaultSchema,
  VaultListResponseSchema,
  AddToVaultResponseSchema,
  DeleteVaultResponseSchema,
  spotIdParamSchema,
} from './vault.schema'

const vault = new OpenAPIHono()
vault.use('/*', authMiddleware)

const listRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Vault'],
  security: [{ Bearer: [] }],
  responses: {
    200: {
      content: { 'application/json': { schema: VaultListResponseSchema } },
      description: 'List of saved spots',
    },
    401: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Unauthorized',
    },
  },
})

const addRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Vault'],
  security: [{ Bearer: [] }],
  request: {
    body: { content: { 'application/json': { schema: AddToVaultSchema } } },
  },
  responses: {
    201: {
      content: { 'application/json': { schema: AddToVaultResponseSchema } },
      description: 'Spot added to vault',
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

const removeRoute = createRoute({
  method: 'delete',
  path: '/{spotId}',
  tags: ['Vault'],
  security: [{ Bearer: [] }],
  request: { params: spotIdParamSchema },
  responses: {
    200: {
      content: { 'application/json': { schema: DeleteVaultResponseSchema } },
      description: 'Spot removed from vault',
    },
    401: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Unauthorized',
    },
    404: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Spot not in vault',
    },
  },
})

vault.openapi(listRoute, async (c) => {
  const user: AuthUser = c.get('user')
  const result = await vaultService.listVault(user.id)
  return c.json(result)
})

vault.openapi(addRoute, async (c) => {
  const user: AuthUser = c.get('user')
  const body = c.req.valid('json')
  const result = await vaultService.addToVault(user.id, body)
  return c.json(result, 201 as any)
})

vault.openapi(removeRoute, async (c) => {
  const user: AuthUser = c.get('user')
  const { spotId } = c.req.valid('param')
  const result = await vaultService.removeFromVault(user.id, spotId)
  return c.json(result)
})

export default vault
