import app from './index'

const port = Number(process.env.PORT) 

Bun.serve({
  fetch: app.fetch,
  port,
})

console.log(`Listening on http://localhost:${port}`)
