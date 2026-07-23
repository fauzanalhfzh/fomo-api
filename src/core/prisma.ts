import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

let _prisma: PrismaClient | null = null

function createPrisma() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  return new PrismaClient({ adapter })
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
