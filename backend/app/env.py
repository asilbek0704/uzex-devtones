"""Загрузка project/backend/.env в окружение. Без внешних зависимостей.

Формат: строки KEY=value, пустые строки и строки с # пропускаются, кавычки вокруг значения снимаются.
Переменные, которые уже заданы в окружении, не перезаписываются.
"""

import os
from pathlib import Path

ENV_PATH = Path(__file__).resolve().parent.parent / ".env"


def load_env(path: Path = ENV_PATH) -> list[str]:
    """Возвращает имена загруженных переменных (без значений)."""
    if not path.is_file():
        return []
    loaded = []
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip().removeprefix("export ").strip()
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "'\"":
            value = value[1:-1]
        if key and value and key not in os.environ:
            os.environ[key] = value
            loaded.append(key)
    return loaded
