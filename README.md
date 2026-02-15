# Demo Sistem Validasi Dokumen (Laravel + React + PostgreSQL)

Repo ini sekarang **siap dipakai untuk demo** dengan pola:
- `backend/` dan `frontend/` = source overlay (fitur demo)
- `runtime/` = project Laravel & React nyata yang digenerate otomatis lewat script

Dengan cara ini, Anda cukup jalankan script untuk membuat project lengkap, install dependency, lalu menjalankan demo.

## Fitur Sistem

### Role
- User
- Validator
- Admin

### User
- Register & login
- Upload dokumen (PDF/JPG/PNG)
- Melihat status dokumen (pending/approved/rejected)
- Melihat catatan validator

### Validator
- Melihat dokumen status pending
- Approve / reject dokumen
- Mengisi catatan validasi

### Admin
- Kelola user
- Lihat semua dokumen
- Dashboard statistik (pending/approved/rejected/total users)

---

## Struktur Database PostgreSQL

### Tabel `users`
- `id` (PK)
- `name`
- `email` (unique)
- `password`
- `role` (`user`, `validator`, `admin`)
- `created_at`, `updated_at`

### Tabel `documents`
- `id` (PK)
- `user_id` (FK -> users.id)
- `title`
- `file_path`
- `status` (`pending`, `approved`, `rejected`)
- `validator_notes` (nullable)
- `validated_by` (FK -> users.id, nullable)
- `validated_at` (nullable)
- `created_at`, `updated_at`

---

## API Endpoint

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Documents
- `GET /api/documents`
- `POST /api/documents` (role: user)
- `GET /api/documents/{id}`
- `POST /api/documents/{id}/validate` (role: validator/admin)
- `DELETE /api/documents/{id}` (role: admin)

### Admin
- `GET /api/admin/users`
- `POST /api/admin/users`
- `PATCH /api/admin/users/{id}`
- `GET /api/admin/dashboard`

---

## Menjalankan Demo (Direkomendasikan)

### Prasyarat
- PHP 8.2+
- Composer
- Node.js 20+
- NPM
- Docker + Docker Compose (untuk PostgreSQL otomatis)

### 1) Setup sekali
```bash
./scripts/setup_demo.sh
```
Script ini akan:
1. Membuat project Laravel real ke `runtime/backend`
2. Menyalin source API demo dari folder `backend/`
3. Membuat project React real ke `runtime/frontend`
4. Menyalin source UI demo dari folder `frontend/`
5. Install dependency backend/frontend

### 2) Jalankan demo
```bash
./scripts/run_demo.sh
```
Script ini akan:
1. Menjalankan PostgreSQL (`docker compose up -d postgres`)
2. Menjalankan migrasi + seeder
3. Menyalakan Laravel API di `http://localhost:8000`
4. Menyalakan React UI di `http://localhost:5173`

---

## Akun Demo Seeder

Password semua akun: `password123`
- `admin@demo.com` (admin)
- `validator@demo.com` (validator)
- `user@demo.com` (user)

---

## Struktur Folder Penting

```txt
.
├── backend/                 # overlay backend (controller, model, middleware, route, migration, seeder)
├── frontend/                # overlay frontend (React pages, context, API client)
├── scripts/
│   ├── setup_demo.sh        # generator runtime + install dependency
│   └── run_demo.sh          # start postgres + migrate + run API/UI
├── docker-compose.yml       # service postgres
└── runtime/                 # terbuat otomatis oleh script
```

