import type { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'

interface Entry {
  count: number
  resetAt: number
}

export function rateLimit(max: number, windowSec: number) {
  const store = new Map<string, Entry>()
  const interval = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (now >= entry.resetAt) store.delete(key)
    }
  }, 60_000)
  if (interval.unref) interval.unref()

  return async (c: Context, next: Next) => {
    const ip = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
      || c.req.header('x-real-ip')
      || 'unknown'

    const key = `${ip}:${c.req.path}`
    const now = Date.now()
    const entry = store.get(key)

    if (!entry || now >= entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowSec * 1000 })
    } else if (entry.count >= max) {
      throw new HTTPException(429, {
        message: `Too many requests. Try again in ${Math.ceil((entry.resetAt - now) / 1000)}s`,
      })
    } else {
      entry.count++
    }

    await next()
  }
}
