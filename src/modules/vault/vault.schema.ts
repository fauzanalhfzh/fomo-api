import { z } from '@hono/zod-openapi'

export const AddToVaultSchema = z.object({
  spotId: z.string().min(1).openapi({
    example: 'clx456def',
    description: 'Spot ID to save',
  }),
})

export const VaultSpotSchema = z.object({
  id: z.string(),
  savedAt: z.string().datetime(),
  spot: z.object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    photoUrls: z.array(z.string()),
    fomoScore: z.number(),
    priceMin: z.number().int().nullable(),
    priceMax: z.number().int().nullable(),
  }),
}).openapi('VaultSpot')

export const VaultListResponseSchema = z.object({
  data: z.array(VaultSpotSchema),
}).openapi('VaultListResponse')

export const AddToVaultResponseSchema = z.object({
  data: VaultSpotSchema,
}).openapi('AddToVaultResponse')

export const DeleteVaultResponseSchema = z.object({
  data: z.object({
    message: z.string().openapi({ example: 'Spot removed from vault' }),
  }),
}).openapi('DeleteVaultResponse')

export const spotIdParamSchema = z.object({
  spotId: z.string().openapi({
    param: { name: 'spotId', in: 'path' },
    example: 'clx456def',
    description: 'Spot ID',
  }),
})

export type AddToVaultInput = z.infer<typeof AddToVaultSchema>
