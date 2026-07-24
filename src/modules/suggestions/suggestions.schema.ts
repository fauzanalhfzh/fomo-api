import { z } from '@hono/zod-openapi'

export const SuggestionStatusEnum = z.enum(['PENDING', 'APPROVED', 'REJECTED']).openapi({
  example: 'PENDING',
})

export const CreateSuggestionSchema = z.object({
  alias: z.string().min(1).max(100).openapi({
    example: 'Budi',
    description: 'Pengirim',
  }),
  contactDrop: z.string().min(1).max(255).openapi({
    example: 'budi@email.com',
    description: 'Email/HP pengirim',
  }),
  theIntel: z.string().min(1).max(5000).openapi({
    example: 'Ada kafe baru di daerah Senayan, namanya Kopi Nusantara. Wi-Fi kenceng, colokan banyak!',
    description: 'Detail tempat',
  }),
})

export const UpdateSuggestionSchema = z.object({
  status: SuggestionStatusEnum,
  reviewNote: z.string().max(1000).openapi({
    example: 'Disetujui, spot akan ditambahkan',
    description: 'Catatan admin',
  }).optional(),
})

export const SuggestionSchema = z.object({
  id: z.string(),
  alias: z.string(),
  contactDrop: z.string(),
  theIntel: z.string(),
  status: SuggestionStatusEnum,
  suggestedBy: z.object({
    id: z.string(),
    alias: z.string().nullable(),
    email: z.string().nullable(),
  }).nullable(),
  reviewedBy: z.object({
    id: z.string(),
    alias: z.string().nullable(),
  }).nullable(),
  reviewedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
}).openapi('Suggestion')

export const SuggestionResponseSchema = z.object({
  data: SuggestionSchema,
}).openapi('SuggestionResponse')

export const SuggestionListResponseSchema = z.object({
  data: z.array(SuggestionSchema),
}).openapi('SuggestionListResponse')

export const suggestionIdParamSchema = z.object({
  id: z.string().openapi({
    param: { name: 'id', in: 'path' },
    example: 'clx999ijk',
    description: 'Suggestion ID',
  }),
})

export const listSuggestionsQuerySchema = z.object({
  status: SuggestionStatusEnum.optional().openapi({
    param: { name: 'status', in: 'query' },
    description: 'Filter by status',
  }),
})

export type CreateSuggestionInput = z.infer<typeof CreateSuggestionSchema>
export type UpdateSuggestionInput = z.infer<typeof UpdateSuggestionSchema>
export type ListSuggestionsQuery = z.infer<typeof listSuggestionsQuerySchema>
