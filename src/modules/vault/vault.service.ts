import { getPrisma } from '../../core/prisma'
import { NotFoundError } from '../../core/errors'
import type { AddToVaultInput } from './vault.schema'

export async function listVault(userId: string) {
  const entries: any[] = await getPrisma().vaultEntry.findMany({
    where: { userId },
    include: {
      spot: {
        select: {
          id: true,
          name: true,
          address: true,
          latitude: true,
          longitude: true,
          photoUrls: true,
          fomoScore: true,
          priceMin: true,
          priceMax: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const data = entries.map((e) => ({
    id: e.id,
    savedAt: e.createdAt.toISOString(),
    spot: e.spot,
  }))

  return { data }
}

export async function addToVault(userId: string, input: AddToVaultInput) {
  const spot = await getPrisma().spot.findUnique({ where: { id: input.spotId } })
  if (!spot || !spot.isActive) throw new NotFoundError('Spot not found')

  const entry: any = await getPrisma().vaultEntry.upsert({
    where: { userId_spotId: { userId, spotId: input.spotId } },
    create: { userId, spotId: input.spotId },
    update: {},
    include: {
      spot: {
        select: {
          id: true,
          name: true,
          address: true,
          latitude: true,
          longitude: true,
          photoUrls: true,
          fomoScore: true,
          priceMin: true,
          priceMax: true,
        },
      },
    },
  })

  return {
    data: {
      id: entry.id,
      savedAt: entry.createdAt.toISOString(),
      spot: entry.spot,
    },
  }
}

export async function removeFromVault(userId: string, spotId: string) {
  const entry = await getPrisma().vaultEntry.findUnique({
    where: { userId_spotId: { userId, spotId } },
  })

  if (!entry) throw new NotFoundError('Spot not in vault')

  await getPrisma().vaultEntry.delete({
    where: { userId_spotId: { userId, spotId } },
  })

  return { data: { message: 'Spot removed from vault' } }
}
