FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install

FROM oven/bun:1 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bunx prisma generate

FROM oven/bun:1 AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 --ingroup nodejs hono
COPY --from=build /app /app
EXPOSE 8787
USER hono
ENV PORT=8787
CMD ["bun", "run", "src/server.ts"]
