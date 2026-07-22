import { Hono } from 'hono'
import { supabaseAdmin } from '../../core/supabase'
import { prisma } from '../../core/prisma'
import { googleLoginSchema, refreshSchema } from './auth.schema'
import { AppError } from '../../core/errors'

const auth = new Hono()

auth.post('/google', async (c) => {
  const body = await c.req.json()
  const parsed = googleLoginSchema.parse(body)

  const { data, error } = await supabaseAdmin.auth.signInWithIdToken({
    provider: 'google',
    token: parsed.id_token,
  })

  if (error || !data.user) {
    throw new AppError(401, 'AUTH_FAILED', 'Google authentication failed')
  }

  const supabaseUser = data.user

  let user = await prisma.user.findUnique({
    where: { id: supabaseUser.id },
  })

  if (!user) {
    user = await prisma.user.create({
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

auth.post('/refresh', async (c) => {
  const body = await c.req.json()
  const parsed = refreshSchema.parse(body)

  const { data, error } = await supabaseAdmin.auth.refreshSession({
    refresh_token: parsed.refresh_token,
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

auth.post('/logout', async (c) => {
  const header = c.req.header('Authorization')
  if (header?.startsWith('Bearer ')) {
    const token = header.slice(7)
    await supabaseAdmin.auth.admin.signOut(token)
  }

  return c.json({ data: { message: 'Logged out' } })
})

export default auth
