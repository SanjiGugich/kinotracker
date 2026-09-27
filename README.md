# КиноТрекер v10

Полноценное клиент-серверное веб-приложение каталога фильмов: React + Django REST API.

## Возможности

- каталог и поиск фильмов;
- рекомендации и рейтинг;
- подробная страница фильма и актёрский состав;
- лёгкие SVG-обложки генерируются API и не требуют внешнего файлового хранилища;
- регистрация и вход;
- постоянные аккаунты пользователей;
- персональные статусы «Хочу посмотреть / Смотрю / Просмотрено»;
- избранное и личная оценка;
- профиль и статистика пользователя;
- Django Admin;
- локальный запуск для защиты;
- подготовка к Vercel + Render + PostgreSQL.

## Почему пользователи не пропадают

Локально Django хранит пользователей, пароли (в виде безопасных хэшей), токены и личные списки в `backend/db.sqlite3`. Обычный `start-windows.bat` **не удаляет и не пересоздаёт эту базу**.

В онлайне нужно использовать PostgreSQL. `DATABASE_URL` автоматически переключает Django с SQLite на PostgreSQL. Поэтому аккаунты и списки сохраняются при перезапусках и новых деплоях сервера.

> Не удаляйте `backend/db.sqlite3`, если хотите сохранить локальных пользователей.

## Первый запуск Windows

1. Установите Python и Node.js.
2. Один раз запустите `setup-windows.bat`.
3. После завершения используйте только `start-windows.bat`.
4. Для остановки — `stop-windows.bat`.

При обычном запуске:

- Django проверяет миграции;
- каталог заполняется **только если таблица фильмов пуста**;
- сервер ждёт готовности API;
- затем запускается React;
- браузер открывается автоматически.

## Адреса локально

- сайт: `http://127.0.0.1:5173/`
- API: `http://127.0.0.1:8000/api/`
- проверка API: `http://127.0.0.1:8000/api/health/`
- Django Admin: `http://127.0.0.1:8000/admin/`

Создание администратора:

```bat
cd backend
.venv\Scripts\activate
python manage.py createsuperuser
```

## GitHub

Создайте пустой репозиторий и из корня проекта выполните:

```bash
git init
git add .
git commit -m "KinoTracker v10"
git branch -M main
git remote add origin https://github.com/SanjiGugich/kinotracker.git
git push -u origin main
```

`.gitignore` уже исключает локальную БД, `.venv`, `node_modules` и секреты.

## Backend онлайн: Render + PostgreSQL

В корне есть `render.yaml`.

1. На Render выберите **New > Blueprint** и репозиторий GitHub.
2. Render создаст backend и PostgreSQL.
3. В переменных backend задайте:
   - `CORS_ALLOWED_ORIGINS=https://YOUR-FRONTEND.vercel.app`
   - `CSRF_TRUSTED_ORIGINS=https://YOUR-FRONTEND.vercel.app`
4. `DATABASE_URL` будет взят из PostgreSQL автоматически.
5. Проверка после деплоя: `https://YOUR-API.onrender.com/api/health/`.

Во время build Render автоматически выполняет миграции и заполнит каталог только при пустой БД.

## Frontend онлайн: Vercel

1. Импортируйте тот же GitHub-репозиторий в Vercel.
2. Root Directory: `frontend`.
3. Build command: `npm run build`.
4. Output Directory: `dist`.
5. Добавьте environment variable:

```text
VITE_API_URL=https://YOUR-API.onrender.com/api
```

6. После получения домена Vercel добавьте его в `CORS_ALLOWED_ORIGINS` backend на Render.

`frontend/vercel.json` уже настроен для React Router.

## Важное различие локальной и онлайн-базы

Локальная SQLite и онлайн PostgreSQL — разные базы. Поэтому пользователь, созданный локально, автоматически не появляется онлайн. После публикации реальные пользователи регистрируются в онлайн-версии и остаются в PostgreSQL.

## Для защиты

Рекомендуется держать оба варианта:

- публичную онлайн-ссылку Vercel;
- локальную копию и `start-windows.bat` на ноутбуке, чтобы защита не зависела от интернета.


## Production repository

GitHub: `SanjiGugich/kinotracker`. Production uses PostgreSQL; local development uses SQLite unless `DATABASE_URL` is set.


## Production status

Онлайн-версия развернута и проверена:

- Сайт: https://kinotracker-web.onrender.com
- API: https://kinotracker-api.onrender.com/api/
- Health check: https://kinotracker-api.onrender.com/api/health/
- GitHub: https://github.com/SanjiGugich/kinotracker

Production backend использует PostgreSQL.

Проверка сохранения данных после принудительного redeploy:

- до регистрации: users=0, library_entries=0;
- после регистрации и работы с личным списком: users=1, library_entries=3;
- после нового deploy значения сохранились;
- backend подтвердил: Database backend: postgresql.

Таким образом, аккаунты пользователей и их персональные списки не зависят от жизненного цикла Django-инстанса и хранятся в PostgreSQL.


## Демонстрационная версия с постерами

Текущая версия использует 35 постеров, предоставленных автором проекта. Для стабильной работы на Render изображения оптимизированы в WebP и встроены в frontend. Кадры из фильмов из интерфейса удалены; карточки и страницы фильмов используют только постеры.
