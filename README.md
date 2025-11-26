# HAWNAN API

Hawnan API adalah backend **modular monolith** yang dibangun dengan **Bun** dan **Hono** untuk ekosistem _Masjid Sejuta Pemuda_, meliputi:

- Fundraising (wakaf, donasi, infaq, zakat)
- Dompet digital **MSPay** (topup, payment, subscription)
- Fitur Qur'an & ibadah (Qur'an digital, jadwal salat, target ibadah)
- Event & ticketing kajian/kegiatan pemuda
- Ekosistem sosial & marketplace pemuda
- Gamification (poin, leveling, leaderboard)

> ⚠️ **Catatan:** Codebase ini bersifat **proprietary** dan tidak boleh digunakan kembali di proyek lain tanpa izin tertulis.

---

## 🚀 Tech Stack

- **Runtime:** Bun
- **Framework:** Hono
- **Language:** TypeScript
- **Architecture:** Modular Monolith / Domain-driven structure
- **Database:** PostgreSQL (planned)
- **Cache / Queue:** Redis (planned)
- **Object Storage:** MinIO (planned)
- **Payment Gateway:** Xendit (planned)
- **Other Tools:** ESLint, Prettier, Husky, Commitlint, Docker

---

## 📂 Struktur Project (High Level)

```
src/
├── app/          # Bootstrap Hono app, middleware global, route registry
├── config/       # Environment, logger, config umum
├── core/         # Core engine (wallet, ledger, payments, events, gamification)
├── infra/        # Database, cache, storage, queue, observability
├── modules/      # Domain modules (auth, fundraising, worship, social, market, dll)
├── websocket/    # WebSocket server & channels
└── workers/      # Background jobs, cron, EOD recon
```

---

## 🛠 Development Setup

### 1. Prasyarat

Pastikan sudah terinstall:

- Bun → https://bun.sh
- Git
- Node.js (opsional, untuk integrasi tooling JetBrains/VSCode)

---

### 2. Install dependencies

```
bun install
```

---

### 3. Menjalankan server (development)

```
bun run dev
```

Atau:

```
bun run src/main.ts
```

Server berjalan di `http://localhost:8080`.

Cek health:

```
curl http://localhost:8080/health
```

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

Project ini memakai:

- **ESLint** (`.eslintrc.cjs`)
- **Prettier** (`prettier.config.cjs`)
- **Husky** + **lint-staged**
- **Commitlint** (`commitlint.config.cjs`)

### Contoh format commit (Conventional Commits):

- `feat: add wallet manager`
- `fix: handle xendit callback error`
- `refactor: improve donation service`
- `chore: setup eslint and prettier`

Commit yang tidak sesuai format akan ditolak otomatis oleh hook `commitlint`.

---

## 🧪 Testing (Coming Soon)

- Unit tests (Vitest)
- Integration tests
- E2E tests (Postman/Newman or k6)

---

## 🐳 Docker (Coming Soon)

Rencana `docker-compose` untuk development:

- API service
- PostgreSQL
- Redis
- MinIO
- Loki/Grafana (opsional observability)

---

## 🔐 License

Repository ini berada di bawah **Proprietary License (All Rights Reserved)**.  
Semua detail ada di file [`LICENSE.md`](./LICENSE.md).

Penggunaan, penyalinan, modifikasi, distribusi, atau eksploitasi komersial **dilarang** tanpa izin tertulis dari pemilik hak cipta.
