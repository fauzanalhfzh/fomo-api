import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { HTTPException } from 'hono/http-exception'
import authRoutes from './modules/auth/auth.routes'
import spotsRoutes from './modules/spots/spots.routes'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { AppError } from './core/errors'
import { ZodError } from 'zod/v4'

const app = new OpenAPIHono()

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
  servers: [{ url: 'http://localhost:8787', description: 'Local dev' }],
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

  console.error('Unhandled error:', err)
  return c.json(
    { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
    500 as ContentfulStatusCode,
  )
})

app.route('/api/auth', authRoutes)
app.route('/api/spots', spotsRoutes)

app.get('/', (c) => {
  return c.text('FOMO API')
})

export default app
