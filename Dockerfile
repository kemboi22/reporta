FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS install
RUN mkdir -p /app/deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS prisma-generate
COPY --from=install /app/node_modules ./node_modules
COPY prisma ./prisma
RUN bunx prisma generate

FROM base AS builder
COPY --from=install /app/node_modules ./node_modules
COPY --from=prisma-generate /app/app/generated ./app/generated
COPY . .
RUN bun run build

FROM base AS production
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=install /app/node_modules ./node_modules
COPY --from=prisma-generate /app/app/generated ./app/generated
COPY --from=builder /app/.output ./.output
COPY prisma ./prisma
RUN bunx prisma generate

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["bun", "run", ".output/server/index.mjs"]
