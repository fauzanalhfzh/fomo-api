import { test, createTestUser, signIn, startServer, getFailed, BASE } from '../../../tests/helpers'

let accessToken = ''
let spotId = ''

async function main() {
  const stop = await startServer()
  console.log('\n🔖 Vault Module Test\n')

  await test('Create test user', async () => {
    const { userId } = await createTestUser()
    console.log(`     User ID: ${userId}`)
  })

  await test('Sign in', async () => {
    const tokens = await signIn()
    accessToken = tokens.accessToken
  })

  await test('Get first spot ID', async () => {
    const list: any = await (await fetch(`${BASE}/api/spots`)).json()
    spotId = list.data[0]?.id
    if (!spotId) throw new Error('No spots found')
    console.log(`     Spot: ${spotId}`)
  })

  await test('POST /api/vault (add spot) => 201', async () => {
    const res = await fetch(`${BASE}/api/vault`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ spotId }),
    })
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`)
    const body: any = await res.json()
    if (!body.data.spot) throw new Error('Missing spot data')
    if (body.data.spot.id !== spotId) throw new Error('Wrong spot returned')
    console.log(`     Saved: ${body.data.spot.name}`)
  })

  await test('POST /api/vault (duplicate) => 201 (upsert)', async () => {
    const res = await fetch(`${BASE}/api/vault`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ spotId }),
    })
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`)
  })

  await test('GET /api/vault (list) => 200', async () => {
    const res = await fetch(`${BASE}/api/vault`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    const body: any = await res.json()
    if (!Array.isArray(body.data)) throw new Error('Invalid response')
    if (body.data.length < 1) throw new Error('Expected at least 1 saved spot')
    console.log(`     ${body.data.length} spot(s) in vault`)
  })

  await test('GET /api/vault (no auth) => 401', async () => {
    const res = await fetch(`${BASE}/api/vault`)
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`)
  })

  await test('POST /api/vault (no auth) => 401', async () => {
    const res = await fetch(`${BASE}/api/vault`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spotId }),
    })
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`)
  })

  await test('POST /api/vault (invalid spotId) => 404', async () => {
    const res = await fetch(`${BASE}/api/vault`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ spotId: 'nonexistent' }),
    })
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`)
  })

  await test('DELETE /api/vault/:spotId (remove) => 200', async () => {
    const res = await fetch(`${BASE}/api/vault/${spotId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    console.log(`     Spot removed from vault`)
  })

  await test('DELETE /api/vault/:spotId (double delete) => 404', async () => {
    const res = await fetch(`${BASE}/api/vault/${spotId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`)
  })

  await test('DELETE /api/vault/:spotId (no auth) => 401', async () => {
    const res = await fetch(`${BASE}/api/vault/${spotId}`, {
      method: 'DELETE',
    })
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`)
  })

  await stop()
  console.log('\n✨ Vault tests complete\n')

  if (getFailed() > 0) process.exit(1)
}

main().catch((e) => { console.error('\n💥 Test failed:', e.message); process.exit(1) })
