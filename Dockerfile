FROM oven/bun:1
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile

COPY .output ./.output
COPY prisma ./prisma
COPY prisma.config.ts ./

EXPOSE 3000

CMD bunx prisma generate && bun .output/server/index.mjs
