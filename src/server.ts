import app from './index'

const port = Number(process.env.PORT) || 8787

Bun.serve({
  fetch: app.fetch,
  port,
})

console.log(`Listening on http://localhost:${port}`)
