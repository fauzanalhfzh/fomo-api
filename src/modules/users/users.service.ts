import { getPrisma } from '../../core/prisma'
import { getSupabaseAdmin } from '../../core/supabase'
import { NotFoundError } from '../../core/errors'
import type { UpdateProfileInput } from './users.schema'

export async function getProfile(userId: string) {
  const user = await getPrisma().user.findUnique({
    where: { id: userId },
  })

  if (!user) throw new NotFoundError('User not found')

  return {
    data: {
      id: user.id,
      email: user.email,
      alias: user.alias,
      avatarUrl: user.avatarUrl,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    },
  }
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const user = await getPrisma().user.update({
    where: { id: userId },
    data: input,
  })

  return {
    data: {
      id: user.id,
      email: user.email,
      alias: user.alias,
      avatarUrl: user.avatarUrl,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    },
  }
}

export async function deleteProfile(userId: string) {
  const existing = await getPrisma().user.findUnique({ where: { id: userId } })
  if (!existing) throw new NotFoundError('User not found')

  const { error } = await getSupabaseAdmin().auth.admin.deleteUser(userId)
  if (error) throw error

  await getPrisma().user.delete({ where: { id: userId } })

  return { data: { message: 'Account deleted' } }
}
