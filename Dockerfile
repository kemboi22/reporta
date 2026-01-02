# -------- Base --------
FROM oven/bun:1 AS base
WORKDIR /app

# -------- Dependencies --------
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# -------- Builder --------
FROM base AS builder
COPY --from=deps /app /app
COPY . .

ENV NODE_OPTIONS="--max-old-space-size=6144"
ENV NITRO_PRESET=bun

RUN bun run build

# -------- Production --------
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=deps /app /app
COPY --from=builder /app/.output ./.output
COPY prisma ./prisma
COPY prisma.config.ts ./

EXPOSE 3000

# Prisma generate at runtime (safe)
CMD bunx prisma generate && bun .output/server/index.mjs
