#!/bin/sh
# pytest в сервисе бэкенда: sh scripts/pytest.sh backend/api
# Окружение: .venv сервиса → uv (если есть pyproject.toml) → системный python3.
# Код 5 (тестов пока нет) ошибкой не считается — как в CI.
cd "$1" || exit 1

# Python-кода в сервисе ещё нет — проверять нечего
if ! find . -name '*.py' -not -path './.venv/*' | grep -q .; then
  echo "$1: Python-кода пока нет"
  exit 0
fi

if [ -x .venv/bin/python ]; then
  .venv/bin/python -m pytest -q
elif command -v uv >/dev/null 2>&1 && [ -f pyproject.toml ]; then
  uv run --with pytest pytest -q
else
  python3 -m pytest -q
fi

code=$?
if [ "$code" -eq 5 ]; then
  echo "$1: тестов пока нет"
  exit 0
fi
exit "$code"
