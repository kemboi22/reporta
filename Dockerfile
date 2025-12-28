# syntax=docker/dockerfile:1.4

FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS prisma-generate
COPY --from=install /app/node_modules ./node_modules
COPY prisma ./prisma
RUN bunx prisma generate

FROM base AS builder
COPY --from=install /app/node_modules ./node_modules
COPY --from=prisma-generate /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma
COPY . .
RUN bun run build

FROM base AS production
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=install /app/node_modules ./node_modules
COPY --from=prisma-generate /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/.output ./.output
COPY prisma ./prisma

EXPOSE 3000

CMD ["bun", "run", ".output/server/index.mjs"]
