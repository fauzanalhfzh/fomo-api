import { PrismaClient } from '../src/generated/prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
} as never).$extends(withAccelerate())

async function main() {
  console.log('Seeding database...')

  const seedUser = await prisma.user.upsert({
    where: { id: '__seed__' },
    update: {},
    create: {
      id: '__seed__',
      email: 'seed@fomo.app',
      alias: 'Seed User',
    },
  })
  console.log(`Created seed user: ${seedUser.id}`)

  const tags = await Promise.all([
    prisma.tag.upsert({ where: { name: 'Wi-Fi' }, update: {}, create: { name: 'Wi-Fi' } }),
    prisma.tag.upsert({ where: { name: 'Plugs' }, update: {}, create: { name: 'Plugs' } }),
    prisma.tag.upsert({ where: { name: 'Quiet' }, update: {}, create: { name: 'Quiet' } }),
    prisma.tag.upsert({ where: { name: 'Night Owl' }, update: {}, create: { name: 'Night Owl' } }),
    prisma.tag.upsert({ where: { name: 'Smoking Area' }, update: {}, create: { name: 'Smoking Area' } }),
    prisma.tag.upsert({ where: { name: 'Parking' }, update: {}, create: { name: 'Parking' } }),
    prisma.tag.upsert({ where: { name: 'Outdoor' }, update: {}, create: { name: 'Outdoor' } }),
    prisma.tag.upsert({ where: { name: 'Pet Friendly' }, update: {}, create: { name: 'Pet Friendly' } }),
  ])
  console.log(`Created ${tags.length} tags`)

  const spotsData = [
    {
      name: 'Kopi Senja',
      description: 'Cafe dengan suasana vintage, cocok buat ngantor sambil nikmatin sore.',
      address: 'Jl. Malioboro No. 10, Yogyakarta',
      latitude: -7.797,
      longitude: 110.368,
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
      fomoScore: 4.5,
      tagNames: ['Wi-Fi', 'Plugs', 'Outdoor'],
    },
    {
      name: 'Work & Brew',
      description: 'Co-working space meets specialty coffee, lengkap dengan meeting room.',
      address: 'Jl. Sudirman No. 25, Jakarta Pusat',
      latitude: -6.224,
      longitude: 106.802,
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      fomoScore: 4.8,
      tagNames: ['Wi-Fi', 'Plugs', 'Quiet', 'Parking'],
    },
    {
      name: 'Taman Baca Kopi',
      description: 'Cafe perpustakaan dengan koleksi buku dan quiet area.',
      address: 'Jl. Braga No. 45, Bandung',
      latitude: -6.916,
      longitude: 107.607,
      imageUrl: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800',
      fomoScore: 4.2,
      tagNames: ['Wi-Fi', 'Quiet', 'Pet Friendly'],
    },
    {
      name: 'The Garage Coffee',
      description: 'Cafe konsep industrial dengan area outdoor luas dan live music.',
      address: 'Jl. Kayoon No. 8, Surabaya',
      latitude: -7.263,
      longitude: 112.748,
      imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
      fomoScore: 4.0,
      tagNames: ['Wi-Fi', 'Outdoor', 'Smoking Area', 'Parking'],
    },
    {
      name: 'Midnight Brew',
      description: 'Buka 24 jam, cocok buat night owl yang butuh tempat nugas malem-malem.',
      address: 'Jl. Sunset Road No. 88, Bali',
      latitude: -8.670,
      longitude: 115.153,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      fomoScore: 4.6,
      tagNames: ['Night Owl', 'Wi-Fi', 'Plugs', 'Outdoor'],
    },
  ]

  const reviewsData = [
    { rating: 5, content: 'Tempatnya nyaman banget, Wi-Fi kenceng! Cocok buat WFA.' },
    { rating: 4, content: 'Kopinya enak, suasananya aesthetic. Sayang agak ramai pas weekend.' },
    { rating: 3, content: 'Standard sih, harga agak mahal buat ukuran tempat ini.' },
  ]

  for (const spotData of spotsData) {
    const { tagNames, ...data } = spotData
    const tagIds = tagNames.map((name) => {
      const tag = tags.find((t) => t.name === name)!
      return tag.id
    })

    const spot = await prisma.spot.create({
      data: {
        ...data,
        tags: { create: tagIds.map((tagId) => ({ tagId })) },
      },
    })

    for (const review of reviewsData) {
      await prisma.review.create({
        data: {
          ...review,
          spotId: spot.id,
          userId: seedUser.id,
        },
      })
    }

    console.log(`Created spot: ${spot.name} (${spot.id})`)
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
