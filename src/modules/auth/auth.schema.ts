import { z } from '@hono/zod-openapi'

// ===== Response Schemas =====

export const AuthUserSchema = z.object({
  id: z.string().openapi({ example: 'supabase-user-id' }),
  email: z.string().nullable().openapi({ example: 'user@example.com' }),
  alias: z.string().nullable().openapi({ example: 'John Doe' }),
  avatarUrl: z.string().nullable().openapi({ example: 'https://example.com/avatar.jpg' }),
  role: z.string().openapi({ example: 'user' }),
}).openapi('AuthUser')

export const GoogleLoginResponseSchema = z.object({
  data: z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    user: AuthUserSchema,
  }),
}).openapi('GoogleLoginResponse')

export const RefreshResponseSchema = z.object({
  data: z.object({
    access_token: z.string(),
    refresh_token: z.string(),
  }),
}).openapi('RefreshResponse')

export const LogoutResponseSchema = z.object({
  data: z.object({
    message: z.string().openapi({ example: 'Logged out' }),
  }),
}).openapi('LogoutResponse')

// ===== Request Schemas =====

export const googleLoginSchema = z.object({
  id_token: z.string().min(1, 'ID token is required').openapi({
    example: 'google-id-token',
    description: 'Google OAuth ID token from Supabase Auth',
  }),
})

export const refreshSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required').openapi({
    example: 'supabase-refresh-token',
    description: 'Supabase Auth refresh token',
  }),
})
