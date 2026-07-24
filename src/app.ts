import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { HTTPException } from 'hono/http-exception'
import authRoutes from './modules/auth/auth.routes'
import spotsRoutes from './modules/spots/spots.routes'
import tagsRoutes from './modules/tags/tags.routes'
import usersRoutes from './modules/users/users.routes'
import vaultRoutes from './modules/vault/vault.routes'
import suggestionsRoutes from './modules/suggestions/suggestions.routes'
import { spotReviewsRouter, reviewRouter } from './modules/reviews/reviews.routes'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { AppError } from './core/errors'
import { ZodError } from 'zod/v4'

const app = new OpenAPIHono()

app.use('*', cors({
  origin: ["http://localhost:6767"],
  credentials: true,
}))

app.use('*', logger())

app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
})

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'FOMO API',
    version: '1.0.0',
    description: 'API for FOMO (Fear Of Missing Out) — spot discovery platform',
  },
  servers: [{ url: `http://localhost:${process.env.PORT}`, description: 'Local dev' }],
})

app.get('/swagger', swaggerUI({ url: '/doc' }))

app.onError((err, c) => {
  if (err instanceof ZodError) {
    return c.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: err.issues.map((e) => e.message).join(', '),
        },
      },
      400 as ContentfulStatusCode,
    )
  }

  if (err instanceof AppError) {
    return c.json(
      { error: { code: err.code, message: err.message } },
      err.statusCode as ContentfulStatusCode,
    )
  }

  if (err instanceof HTTPException) {
    return c.json(
      { error: { code: 'HTTP_ERROR', message: err.message } },
      err.status as ContentfulStatusCode,
    )
  }

  console.error(`[CRASH] ${c.req.method} ${c.req.path}:`, err)
  return c.json(
    { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
    500 as ContentfulStatusCode,
  )
})

app.route('/api/auth', authRoutes)
app.route('/api/spots', spotsRoutes)
app.route('/api/tags', tagsRoutes)
app.route('/api/users', usersRoutes)
app.route('/api/spots', spotReviewsRouter)
app.route('/api/reviews', reviewRouter)
app.route('/api/vault', vaultRoutes)
app.route('/api/suggestions', suggestionsRoutes)

app.get('/', (c) => {
  return c.text('FOMO API')
})

export default app
