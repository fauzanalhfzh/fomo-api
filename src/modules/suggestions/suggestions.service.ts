import { getPrisma } from '../../core/prisma'
import { NotFoundError, ForbiddenError } from '../../core/errors'
import type { CreateSuggestionInput, UpdateSuggestionInput, ListSuggestionsQuery } from './suggestions.schema'

const include = {
  suggestedBy: { select: { id: true, alias: true, email: true } },
  reviewedBy: { select: { id: true, alias: true } },
}

function mapSuggestion(s: any) {
  return {
    id: s.id,
    alias: s.alias,
    contactDrop: s.contactDrop,
    theIntel: s.theIntel,
    status: s.status,
    suggestedBy: s.suggestedBy,
    reviewedBy: s.reviewedBy,
    reviewedAt: s.reviewedAt?.toISOString() ?? null,
    createdAt: s.createdAt.toISOString(),
  }
}

export async function createSuggestion(userId: string, input: CreateSuggestionInput) {
  const suggestion: any = await getPrisma().suggestion.create({
    data: {
      alias: input.alias,
      contactDrop: input.contactDrop,
      theIntel: input.theIntel,
      suggestedById: userId,
    },
    include,
  })

  return { data: mapSuggestion(suggestion) }
}

export async function listSuggestions(query: ListSuggestionsQuery) {
  const where: any = {}
  if (query.status) where.status = query.status

  const suggestions: any[] = await getPrisma().suggestion.findMany({
    where,
    include,
    orderBy: { createdAt: 'desc' },
  })

  return { data: suggestions.map(mapSuggestion) }
}

export async function updateSuggestion(id: string, adminId: string, input: UpdateSuggestionInput) {
  const existing = await getPrisma().suggestion.findUnique({ where: { id } })
  if (!existing) throw new NotFoundError('Suggestion not found')

  const suggestion: any = await getPrisma().suggestion.update({
    where: { id },
    data: {
      status: input.status,
      reviewedById: adminId,
      reviewedAt: new Date(),
    },
    include,
  })

  return { data: mapSuggestion(suggestion) }
}
