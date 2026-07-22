import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import authRoutes from './modules/auth/auth.routes'
import spotsRoutes from './modules/spots/spots.routes'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { AppError } from './core/errors'
import { ZodError } from 'zod/v4'

const app = new Hono()

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
