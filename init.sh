#!/usr/bin/env bash
set -e

echo "== PyRunner backend setup =="
cd backend
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
cp -n .env.example .env || true
python3 -m app.scripts.init_db

echo "== PyRunner frontend setup =="
cd ../frontend
cp -n .env.example .env.local || true
npm install

echo "== All set =="
echo "Backend: cd backend && . .venv/bin/activate && ./start.sh"
echo "Frontend: cd frontend && npm run dev"
