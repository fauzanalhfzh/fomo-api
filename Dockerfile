FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install

FROM oven/bun:1 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN DATABASE_URL=postgresql://p:p@localhost:5432/db bunx prisma generate

FROM oven/bun:1 AS runner
WORKDIR /app
COPY --from=build /app /app
EXPOSE 8787
USER bun
ENV PORT=8787
CMD ["bun", "run", "src/server.ts"]
