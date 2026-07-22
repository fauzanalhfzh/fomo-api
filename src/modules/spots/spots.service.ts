import { prisma } from '../../core/prisma'
import { NotFoundError } from '../../core/errors'
import type {
  CreateSpotInput,
  UpdateSpotInput,
  ListSpotsQuery,
  NearbySpotsQuery,
} from './spots.schema'
import type { PaginationMeta } from '../../shared/types'

export async function listSpots(query: ListSpotsQuery) {
  const { page, limit, tag, q } = query
  const skip = (page - 1) * limit

  const where: any = { isActive: true }

  if (tag) {
    where.tags = { some: { tag: { name: tag } } }
  }

  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
  }

  const [spots, total] = await Promise.all([
    prisma.spot.findMany({
      where,
      skip,
      take: limit,
      include: {
        tags: { include: { tag: true } },
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.spot.count({ where }),
  ])

  const meta: PaginationMeta = { page, limit, total }

  const data = (spots as any[]).map((spot) => ({
    ...spot,
    tags: spot.tags.map((st: any) => st.tag),
    reviewCount: spot._count.reviews,
    _count: undefined,
  }))

  return { data, meta }
}

export async function getNearbySpots(query: NearbySpotsQuery) {
  const { lat, lng, radius } = query

  const spots: any[] = await prisma.$queryRaw`
    SELECT * FROM (
      SELECT
        s.*,
        (6371 * acos(
          cos(radians(${lat})) * cos(radians(s.latitude)) *
          cos(radians(s.longitude) - radians(${lng})) +
          sin(radians(${lat})) * sin(radians(s.latitude))
        )) AS distance
      FROM "Spot" s
      WHERE s."isActive" = true
    ) sub
    WHERE distance <= ${radius}
    ORDER BY distance ASC
  `

  return { data: spots }
}

export async function getSpotById(id: string) {
  const spot: any = await prisma.spot.findFirst({
    where: { id, isActive: true },
    include: {
      tags: { include: { tag: true } },
      reviews: {
        select: {
          id: true,
          rating: true,
          content: true,
          createdAt: true,
          user: { select: { id: true, alias: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: { select: { reviews: true } },
    },
  })

  if (!spot) throw new NotFoundError('Spot not found')

  const avgRating = await prisma.review.aggregate({
    where: { spotId: id },
    _avg: { rating: true },
  })

  return {
    data: {
      ...spot,
      tags: spot.tags.map((st: any) => st.tag),
      reviewCount: spot._count.reviews,
      averageRating: avgRating._avg.rating ?? 0,
      _count: undefined,
    },
  }
}

export async function createSpot(input: CreateSpotInput) {
  const { tagIds, ...data } = input

  const spot: any = await prisma.spot.create({
    data: {
      ...data,
      tags: tagIds
        ? { create: tagIds.map((tagId) => ({ tagId })) }
        : undefined,
    },
    include: {
      tags: { include: { tag: true } },
    },
  })

  return {
    data: {
      ...spot,
      tags: spot.tags.map((st: any) => st.tag),
    },
  }
}

export async function updateSpot(id: string, input: UpdateSpotInput) {
  const existing = await prisma.spot.findUnique({ where: { id } })
  if (!existing || !existing.isActive) throw new NotFoundError('Spot not found')

  const { tagIds, ...data } = input

  const spot: any = await prisma.$transaction(async (tx: any) => {
    if (tagIds) {
      await tx.spotTag.deleteMany({ where: { spotId: id } })
      await tx.spotTag.createMany({
        data: tagIds.map((tagId) => ({ spotId: id, tagId })),
      })
    }

    return tx.spot.update({
      where: { id },
      data,
      include: {
        tags: { include: { tag: true } },
      },
    })
  })

  return {
    data: {
      ...spot,
      tags: spot.tags.map((st: any) => st.tag),
    },
  }
}

export async function deleteSpot(id: string) {
  const existing = await prisma.spot.findUnique({ where: { id } })
  if (!existing || !existing.isActive) throw new NotFoundError('Spot not found')

  await prisma.spot.update({
    where: { id },
    data: { isActive: false },
  })

  return { data: { message: 'Spot deleted' } }
}
