import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { authMiddleware, adminGuard } from '../../shared/middleware/auth'
import { ErrorResponseSchema } from '../../shared/openapi'
import type { AuthUser } from '../../shared/middleware/auth'
import * as suggestionService from './suggestions.service'
import {
  CreateSuggestionSchema,
  UpdateSuggestionSchema,
  listSuggestionsQuerySchema,
  suggestionIdParamSchema,
  SuggestionResponseSchema,
  SuggestionListResponseSchema,
} from './suggestions.schema'

const suggestions = new OpenAPIHono()
suggestions.use('/*', authMiddleware)

const createRouteDef = createRoute({
  method: 'post',
  path: '/',
  tags: ['Suggestions'],
  security: [{ Bearer: [] }],
  request: {
    body: { content: { 'application/json': { schema: CreateSuggestionSchema } } },
  },
  responses: {
    201: {
      content: { 'application/json': { schema: SuggestionResponseSchema } },
      description: 'Suggestion submitted',
    },
    401: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Unauthorized',
    },
  },
})

const listRouteDef = createRoute({
  method: 'get',
  path: '/',
  tags: ['Suggestions'],
  security: [{ Bearer: [] }],
  request: { query: listSuggestionsQuerySchema },
  responses: {
    200: {
      content: { 'application/json': { schema: SuggestionListResponseSchema } },
      description: 'List of suggestions (admin only)',
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
  tags: ['Suggestions'],
  security: [{ Bearer: [] }],
  request: {
    params: suggestionIdParamSchema,
    body: { content: { 'application/json': { schema: UpdateSuggestionSchema } } },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: SuggestionResponseSchema } },
      description: 'Suggestion updated',
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
      description: 'Suggestion not found',
    },
  },
})

suggestions.openapi(createRouteDef, async (c) => {
  const user: AuthUser = c.get('user')
  const body = c.req.valid('json')
  const result = await suggestionService.createSuggestion(user.id, body)
  return c.json(result, 201 as any)
})

// Admin-only routes
suggestions.use('/*', adminGuard)

suggestions.openapi(listRouteDef, async (c) => {
  const query = c.req.valid('query')
  const result = await suggestionService.listSuggestions(query)
  return c.json(result)
})

suggestions.openapi(updateRouteDef, async (c) => {
  const user: AuthUser = c.get('user')
  const { id } = c.req.valid('param')
  const body = c.req.valid('json')
  const result = await suggestionService.updateSuggestion(id, user.id, body)
  return c.json(result)
})

export default suggestions
