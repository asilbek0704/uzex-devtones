#!/bin/sh
# Запуск ruff той же версии, что в CI (.github/workflows/backend.yml).
# Порядок: uvx (скачает нужную версию сам) → ruff из .venv сервиса → ruff из PATH.
RUFF_VERSION=0.17.4

if command -v uvx >/dev/null 2>&1; then
  exec uvx "ruff@$RUFF_VERSION" "$@"
fi

root=$(cd "$(dirname "$0")/.." && pwd)
for venv in "$root/backend/api/.venv" "$root/backend/ml-service/.venv"; do
  if [ -x "$venv/bin/ruff" ]; then
    exec "$venv/bin/ruff" "$@"
  fi
done

if command -v ruff >/dev/null 2>&1; then
  exec ruff "$@"
fi

echo "ruff не найден. Установите uv: brew install uv (или pip install ruff==$RUFF_VERSION)" >&2
exit 1
