# КиноТрекер

Клиент-серверное учебное веб-приложение для каталога фильмов и персонального учёта просмотра.

## Стек

- frontend: React, React Router, Bootstrap, Vite;
- backend: Django, Django REST Framework;
- авторизация: DRF TokenAuthentication;
- локальная БД: SQLite;
- production БД: PostgreSQL;
- production: Render.

## Возможности

- каталог из 35 фильмов;
- поиск и фильтрация по жанрам;
- рекомендации и рейтинг;
- отдельная страница фильма;
- регистрация, вход, выход и профиль;
- персональные статусы: «Хочу посмотреть», «Смотрю», «Просмотрено», «Отложено», «Брошено»;
- отметка «Любимое»;
- личная оценка 1–10;
- фильтрация личного списка;
- статистика пользователя;
- Django Admin;
- адаптивный интерфейс.

## Архитектура

```text
React frontend
      |
      | HTTP / JSON
      v
Django REST API
      |
      | Django ORM
      v
SQLite (локально) / PostgreSQL (production)
```

WebSocket в проекте не используется: все операции выполняются обычными REST-запросами.

## Постеры

Все 35 постеров хранятся отдельными WebP-файлами:

```text
frontend/public/posters/
```

Файл `frontend/src/posterData.js` содержит только соответствие между названием фильма и путём к постеру. Backend изображения фильмов не хранит.

## Основные API

- `GET /api/health/` — проверка backend;
- `GET /api/movies/` — каталог;
- `GET /api/movies/<id>/` — фильм;
- `GET /api/movies/recommended/` — 3 рекомендации;
- `GET /api/movies/popular/` — популярные фильмы;
- `GET /api/movies/genres/` — список жанров;
- `POST /api/auth/register/` — регистрация;
- `POST /api/auth/login/` — вход;
- `POST /api/auth/logout/` — выход;
- `GET /api/auth/me/` — текущий пользователь;
- `GET/PATCH /api/auth/profile/` — профиль;
- `GET/POST /api/library/` — личный список;
- `DELETE /api/library/<movie_id>/` — удалить фильм из личного списка.

## Первый запуск Windows

Требуются Python и Node.js.

1. Один раз запустите `setup-windows.bat`.
2. Для обычного запуска используйте `start-windows.bat`.
3. Для остановки используйте `stop-windows.bat`.

Локальные адреса:

- сайт: `http://127.0.0.1:5173/`;
- API: `http://127.0.0.1:8000/api/`;
- health check: `http://127.0.0.1:8000/api/health/`;
- admin: `http://127.0.0.1:8000/admin/`.

## База данных

Если переменная `DATABASE_URL` не задана, Django использует `backend/db.sqlite3`.

Если `DATABASE_URL` задана, используется PostgreSQL. Production-версия работает именно так, поэтому пользователи, статусы, оценки и «Любимое» сохраняются после redeploy backend.

## Production

- сайт: https://kinotracker-web.onrender.com
- API: https://kinotracker-api.onrender.com/api/
- GitHub: https://github.com/SanjiGugich/kinotracker

## Структура

```text
backend/
  kinotrack/       настройки Django
  movies/          модели, serializers, API, миграции, tests
frontend/
  public/posters/  WebP-постеры
  src/components/  переиспользуемые компоненты
  src/pages/       страницы приложения
```
