import { test, createTestUser, signIn, startServer, getFailed, BASE } from '../../../tests/helpers'
import { getPrisma } from '../../core/prisma'

let userAccessToken = ''
let adminAccessToken = ''
let suggestionId = ''

async function main() {
  const stop = await startServer()
  console.log('\n📬 Suggestions Module Test\n')

  const userId = (await createTestUser()).userId
  console.log(`     User ID: ${userId}`)

  await test('Sign in as regular user', async () => {
    const tokens = await signIn()
    userAccessToken = tokens.accessToken
  })

  await test('Create admin user', async () => {
    const { userId } = await createTestUser('admin@fomo.app', 'Admin123!@#')
    await getPrisma().user.upsert({
      where: { id: userId },
      create: { id: userId, email: 'admin@fomo.app', role: 'admin' },
      update: { role: 'admin' },
    })
    console.log(`     Admin ID: ${userId}`)
  })

  await test('Sign in as admin', async () => {
    const tokens = await signIn('admin@fomo.app', 'Admin123!@#')
    adminAccessToken = tokens.accessToken
  })

  await test('POST /api/suggestions (user) => 201', async () => {
    const res = await fetch(`${BASE}/api/suggestions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${userAccessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        alias: 'Budi',
        contactDrop: 'budi@email.com',
        theIntel: 'Kafe baru di Senayan, nama Kopi Nusantara. Wi-Fi kenceng!',
      }),
    })
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`)
    const body: any = await res.json()
    suggestionId = body.data.id
    if (body.data.status !== 'PENDING') throw new Error('Expected PENDING status')
    console.log(`     Suggestion ID: ${suggestionId}`)
  })

  await test('POST /api/suggestions (no auth) => 401', async () => {
    const res = await fetch(`${BASE}/api/suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alias: 'X', contactDrop: 'x@x.com', theIntel: 'test' }),
    })
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`)
  })

  await test('GET /api/suggestions (user) => 403', async () => {
    const res = await fetch(`${BASE}/api/suggestions`, {
      headers: { Authorization: `Bearer ${userAccessToken}` },
    })
    if (res.status !== 403) throw new Error(`Expected 403, got ${res.status}`)
  })

  await test('GET /api/suggestions (admin) => 200', async () => {
    const res = await fetch(`${BASE}/api/suggestions`, {
      headers: { Authorization: `Bearer ${adminAccessToken}` },
    })
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    const body: any = await res.json()
    if (!Array.isArray(body.data)) throw new Error('Invalid response')
    console.log(`     ${body.data.length} suggestion(s)`)
  })

  await test('PATCH /api/suggestions/:id (admin approve) => 200', async () => {
    const res = await fetch(`${BASE}/api/suggestions/${suggestionId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminAccessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'APPROVED' }),
    })
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    const body: any = await res.json()
    if (body.data.status !== 'APPROVED') throw new Error('Status not updated')
    console.log(`     Status: ${body.data.status}`)
  })

  await test('PATCH /api/suggestions/:id (user) => 403', async () => {
    const res = await fetch(`${BASE}/api/suggestions/${suggestionId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${userAccessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'REJECTED' }),
    })
    if (res.status !== 403) throw new Error(`Expected 403, got ${res.status}`)
  })

  await test('PATCH /api/suggestions/:invalid => 404', async () => {
    const res = await fetch(`${BASE}/api/suggestions/nonexistent`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminAccessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'APPROVED' }),
    })
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`)
  })

  await test('GET /api/suggestions?status=APPROVED (admin) => 200', async () => {
    const res = await fetch(`${BASE}/api/suggestions?status=APPROVED`, {
      headers: { Authorization: `Bearer ${adminAccessToken}` },
    })
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    const body: any = await res.json()
    console.log(`     ${body.data.length} approved suggestion(s)`)
  })

  await stop()
  console.log('\n✨ Suggestions tests complete\n')

  if (getFailed() > 0) process.exit(1)
}

main().catch((e) => { console.error('\n💥 Test failed:', e.message); process.exit(1) })
