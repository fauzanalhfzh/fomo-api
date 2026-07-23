import { test, createTestUser, signIn, startServer, BASE } from '../../../tests/helpers'

let accessToken = ''

async function main() {
  const stop = await startServer()
  console.log('\n👤 Users Module Test\n')

  await test('Create test user', async () => {
    const { userId } = await createTestUser()
    console.log(`     User ID: ${userId}`)
  })

  await test('Sign in', async () => {
    const tokens = await signIn()
    accessToken = tokens.accessToken
    console.log(`     access_token: ${tokens.accessToken.slice(0, 20)}...`)
  })

  await test('GET /api/users/me (with token) => 200', async () => {
    const res = await fetch(`${BASE}/api/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    const body: any = await res.json()
    if (!body.data || !body.data.id) throw new Error('Invalid response shape')
    console.log(`     alias: ${body.data.alias || '(none)'} — role: ${body.data.role}`)
  })

  await test('PATCH /api/users/me (update alias) => 200', async () => {
    const res = await fetch(`${BASE}/api/users/me`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ alias: 'Uji Coba' }),
    })
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    const body: any = await res.json()
    if (body.data.alias !== 'Uji Coba') throw new Error('Alias not updated')
    console.log(`     alias updated to: ${body.data.alias}`)
  })

  await test('GET /api/users/me (verify persisted) => 200', async () => {
    const res = await fetch(`${BASE}/api/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const body: any = await res.json()
    if (body.data.alias !== 'Uji Coba') throw new Error('Alias not persisted')
    console.log(`     alias confirmed: ${body.data.alias}`)
  })

  await stop()
  console.log('\n✨ Users tests complete\n')
}

main().catch((e) => { console.error('\n💥 Test failed:', e.message); process.exit(1) })
