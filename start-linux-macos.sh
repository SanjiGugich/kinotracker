#!/usr/bin/env bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
(cd "$ROOT/backend" && source .venv/bin/activate && python manage.py migrate && python manage.py ensure_seeded && python manage.py runserver 127.0.0.1:8000) &
BACK_PID=$!
trap 'kill $BACK_PID 2>/dev/null || true' EXIT
until curl -fsS http://127.0.0.1:8000/api/health/ >/dev/null; do sleep 1; done
(cd "$ROOT/frontend" && npm run dev -- --host 127.0.0.1) &
FRONT_PID=$!
trap 'kill $BACK_PID $FRONT_PID 2>/dev/null || true' EXIT
wait
