import { z } from '@hono/zod-openapi'

export const UpdateProfileSchema = z.object({
  alias: z.string().max(100).openapi({
    example: 'John Doe',
    description: 'Display name',
  }).optional(),
  avatarUrl: z.string().url().openapi({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar URL',
  }).optional(),
}).openapi('UpdateProfile')

export const UserProfileSchema = z.object({
  id: z.string().openapi({ example: 'supabase-user-id' }),
  email: z.string().nullable().openapi({ example: 'user@example.com' }),
  alias: z.string().nullable().openapi({ example: 'John Doe' }),
  avatarUrl: z.string().nullable().openapi({ example: 'https://example.com/avatar.jpg' }),
  role: z.string().openapi({ example: 'user' }),
  createdAt: z.string().datetime(),
}).openapi('UserProfile')

export const UserProfileResponseSchema = z.object({
  data: UserProfileSchema,
}).openapi('UserProfileResponse')

export const DeleteUserResponseSchema = z.object({
  data: z.object({
    message: z.string().openapi({ example: 'Account deleted' }),
  }),
}).openapi('DeleteUserResponse')

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>
