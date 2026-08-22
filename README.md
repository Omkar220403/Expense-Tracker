# Smart Expense Tracker

A personal, local-first expense tracker. This repository currently establishes the application foundation only: a Next.js frontend, a FastAPI backend, PostgreSQL configuration, Alembic migrations, and a browser-to-API health check.

## Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Python, FastAPI, Pydantic, SQLAlchemy 2.0, Alembic
- Database: PostgreSQL
- Tooling: npm, uv, pytest, Ruff

## Architecture

The frontend and backend are separate applications. Backend dependencies flow in one direction: `Router → Service → Repository → PostgreSQL`.

Only the health module exists today; future domain modules will use this three-layer structure. See [architecture notes](docs/architecture.md) and [database notes](docs/database.md).

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

Create the database named in `DATABASE_URL` before running migrations. The supplied development URL expects an `expense_tracker` database, user, and password; replace it if your PostgreSQL setup differs.

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

Schema changes are migration-only; the application does not create tables at startup. When the first SQLAlchemy models are added, generate a reviewed migration from `backend/`:

```powershell
uv run alembic revision --autogenerate -m "create initial domain tables"
uv run alembic upgrade head
```

## Next milestone

Build the Account domain end to end: SQLAlchemy model and migration, repository, service, schemas, REST routes, and focused tests. That establishes the reusable pattern for categories and transactions.
