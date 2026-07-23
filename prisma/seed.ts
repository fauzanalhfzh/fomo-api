import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

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
    prisma.tag.upsert({ where: { name: 'Wi-Fi' }, update: { icon: '📶', category: 'amenity' }, create: { name: 'Wi-Fi', icon: '📶', category: 'amenity' } }),
    prisma.tag.upsert({ where: { name: 'Plugs' }, update: { icon: '⚡', category: 'amenity' }, create: { name: 'Plugs', icon: '⚡', category: 'amenity' } }),
    prisma.tag.upsert({ where: { name: 'Quiet' }, update: { icon: '🤫', category: 'vibe' }, create: { name: 'Quiet', icon: '🤫', category: 'vibe' } }),
    prisma.tag.upsert({ where: { name: 'Night Owl' }, update: { icon: '🦉', category: 'vibe' }, create: { name: 'Night Owl', icon: '🦉', category: 'vibe' } }),
    prisma.tag.upsert({ where: { name: 'Smoking Area' }, update: { icon: '🚬', category: 'amenity' }, create: { name: 'Smoking Area', icon: '🚬', category: 'amenity' } }),
    prisma.tag.upsert({ where: { name: 'Parking' }, update: { icon: '🅿️', category: 'amenity' }, create: { name: 'Parking', icon: '🅿️', category: 'amenity' } }),
    prisma.tag.upsert({ where: { name: 'Outdoor' }, update: { icon: '🌿', category: 'amenity' }, create: { name: 'Outdoor', icon: '🌿', category: 'amenity' } }),
    prisma.tag.upsert({ where: { name: 'Pet Friendly' }, update: { icon: '🐾', category: 'amenity' }, create: { name: 'Pet Friendly', icon: '🐾', category: 'amenity' } }),
  ])
  console.log(`Created ${tags.length} tags`)

  const spotsData = [
    {
      name: 'Kopi Senja',
      description: 'Cafe dengan suasana vintage, cocok buat ngantor sambil nikmatin sore.',
      address: 'Jl. Malioboro No. 10, Yogyakarta',
      latitude: -7.797,
      longitude: 110.368,
      photoUrls: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800'],
      fomoScore: 4.5,
      priceMin: 20000,
      priceMax: 50000,
      openDays: 'Senin-Minggu',
      openTime: '07:00',
      closeTime: '22:00',
      website: 'https://kopisenja.id',
      socialMedia: {
        instagram: 'https://instagram.com/kopisenja',
        facebook: 'https://facebook.com/kopisenja',
      },
      tagNames: ['Wi-Fi', 'Plugs', 'Outdoor'],
      facility: {
        wifi: 'BANYAK' as const,
        wifiSpeed: '100 Mbps',
        plugs: 'ADA' as const,
        comfyDesk: 'ADA' as const,
        atmosphere: 'NYAMAN' as const,
        hasIndoor: true,
        toiletLevel: 'ADA' as const,
        toilets: [
          { type: 'DUDUK' as const, gender: 'UNISEX' as const, cleanliness: 4, hasDisabled: true, hasBabyFacility: false, hasMusholla: true, hasTissue: true, hasSoap: true, hasSanitizer: true, hasWastafel: true },
        ],
      },
    },
    {
      name: 'Work & Brew',
      description: 'Co-working space meets specialty coffee, lengkap dengan meeting room.',
      address: 'Jl. Sudirman No. 25, Jakarta Pusat',
      latitude: -6.224,
      longitude: 106.802,
      photoUrls: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800'],
      fomoScore: 4.8,
      priceMin: 35000,
      priceMax: 80000,
      openDays: 'Senin-Minggu',
      openTime: '06:00',
      closeTime: '23:00',
      website: 'https://workandbrew.id',
      socialMedia: {
        instagram: 'https://instagram.com/workandbrew',
        facebook: 'https://facebook.com/workandbrew',
        tiktok: 'https://tiktok.com/@workandbrew',
      },
      tagNames: ['Wi-Fi', 'Plugs', 'Quiet', 'Parking'],
      facility: {
        wifi: 'BANYAK' as const,
        wifiSpeed: '200 Mbps',
        plugs: 'BANYAK' as const,
        comfyDesk: 'BANYAK' as const,
        atmosphere: 'TENANG' as const,
        hasIndoor: true,
        toiletLevel: 'BANYAK' as const,
        toilets: [
          { type: 'DUDUK' as const, gender: 'PRIA' as const, cleanliness: 5, hasDisabled: true, hasBabyFacility: false, hasMusholla: true, hasTissue: true, hasSoap: true, hasSanitizer: true, hasWastafel: true },
          { type: 'DUDUK' as const, gender: 'WANITA' as const, cleanliness: 5, hasDisabled: true, hasBabyFacility: true, hasMusholla: false, hasTissue: true, hasSoap: true, hasSanitizer: true, hasWastafel: true },
        ],
      },
    },
    {
      name: 'Taman Baca Kopi',
      description: 'Cafe perpustakaan dengan koleksi buku dan quiet area.',
      address: 'Jl. Braga No. 45, Bandung',
      latitude: -6.916,
      longitude: 107.607,
      photoUrls: ['https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800'],
      fomoScore: 4.2,
      priceMin: 15000,
      priceMax: 40000,
      openDays: 'Selasa-Minggu',
      openTime: '09:00',
      closeTime: '21:00',
      socialMedia: {
        instagram: 'https://instagram.com/tamanbacakopi',
      },
      tagNames: ['Wi-Fi', 'Quiet', 'Pet Friendly'],
      facility: {
        wifi: 'BANYAK' as const,
        wifiSpeed: '50 Mbps',
        plugs: 'ADA' as const,
        comfyDesk: 'ADA' as const,
        atmosphere: 'TENANG' as const,
        hasIndoor: true,
        toiletLevel: 'ADA' as const,
        toilets: [
          { type: 'DUDUK' as const, gender: 'UNISEX' as const, cleanliness: 4, hasDisabled: false, hasBabyFacility: false, hasMusholla: false, hasTissue: true, hasSoap: true, hasSanitizer: false, hasWastafel: true },
        ],
      },
    },
    {
      name: 'The Garage Coffee',
      description: 'Cafe konsep industrial dengan area outdoor luas dan live music.',
      address: 'Jl. Kayoon No. 8, Surabaya',
      latitude: -7.263,
      longitude: 112.748,
      photoUrls: ['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800'],
      fomoScore: 4.0,
      priceMin: 25000,
      priceMax: 60000,
      openDays: 'Senin-Minggu',
      openTime: '10:00',
      closeTime: '02:00',
      socialMedia: {
        instagram: 'https://instagram.com/thegaragecoffee',
        tiktok: 'https://tiktok.com/@thegaragecoffee',
      },
      tagNames: ['Wi-Fi', 'Outdoor', 'Smoking Area', 'Parking'],
      facility: {
        wifi: 'ADA' as const,
        wifiSpeed: '30 Mbps',
        plugs: 'TIDAK_ADA' as const,
        comfyDesk: 'TIDAK_ADA' as const,
        atmosphere: 'HIDUP' as const,
        hasIndoor: false,
        toiletLevel: 'ADA' as const,
        toilets: [
          { type: 'JONGKOK' as const, gender: 'UNISEX' as const, cleanliness: 3, hasDisabled: false, hasBabyFacility: false, hasMusholla: false, hasTissue: false, hasSoap: true, hasSanitizer: true, hasWastafel: true },
        ],
      },
    },
    {
      name: 'Midnight Brew',
      description: 'Buka 24 jam, cocok buat night owl yang butuh tempat nugas malem-malem.',
      address: 'Jl. Sunset Road No. 88, Bali',
      latitude: -8.670,
      longitude: 115.153,
      photoUrls: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'],
      fomoScore: 4.6,
      priceMin: 30000,
      priceMax: 70000,
      openDays: 'Senin-Minggu',
      openTime: '00:00',
      closeTime: '23:59',
      website: 'https://midnightbrew.com',
      socialMedia: {
        instagram: 'https://instagram.com/midnightbrew',
        facebook: 'https://facebook.com/midnightbrew',
      },
      tagNames: ['Night Owl', 'Wi-Fi', 'Plugs', 'Outdoor'],
      facility: {
        wifi: 'BANYAK' as const,
        wifiSpeed: '150 Mbps',
        plugs: 'BANYAK' as const,
        comfyDesk: 'ADA' as const,
        atmosphere: 'NYAMAN' as const,
        hasIndoor: true,
        toiletLevel: 'ADA' as const,
        toilets: [
          { type: 'DUDUK' as const, gender: 'UNISEX' as const, cleanliness: 4, hasDisabled: true, hasBabyFacility: false, hasMusholla: true, hasTissue: true, hasSoap: true, hasSanitizer: true, hasWastafel: true },
        ],
      },
    },
  ]

  const reviewsData = [
    { rating: 5, content: 'Tempatnya nyaman banget, Wi-Fi kenceng! Cocok buat WFA.' },
    { rating: 4, content: 'Kopinya enak, suasananya aesthetic. Sayang agak ramai pas weekend.' },
    { rating: 3, content: 'Standard sih, harga agak mahal buat ukuran tempat ini.' },
  ]

  for (const spotData of spotsData) {
    const { tagNames, facility: facilityInput, ...data } = spotData
    const tagIds = tagNames.map((name) => {
      const tag = tags.find((t) => t.name === name)!
      return tag.id
    })

    const { toilets: toiletInput, ...facilityData } = facilityInput

    const spot = await prisma.spot.create({
      data: {
        ...data,
        tags: { create: tagIds.map((tagId) => ({ tagId })) },
        facility: {
          create: {
            ...facilityData,
            toilets: { create: toiletInput },
          },
        },
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
