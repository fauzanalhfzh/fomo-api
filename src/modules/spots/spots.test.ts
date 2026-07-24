import { test, createTestUser, signIn, startServer, getFailed, BASE } from '../../../tests/helpers'

let accessToken = ''

async function main() {
  const stop = await startServer()
  console.log('\n📍 Spots Module Test\n')

  await test('Create test user', async () => {
    const { userId } = await createTestUser()
    console.log(`     User ID: ${userId}`)
  })

  await test('Sign in', async () => {
    const tokens = await signIn()
    accessToken = tokens.accessToken
  })

  await test('GET /api/spots (public) => 200', async () => {
    const res = await fetch(`${BASE}/api/spots`)
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    const body: any = await res.json()
    if (!body.data || !body.meta) throw new Error('Invalid response shape')
    console.log(`     ${body.data.length} spots, total: ${body.meta.total}`)
  })

  await test('GET /api/spots/:id (public) => 200', async () => {
    const list: any = await (await fetch(`${BASE}/api/spots`)).json()
    const spotId = list.data[0]?.id
    if (!spotId) throw new Error('No spots found')

    const res = await fetch(`${BASE}/api/spots/${spotId}`)
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    const body: any = await res.json()
    if (!body.data.facility) throw new Error('Missing facility data')
    console.log(`     ${body.data.name} — ${body.data.facility.toilets.length} toilet(s)`)
  })

  await test('GET /api/spots/nearby (with token) => 200', async () => {
    const res = await fetch(`${BASE}/api/spots/nearby?lat=-6.224&lng=106.802&radius=50`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
  })

  await test('GET /api/spots/nonexistent => 404', async () => {
    const res = await fetch(`${BASE}/api/spots/nonexistent`)
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`)
  })

  await test('POST /api/spots (user role) => 403', async () => {
    const res = await fetch(`${BASE}/api/spots`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Hack', address: 'Nowhere', latitude: 0, longitude: 0 }),
    })
    if (res.status !== 403) throw new Error(`Expected 403, got ${res.status}`)
  })

  await stop()
  console.log('\n✨ Spots tests complete\n')

  if (getFailed() > 0) process.exit(1)
}

main().catch((e) => { console.error('\n💥 Test failed:', e.message); process.exit(1) })
