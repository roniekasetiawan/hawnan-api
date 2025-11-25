# Dockerfile
FROM oven/bun:1

WORKDIR /app

COPY package.json bunfig.toml tsconfig.json ./
RUN bun install

COPY src ./src
COPY .env .env

CMD ["bun", "run", "src/main.ts"]
