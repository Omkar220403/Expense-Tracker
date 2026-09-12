# Smart Expense Tracker

A personal, local-first expense tracker with account and transaction REST APIs, a Next.js frontend, PostgreSQL persistence, and Alembic migrations.

## Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Python, FastAPI, Pydantic, SQLAlchemy 2.0, Alembic
- Database: PostgreSQL
- Tooling: npm, uv, pytest, Ruff

## Architecture

The frontend and backend are separate applications. Backend dependencies flow in one direction: `Router → Service → Repository → PostgreSQL`.

The health, account, and transaction modules use this three-layer structure. See [architecture notes](docs/architecture.md) and [database notes](docs/database.md).

## Prerequisites

- Node.js 20.9 or later and npm
- Python 3.12 or later
- [uv](https://docs.astral.sh/uv/)
- A local PostgreSQL 16+ instance

## Configure environment

Copy the root example, then adjust `DATABASE_URL` for your local PostgreSQL instance:

```powershell
Copy-Item .env.example .env
Copy-Item frontend/.env.example frontend/.env.local
```

Create the database named in `DATABASE_URL` before running migrations. The example uses local development credentials (`expense_tracker` / `expense_tracker`); replace them for your PostgreSQL setup.

## Run the backend

```powershell
cd backend
uv sync --all-groups
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --port 8000
```

Open `http://localhost:8000/docs`; `GET /api/v1/health` returns `{ "status": "ok" }` without requiring a database query.

## Run the frontend

In another terminal:

```powershell
cd frontend
npm run dev
```

Open `http://localhost:3000`. The landing page calls the backend health endpoint and shows its connection state.

## Quality checks

```powershell
cd backend
uv run ruff check .
uv run pytest

cd ../frontend
npm run lint
npm run build
```

## Migrations

Schema changes are migration-only; the application does not create tables at startup. Generate and review future migrations from `backend/`:

```powershell
uv run alembic revision --autogenerate -m "create initial domain tables"
uv run alembic upgrade head
```

## Next milestone

Build categories, reporting, imports, and the frontend workflows on top of the existing account and transaction APIs.
