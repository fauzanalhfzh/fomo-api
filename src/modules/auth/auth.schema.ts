import { z } from 'zod'

export const googleLoginSchema = z.object({
  id_token: z.string().min(1, 'ID token is required'),
})

export const refreshSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required'),
})
