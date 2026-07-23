import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { getSupabaseAdmin } from '../../core/supabase'
import { getPrisma } from '../../core/prisma'
import { googleLoginSchema, refreshSchema, GoogleLoginResponseSchema, RefreshResponseSchema, LogoutResponseSchema } from './auth.schema'
import { AppError } from '../../core/errors'
import { ErrorResponseSchema } from '../../shared/openapi'

const auth = new OpenAPIHono()

const googleRoute = createRoute({
  method: 'post',
  path: '/google',
  tags: ['Auth'],
  request: {
    body: {
      content: { 'application/json': { schema: googleLoginSchema } },
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: GoogleLoginResponseSchema } },
      description: 'Login successful',
    },
    401: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Authentication failed',
    },
  },
})

const refreshRoute = createRoute({
  method: 'post',
  path: '/refresh',
  tags: ['Auth'],
  request: {
    body: {
      content: { 'application/json': { schema: refreshSchema } },
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: RefreshResponseSchema } },
      description: 'Token refreshed',
    },
    401: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Refresh failed',
    },
  },
})

const logoutRoute = createRoute({
  method: 'post',
  path: '/logout',
  tags: ['Auth'],
  responses: {
    200: {
      content: { 'application/json': { schema: LogoutResponseSchema } },
      description: 'Logged out successfully',
    },
  },
})

auth.openapi(googleRoute, async (c) => {
  const { id_token } = c.req.valid('json')

  const { data, error } = await getSupabaseAdmin().auth.signInWithIdToken({
    provider: 'google',
    token: id_token,
  })

  if (error || !data.user) {
    throw new AppError(401, 'AUTH_FAILED', 'Google authentication failed')
  }

  const supabaseUser = data.user

  let user = await getPrisma().user.findUnique({
    where: { id: supabaseUser.id },
  })

  if (!user) {
    user = await getPrisma().user.create({
      data: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        alias: (supabaseUser.user_metadata?.name as string) ?? null,
        avatarUrl: (supabaseUser.user_metadata?.avatar_url as string) ?? null,
      },
    })
  }

  return c.json({
    data: {
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      user: {
        id: user.id,
        email: user.email,
        alias: user.alias,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    },
  })
})

auth.openapi(refreshRoute, async (c) => {
  const { refresh_token } = c.req.valid('json')

  const { data, error } = await getSupabaseAdmin().auth.refreshSession({
    refresh_token,
  })

  if (error) {
    throw new AppError(401, 'REFRESH_FAILED', 'Token refresh failed')
  }

  return c.json({
    data: {
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
    },
  })
})

auth.openapi(logoutRoute, async (c) => {
  const header = c.req.header('Authorization')
  if (header?.startsWith('Bearer ')) {
    const token = header.slice(7)
    await getSupabaseAdmin().auth.admin.signOut(token)
  }

  return c.json({ data: { message: 'Logged out' } })
})

export default auth
