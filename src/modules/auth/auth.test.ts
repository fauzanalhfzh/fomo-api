import { test, createTestUser, signIn, startServer, BASE } from '../../../tests/helpers'

let accessToken = ''
let refreshToken = ''

async function main() {
  const stop = await startServer()
  console.log('\n🔐 Auth Module Test\n')

  await test('Create test user', async () => {
    const { userId } = await createTestUser()
    console.log(`     User ID: ${userId}`)
  })

  await test('Sign in with email/password', async () => {
    const tokens = await signIn()
    accessToken = tokens.accessToken
    refreshToken = tokens.refreshToken
    console.log(`     access_token: ${accessToken.slice(0, 20)}...`)
  })

  await test('POST /api/auth/refresh (valid) => 200', async () => {
    const res = await fetch(`${BASE}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    const body: any = await res.json()
    if (!body.data.access_token) throw new Error('No access_token')
    console.log(`     New token: ${body.data.access_token.slice(0, 20)}...`)
  })

  await test('POST /api/auth/logout (valid) => 200', async () => {
    const res = await fetch(`${BASE}/api/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
  })

  await test('POST /api/auth/refresh after logout => 401', async () => {
    const res = await fetch(`${BASE}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`)
  })

  await test('POST /api/auth/google (invalid id_token) => 401', async () => {
    const res = await fetch(`${BASE}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token: 'invalid_token' }),
    })
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`)
  })

  await stop()
  console.log('\n✨ Auth tests complete\n')
}

main().catch((e) => { console.error('\n💥 Test failed:', e.message); process.exit(1) })
