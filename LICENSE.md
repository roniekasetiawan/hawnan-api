# HAWNAN API

Hawnan API adalah backend **modular monolith** yang dibangun dengan **Bun** dan **Hono** untuk ekosistem _Masjid Sejuta Pemuda_, meliputi:

- Fundraising (wakaf, donasi, infaq, zakat)
- Dompet digital **MSPay** (topup, payment, subscription)
- Fitur Qur'an & ibadah (Qur'an digital, jadwal salat, target ibadah)
- Event & ticketing pemuda
- Ekosistem sosial & marketplace pemuda
- Gamification (poin, leveling, leaderboard)

> ⚠️ **Catatan:** Codebase ini bersifat **proprietary** dan tidak boleh digunakan kembali tanpa izin tertulis.

---

## 🚀 Tech Stack

- **Runtime:** Bun
- **Framework:** Hono
- **Language:** TypeScript
- **Architecture:** Modular Monolith / Domain-driven structure
- **ORM:** Prisma ORM v7 (menggunakan prisma.config.ts)
- **Database:** PostgreSQL
- **Cache / Queue:** Redis
- **Object Storage:** MinIO
- **Payment Gateway:** Xendit
- **Other Tools:** ESLint, Prettier, Husky, Commitlint, Docker, Bun test (coming soon)

---

## 📂 Struktur Project (High Level)

```
src/
├── app/          # Bootstrap Hono app, middleware global, route registry
├── config/       # Environment, logger, konfigurasi umum
├── core/         # Core engine (wallet, ledger, payments, events, gamification)
├── infra/        # Prisma client, PostgreSQL, Redis, MinIO, Queue, Observability
├── modules/      # Domain modules (auth, fundraising, worship, social, market, dll)
├── websocket/    # WebSocket server & channels
└── workers/      # Background jobs, cron, EOD recon
```

---

## 🛠 Development Setup

### 1. Prasyarat

Pastikan telah menginstal:

- Bun → https://bun.sh
- Git
- Docker (opsional untuk local services)
- Node.js (opsional untuk tooling tertentu)

---

### 2. Install Dependencies

```
bun install
```

---

### 3. Menjalankan Server (Development)

```
bun run dev
```

Atau langsung:

```
bun run src/main.ts
```

Server berjalan pada:

```
http://localhost:8080
```

Cek health endpoint:

```
curl http://localhost:8080/health
```

---

## 🧩 Prisma ORM (v7)

Project ini menggunakan **Prisma ORM v7** dengan arsitektur baru:

- Tidak menggunakan `url = env("DATABASE_URL")` di `schema.prisma`
- URL koneksi didefinisikan melalui **prisma.config.ts**
- Prisma Client di-*generate* ke folder khusus, bukan `@prisma/client`

### 📁 Struktur Prisma

```
prisma/
├── schema.prisma
├── prisma.config.ts
└── migrations/
```

### ⚙️ Contoh schema.prisma

```
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma-client"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  wallets   Wallet[]
}

model Wallet {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  balance   BigInt   @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### ⚙️ Contoh prisma.config.ts

```
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'
import path from 'node:path'

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
```

### 🔧 Generate Prisma Client

```
bunx --bun prisma generate
```

### 🗂 Migrasi Database

```
bunx --bun prisma migrate dev --name init
```

### 📦 Menggunakan PrismaClient

```
import { PrismaClient } from '../generated/prisma-client'

export const prisma = new PrismaClient()
```

> ```
> /generated
> ```

---

## 📜 Scripts

```
bun run dev               # Development server
bun run start             # Start server tanpa watch
bun run lint              # Lint seluruh kode
bun run lint:fix          # ESLint auto-fix
```

---

## 🧹 Code Style & Linting

Project ini menggunakan:

- **ESLint** (`.eslintrc.cjs`)
- **Prettier** (`prettier.config.cjs`)
- **Husky** + **lint-staged**
- **Commitlint** (`commitlint.config.cjs`)

### Format Commit (Conventional Commits)

- `feat: add wallet manager`
- `fix: handle xendit callback error`
- `refactor: improve donation service`
- `chore: setup prisma config`

---

## 🧪 Testing (Coming Soon)

- Unit tests (Bun test / Vitest)
- Integration tests
- E2E tests (Postman/Newman atau k6)

---

## 🐳 Docker (Coming Soon)

`docker-compose.yml` (plan):

- API service
- PostgreSQL
- Redis
- MinIO
- Loki / Grafana untuk observability

---

## 🔐 License

Repository ini berada di bawah **Proprietary License (All Rights Reserved)**.  
Penggunaan, penyalinan, modifikasi, distribusi, atau eksploitasi komersial **dilarang** tanpa izin tertulis dari pemilik hak cipta.

