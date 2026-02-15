#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUNTIME_DIR="$ROOT_DIR/runtime"
BACKEND_DIR="$RUNTIME_DIR/backend"
FRONTEND_DIR="$RUNTIME_DIR/frontend"

if [[ ! -f "$BACKEND_DIR/artisan" || ! -f "$FRONTEND_DIR/package.json" ]]; then
  echo "Runtime belum siap. Jalankan ./scripts/setup_demo.sh terlebih dahulu."
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker belum terpasang. Silakan install Docker untuk menjalankan PostgreSQL otomatis."
  exit 1
fi

echo "Menjalankan PostgreSQL container..."
docker compose up -d postgres

echo "Menunggu PostgreSQL siap..."
for i in {1..30}; do
  status=$(docker inspect --format='{{.State.Health.Status}}' doc-validation-postgres 2>/dev/null || echo "starting")
  if [[ "$status" == "healthy" ]]; then
    echo "PostgreSQL healthy."
    break
  fi
  sleep 2
  if [[ "$i" -eq 30 ]]; then
    echo "PostgreSQL tidak healthy dalam waktu yang ditentukan."
    exit 1
  fi
done

echo "Menjalankan migrasi + seeder..."
cd "$BACKEND_DIR"
cp -n .env.example .env || true
php artisan migrate --seed --force

cleanup() {
  echo "Menghentikan service demo..."
  kill "${PHP_PID:-0}" "${VITE_PID:-0}" >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "Menjalankan Laravel API di http://localhost:8000"
php artisan serve --host=0.0.0.0 --port=8000 &
PHP_PID=$!

echo "Menjalankan React UI di http://localhost:5173"
cd "$FRONTEND_DIR"
npm run dev -- --host 0.0.0.0 --port 5173 &
VITE_PID=$!

wait "$PHP_PID" "$VITE_PID"
