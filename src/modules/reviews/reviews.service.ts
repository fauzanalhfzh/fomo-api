import { getPrisma } from '../../core/prisma'
import { NotFoundError, ForbiddenError } from '../../core/errors'
import type { CreateReviewInput, UpdateReviewInput, SpotReviewsQuery } from './reviews.schema'
import type { PaginationMeta } from '../../shared/types'

const reviewInclude = {
  user: { select: { id: true, alias: true, avatarUrl: true } },
}

function mapReview(r: any) {
  return {
    id: r.id,
    rating: r.rating,
    content: r.content,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    user: r.user,
  }
}

export async function listSpotReviews(spotId: string, query: SpotReviewsQuery) {
  const { page, limit } = query
  const skip = (page - 1) * limit

  const spot = await getPrisma().spot.findUnique({ where: { id: spotId } })
  if (!spot || !spot.isActive) throw new NotFoundError('Spot not found')

  const [reviews, total] = await Promise.all([
    getPrisma().review.findMany({
      where: { spotId },
      skip,
      take: limit,
      include: reviewInclude,
      orderBy: { createdAt: 'desc' },
    }),
    getPrisma().review.count({ where: { spotId } }),
  ])

  const meta: PaginationMeta = { page, limit, total }
  return { data: reviews.map(mapReview), meta }
}

export async function createReview(spotId: string, userId: string, input: CreateReviewInput) {
  const spot = await getPrisma().spot.findUnique({ where: { id: spotId } })
  if (!spot || !spot.isActive) throw new NotFoundError('Spot not found')

  const review = await getPrisma().review.create({
    data: {
      rating: input.rating,
      content: input.content ?? null,
      userId,
      spotId,
    },
    include: reviewInclude,
  })

  return { data: mapReview(review) }
}

export async function getReview(id: string) {
  const review: any = await getPrisma().review.findUnique({
    where: { id },
    include: reviewInclude,
  })

  if (!review) throw new NotFoundError('Review not found')

  return { data: mapReview(review) }
}

export async function updateReview(id: string, userId: string, input: UpdateReviewInput) {
  const review = await getPrisma().review.findUnique({ where: { id } })
  if (!review) throw new NotFoundError('Review not found')
  if (review.userId !== userId) throw new ForbiddenError('Cannot edit others review')

  const updated = await getPrisma().review.update({
    where: { id },
    data: input,
    include: reviewInclude,
  })

  return { data: mapReview(updated) }
}

export async function deleteReview(id: string, userId: string) {
  const review = await getPrisma().review.findUnique({ where: { id } })
  if (!review) throw new NotFoundError('Review not found')
  if (review.userId !== userId) throw new ForbiddenError('Cannot delete others review')

  await getPrisma().review.delete({ where: { id } })

  return { data: { message: 'Review deleted' } }
}
