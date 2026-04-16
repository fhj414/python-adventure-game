#!/usr/bin/env bash
set -e

python3 -m app.scripts.init_db
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
