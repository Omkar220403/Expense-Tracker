import os

os.environ.setdefault(
    "DATABASE_URL", "postgresql+psycopg://expense_tracker:expense_tracker@localhost:5432/test_db"
)

from fastapi.testclient import TestClient

from app.main import app


def test_health_check_returns_ok() -> None:
    client = TestClient(app)

    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
