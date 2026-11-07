# uzex-devtones

> Краткое описание проекта для хакатона UzEx.

## Структура проекта

```
├── frontend/          # React + TypeScript (Vite)
├── backend/
│   ├── api/           # Python + FastAPI
│   └── ml-service/    # Python + FastAPI, ML-модели
├── data/              # Демо-датасеты UzEx (CSV, JSON, дампы лотов)
├── docs/screenshots/  # Скриншоты для README
├── docker-compose.yml # Запуск всего стека одной командой
└── README.md          # Инструкция для жюри + скриншоты
```

## Быстрый старт (для жюри)

Требуется: [Docker](https://docs.docker.com/get-docker/) с Docker Compose.

```bash
git clone <repo-url>
cd hackathon
docker compose up --build
```

После запуска:

| Сервис     | Адрес                  |
|------------|------------------------|
| Frontend   | http://localhost:3000  |
| Backend    | http://localhost:8000  |
| ML-service | http://localhost:8001  |

## Демо-данные

Демо-датасеты лежат в `data/` и монтируются в backend и ml-service по пути `/data`.

## Скриншоты

<!-- Добавьте изображения в docs/screenshots/ и подключите их здесь -->
<!-- ![Главная страница](docs/screenshots/main.png) -->

## Команда

- ...
