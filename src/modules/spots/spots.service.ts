import { getPrisma } from '../../core/prisma'
import { NotFoundError } from '../../core/errors'
import type {
  CreateSpotInput,
  UpdateSpotInput,
  ListSpotsQuery,
  NearbySpotsQuery,
} from './spots.schema'
import type { PaginationMeta } from '../../shared/types'

const spotInclude = {
  tags: { include: { tag: true } },
  _count: { select: { reviews: true } },
}

const facilitySelect = {
  wifi: true,
  wifiSpeed: true,
  plugs: true,
  comfyDesk: true,
  atmosphere: true,
  hasIndoor: true,
  toiletLevel: true,
}

const detailFacilityInclude = {
  wifi: true,
  wifiSpeed: true,
  plugs: true,
  comfyDesk: true,
  atmosphere: true,
  hasIndoor: true,
  toiletLevel: true,
  toilets: true,
}

function mapSpot(spot: any) {
  return {
    ...spot,
    tags: spot.tags?.map((st: any) => st.tag) ?? [],
    reviewCount: spot._count?.reviews ?? 0,
    _count: undefined,
    tags: spot.tags?.map((st: any) => st.tag) ?? [],
  }
}

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
    getPrisma().spot.findMany({
      where,
      skip,
      take: limit,
      include: {
        ...spotInclude,
        facility: { select: facilitySelect },
      },
      orderBy: { createdAt: 'desc' },
    }),
    getPrisma().spot.count({ where }),
  ])

  const meta: PaginationMeta = { page, limit, total }

  const data = spots.map((spot: any) => ({
    ...mapSpot(spot),
    facility: spot.facility,
  }))

  return { data, meta }
}

export async function getNearbySpots(query: NearbySpotsQuery) {
  const { lat, lng, radius } = query

  const spots: any[] = await getPrisma().$queryRaw`
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
  const spot: any = await getPrisma().spot.findFirst({
    where: { id, isActive: true },
    include: {
      tags: { include: { tag: true } },
      facility: { select: detailFacilityInclude },
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

  const avgRating = await getPrisma().review.aggregate({
    where: { spotId: id },
    _avg: { rating: true },
  })

  return {
    data: {
      ...mapSpot(spot),
      averageRating: avgRating._avg.rating ?? 0,
      facility: spot.facility,
    },
  }
}

export async function createSpot(input: CreateSpotInput) {
  const { tagIds, facility: facilityInput, ...data } = input

  const spot: any = await getPrisma().spot.create({
    data: {
      ...data,
      photoUrls: data.photoUrls ?? [],
      tags: tagIds
        ? { create: tagIds.map((tagId) => ({ tagId })) }
        : undefined,
      facility: facilityInput
        ? {
            create: {
              ...facilityInput,
              toilets: facilityInput.toilets
                ? { create: facilityInput.toilets }
                : undefined,
            },
          }
        : undefined,
    },
    include: {
      tags: { include: { tag: true } },
      facility: { select: detailFacilityInclude },
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
  const existing = await getPrisma().spot.findUnique({ where: { id } })
  if (!existing || !existing.isActive) throw new NotFoundError('Spot not found')

  const { tagIds, facility: facilityInput, ...data } = input

  const spot: any = await getPrisma().$transaction(async (tx: any) => {
    if (tagIds) {
      await tx.spotTag.deleteMany({ where: { spotId: id } })
      await tx.spotTag.createMany({
        data: tagIds.map((tagId) => ({ spotId: id, tagId })),
      })
    }

    if (facilityInput) {
      const { toilets: toiletInput, ...facilityData } = facilityInput

      await tx.spotFacility.upsert({
        where: { spotId: id },
        create: {
          spotId: id,
          ...facilityData,
          toilets: toiletInput
            ? { create: toiletInput }
            : undefined,
        },
        update: facilityData,
      })

      if (toiletInput) {
        await tx.toilet.deleteMany({ where: { facility: { spotId: id } } })
        if (toiletInput.length > 0) {
          const facility = await tx.spotFacility.findUnique({ where: { spotId: id } })
          if (facility) {
            await tx.toilet.createMany({
              data: toiletInput.map((t: any) => ({ ...t, facilityId: facility.id })),
            })
          }
        }
      }
    }

    return tx.spot.update({
      where: { id },
      data,
      include: {
        tags: { include: { tag: true } },
      facility: { select: detailFacilityInclude },
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
  const existing = await getPrisma().spot.findUnique({ where: { id } })
  if (!existing || !existing.isActive) throw new NotFoundError('Spot not found')

  await getPrisma().spot.update({
    where: { id },
    data: { isActive: false },
  })

  return { data: { message: 'Spot deleted' } }
}
