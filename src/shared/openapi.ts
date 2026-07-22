import { z } from '@hono/zod-openapi'

export const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.string().openapi({ example: 'NOT_FOUND' }),
    message: z.string().openapi({ example: 'Resource not found' }),
  }),
}).openapi('ErrorResponse')
