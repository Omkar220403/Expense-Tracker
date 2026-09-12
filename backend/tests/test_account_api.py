from collections.abc import Generator
from datetime import UTC, datetime
from decimal import Decimal

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db_session
from app.core.enums import AccountType, TransactionType
from app.main import app
from app.modules.accounts.models import Account
from app.modules.transactions.models import Transaction


def test_account_api_returns_client_errors_for_invalid_requests() -> None:
    """Validation and account-history failures are not exposed as 500s."""

    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)

    def get_test_session() -> Generator[Session, None, None]:
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_db_session] = get_test_session
    client = TestClient(app)
    try:
        invalid_credit_card = client.post(
            "/api/v1/accounts",
            json={"name": "Card", "account_type": "credit_card"},
        )
        assert invalid_credit_card.status_code == 422

        account = Account(name="Cash", account_type=AccountType.CASH)
        transaction = Transaction(
            account=account,
            transaction_type=TransactionType.EXPENSE,
            amount=Decimal("1.00"),
            transaction_date=datetime(2026, 9, 12, tzinfo=UTC),
        )
        with Session(engine) as session:
            session.add_all([account, transaction])
            session.commit()
            account_id = account.id

        protected_delete = client.delete(f"/api/v1/accounts/{account_id}")
        assert protected_delete.status_code == 409
    finally:
        app.dependency_overrides.clear()
        Base.metadata.drop_all(engine)


def test_account_and_transaction_payload_bounds_are_validated() -> None:
    """Requests cannot reach database constraints with invalid user input."""

    client = TestClient(app)

    null_name = client.patch(
        "/api/v1/accounts/00000000-0000-0000-0000-000000000000",
        json={"name": None},
    )
    assert null_name.status_code == 422

    long_description = client.post(
        "/api/v1/transactions",
        json={
            "account_id": "00000000-0000-0000-0000-000000000000",
            "transaction_type": "expense",
            "amount": "1.00",
            "description": "x" * 256,
            "transaction_date": "2026-09-12T00:00:00Z",
        },
    )
    assert long_description.status_code == 422
