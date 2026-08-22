# Architecture

Smart Expense Tracker is a local-first modular monolith. The browser-facing Next.js application is separate from the FastAPI API; all domain and persistence decisions remain in the backend.

## Backend layers

`Router → Service → Repository → PostgreSQL`

- Routers validate HTTP input with Pydantic schemas and serialize responses.
- Services hold business rules and use repositories rather than SQL directly.
- Repositories own SQLAlchemy persistence queries.
- SQLAlchemy models describe database persistence; Alembic migrations exclusively manage schema changes.

New domains live in `backend/app/modules/<domain>/`. When implemented, each will normally contain `router.py`, `service.py`, `repository.py`, `models.py`, `schemas.py`, and `exceptions.py`. Empty domain directories are intentionally not pre-created.

## Data flow

`Next.js UI → /api/v1 FastAPI router → service → repository → PostgreSQL`

The frontend reads its API base URL from `NEXT_PUBLIC_API_URL`; the backend reads its database connection from `DATABASE_URL`.

## AI boundary

Future business services will call a provider-neutral AI service. That service will depend on an AI-provider interface, with Gemini and OpenRouter implementations supplied later. No provider SDK or API key is coupled into a domain service.

## Privacy

Raw statements and normalized transactions remain separate when importing is introduced. Configuration and logs must never include credentials, full account/card numbers, tokens, or complete statements.
