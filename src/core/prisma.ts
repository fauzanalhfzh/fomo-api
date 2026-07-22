import { PrismaClient } from '../generated/prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const accelerateUrl = process.env.DATABASE_URL

export const prisma = new PrismaClient({ accelerateUrl } as never).$extends(
  withAccelerate(),
)
