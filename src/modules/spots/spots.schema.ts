import { z } from 'zod'

export const createSpotSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  address: z.string().min(1).max(500),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  imageUrl: z.string().url().optional(),
  tagIds: z.array(z.string()).optional(),
})

export const updateSpotSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  address: z.string().min(1).max(500).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  imageUrl: z.string().url().optional(),
  tagIds: z.array(z.string()).optional(),
})

export const listSpotsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  tag: z.string().optional(),
  q: z.string().optional(),
})

export const nearbySpotsQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(0.1).max(100).default(5),
})

export type CreateSpotInput = z.infer<typeof createSpotSchema>
export type UpdateSpotInput = z.infer<typeof updateSpotSchema>
export type ListSpotsQuery = z.infer<typeof listSpotsQuerySchema>
export type NearbySpotsQuery = z.infer<typeof nearbySpotsQuerySchema>
