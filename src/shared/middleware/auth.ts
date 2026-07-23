import { Context, Next } from 'hono'
import { getSupabaseAdmin } from '../../core/supabase'
import { getPrisma } from '../../core/prisma'
import { UnauthorizedError, ForbiddenError } from '../../core/errors'

export interface AuthUser {
  id: string
  email: string | null
  alias: string | null
  avatarUrl: string | null
  role: string
}

export async function authMiddleware(c: Context, next: Next) {
  const header = c.req.header('Authorization')
  if (!header?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header')
  }

  const token = header.slice(7)
  const { data, error } = await getSupabaseAdmin().auth.getUser(token)

  if (error || !data.user) {
    throw new UnauthorizedError('Invalid or expired token')
  }

  let user = await getPrisma().user.findUnique({
    where: { id: data.user.id },
  })

  if (!user) {
    user = await getPrisma().user.create({
      data: {
        id: data.user.id,
        email: data.user.email,
        alias: (data.user.user_metadata?.name as string) ?? null,
        avatarUrl: (data.user.user_metadata?.avatar_url as string) ?? null,
      },
    })
  }

  c.set('user', {
    id: user.id,
    email: user.email,
    alias: user.alias,
    avatarUrl: user.avatarUrl,
    role: user.role,
  } satisfies AuthUser)

  await next()
}

export function adminGuard(c: Context, next: Next) {
  const user: AuthUser = c.get('user')
  if (user.role !== 'admin') {
    throw new ForbiddenError('Admin access required')
  }
  return next()
}

export function optionalAuthMiddleware(c: Context, next: Next) {
  const header = c.req.header('Authorization')
  if (!header?.startsWith('Bearer ')) {
    c.set('user', null)
    return next()
  }
  return authMiddleware(c, next)
}
