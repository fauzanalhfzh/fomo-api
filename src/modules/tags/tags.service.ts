import { getPrisma } from '../../core/prisma'

export async function listTags() {
  const tags = await getPrisma().tag.findMany({
    orderBy: { name: 'asc' },
  })

  return { data: tags }
}
