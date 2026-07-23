import { createClient } from '@supabase/supabase-js'

export const TEST_EMAIL = 'testuser@fomo.app'
export const TEST_PASSWORD = 'Test123!@#'
export const BASE = `http://localhost:${process.env.PORT || 6767}`
const PORT = process.env.PORT || 6767

export function ensureEnv(name: string): string {
  const val = process.env[name]
  if (!val) throw new Error(`${name} is not set`)
  return val
}

export async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn()
    console.log(`  ✅ ${name}`)
  } catch (e: any) {
    console.log(`  ❌ ${name} — ${e.message}`)
  }
}

export async function createTestUser() {
  const admin = createClient(
    ensureEnv('SUPABASE_URL'),
    ensureEnv('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { autoRefreshToken: false, persistSession: false } },
  )

  const { data: existing } = await admin.auth.admin.listUsers()
  const found = existing.users.find((u) => u.email === TEST_EMAIL)
  if (found) return { userId: found.id, admin }

  const { data, error } = await admin.auth.admin.createUser({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    email_confirm: true,
  })
  if (error) throw error
  return { userId: data.user.id, admin }
}

export async function signIn() {
  const client = createClient(
    ensureEnv('SUPABASE_URL'),
    ensureEnv('SUPABASE_ANON_KEY'),
  )
  const { data, error } = await client.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  })
  if (error) throw error
  return {
    accessToken: data.session!.access_token,
    refreshToken: data.session!.refresh_token,
  }
}

async function isPortFree(port: number | string): Promise<boolean> {
  try {
    const res = await fetch(`http://localhost:${port}`)
    if (res.ok || res.status !== 0) return false
    return false
  } catch {
    return true
  }
}

async function waitForPort(port: number | string, timeoutMs = 8000): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`http://localhost:${port}`)
      if (res.ok || res.status === 404 || res.status === 401) return
    } catch {}
    await new Promise((r) => setTimeout(r, 300))
  }
  throw new Error(`Server on port ${port} did not start within ${timeoutMs}ms`)
}

export async function startServer(): Promise<() => Promise<void>> {
  // kill existing on port
  try {
    const kill = Bun.spawnSync(['sh', '-c', `lsof -ti:${PORT} | xargs kill -9 2>/dev/null`])
  } catch {}

  await new Promise((r) => setTimeout(r, 1000))

  const proc = Bun.spawn(['bun', 'run', 'src/server.ts'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env },
  })

  await waitForPort(PORT)

  return async () => {
    proc.kill()
    await proc.exited
    // give OS a moment to release the port
    await new Promise((r) => setTimeout(r, 500))
  }
}
