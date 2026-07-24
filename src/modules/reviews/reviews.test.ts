import { test, createTestUser, signIn, startServer, getFailed, BASE } from '../../../tests/helpers'

let accessToken = ''

async function main() {
  const stop = await startServer()
  console.log('\n💬 Reviews Module Test\n')

  await test('Create test user', async () => {
    const { userId } = await createTestUser()
    console.log(`     User ID: ${userId}`)
  })

  await test('Sign in', async () => {
    const tokens = await signIn()
    accessToken = tokens.accessToken
  })

  let spotId = ''
  await test('Get first spot ID', async () => {
    const list: any = await (await fetch(`${BASE}/api/spots`)).json()
    spotId = list.data[0]?.id
    if (!spotId) throw new Error('No spots found')
    console.log(`     Spot: ${spotId}`)
  })

  let reviewId = ''
  await test('POST /api/spots/:spotId/reviews (create) => 201', async () => {
    const res = await fetch(`${BASE}/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 4, content: 'Cozy place!' }),
    })
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`)
    const body: any = await res.json()
    reviewId = body.data.id
    if (body.data.rating !== 4) throw new Error('Wrong rating')
    console.log(`     Review ID: ${reviewId} — rating: ${body.data.rating}`)
  })

  await test('POST /api/spots/:spotId/reviews (no auth) => 401', async () => {
    const res = await fetch(`${BASE}/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 3 }),
    })
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`)
  })

  await test('GET /api/spots/:spotId/reviews (list) => 200', async () => {
    const res = await fetch(`${BASE}/api/spots/${spotId}/reviews`)
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    const body: any = await res.json()
    if (!Array.isArray(body.data)) throw new Error('Invalid response')
    if (body.data.length < 1) throw new Error('Expected at least 1 review')
    console.log(`     ${body.data.length} review(s), total: ${body.meta.total}`)
  })

  await test('GET /api/reviews/:id (detail) => 200', async () => {
    const res = await fetch(`${BASE}/api/reviews/${reviewId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    const body: any = await res.json()
    if (body.data.id !== reviewId) throw new Error('Wrong review returned')
    console.log(`     Rating: ${body.data.rating}, content: ${body.data.content}`)
  })

  await test('PATCH /api/reviews/:id (update) => 200', async () => {
    const res = await fetch(`${BASE}/api/reviews/${reviewId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 3, content: 'Updated review' }),
    })
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    const body: any = await res.json()
    if (body.data.rating !== 3) throw new Error('Rating not updated')
    console.log(`     Rating: ${body.data.rating}, content: ${body.data.content}`)
  })

  await test('DELETE /api/reviews/:id => 200', async () => {
    const res = await fetch(`${BASE}/api/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    console.log(`     Review deleted`)
  })

  await test('GET /api/reviews/:id after delete => 404', async () => {
    const res = await fetch(`${BASE}/api/reviews/${reviewId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`)
  })

  await test('GET /api/spots/nonexistent/reviews => 404', async () => {
    const res = await fetch(`${BASE}/api/spots/nonexistent/reviews`)
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`)
  })

  await stop()
  console.log('\n✨ Reviews tests complete\n')

  if (getFailed() > 0) process.exit(1)
}

main().catch((e) => { console.error('\n💥 Test failed:', e.message); process.exit(1) })
