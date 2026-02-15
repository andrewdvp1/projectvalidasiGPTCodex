#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUNTIME_DIR="$ROOT_DIR/runtime"
BACKEND_DIR="$RUNTIME_DIR/backend"
FRONTEND_DIR="$RUNTIME_DIR/frontend"

echo "[1/7] Menyiapkan folder runtime..."
mkdir -p "$RUNTIME_DIR"

if [[ ! -f "$BACKEND_DIR/artisan" ]]; then
  echo "[2/7] Membuat Laravel project baru..."
  composer create-project laravel/laravel "$BACKEND_DIR"
else
  echo "[2/7] Laravel project sudah ada, skip create-project"
fi

echo "[3/7] Menyalin konfigurasi API demo ke Laravel runtime..."
rsync -a --exclude='composer.json' --exclude='.env' "$ROOT_DIR/backend/" "$BACKEND_DIR/"

if [[ ! -f "$FRONTEND_DIR/package.json" ]]; then
  echo "[4/7] Membuat React project baru..."
  npm create vite@latest "$FRONTEND_DIR" -- --template react
else
  echo "[4/7] React project sudah ada, skip create-vite"
fi

echo "[5/7] Menyalin konfigurasi frontend demo..."
rsync -a "$ROOT_DIR/frontend/" "$FRONTEND_DIR/"

echo "[6/7] Install dependency backend..."
cd "$BACKEND_DIR"
composer install
cp -n .env.example .env || true
php artisan key:generate --force
php artisan storage:link || true

echo "[7/7] Install dependency frontend..."
cd "$FRONTEND_DIR"
npm install

echo "Selesai. Jalankan ./scripts/run_demo.sh"
