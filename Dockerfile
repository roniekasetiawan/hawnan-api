FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lock* ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

FROM oven/bun:1 AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV APP_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

CMD ["bun", "run", "dist/main.js"]
