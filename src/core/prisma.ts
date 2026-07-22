import { PrismaClient } from '../generated/prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

let _prisma: ReturnType<typeof createPrisma> | null = null

function createPrisma() {
  const accelerateUrl = process.env.DATABASE_URL
  return new PrismaClient({ accelerateUrl } as never).$extends(withAccelerate())
}

export function getPrisma() {
  if (!_prisma) {
    _prisma = createPrisma()
  }
  return _prisma
}

export async function initPrisma() {
  try {
    getPrisma()
    console.log('Prisma client initialized')
  } catch (e) {
    console.warn('Prisma client not available:', (e as Error).message)
  }
}
