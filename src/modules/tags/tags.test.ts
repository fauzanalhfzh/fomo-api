import { test, startServer, BASE } from '../../../tests/helpers'

async function main() {
  const stop = await startServer()
  console.log('\n🏷️ Tags Module Test\n')

  await test('GET /api/tags (public) => 200', async () => {
    const res = await fetch(`${BASE}/api/tags`)
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    const body: any = await res.json()
    if (!body.data || !Array.isArray(body.data)) throw new Error('Invalid response shape')
    console.log(`     ${body.data.length} tags returned`)
  })

  await stop()
  console.log('\n✨ Tags tests complete\n')
}

main().catch((e) => { console.error('\n💥 Test failed:', e.message); process.exit(1) })
