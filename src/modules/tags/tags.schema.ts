import { z } from '@hono/zod-openapi'

export const TagSchema = z.object({
  id: z.string().openapi({ example: 'clx123abc' }),
  name: z.string().openapi({ example: 'Wi-Fi' }),
  icon: z.string().nullable().openapi({ example: '📶' }),
  category: z.string().nullable().openapi({ example: 'amenity' }),
}).openapi('Tag')

export const ListTagsResponseSchema = z.object({
  data: z.array(TagSchema),
}).openapi('ListTagsResponse')

export type ListTagsResponse = z.infer<typeof ListTagsResponseSchema>
