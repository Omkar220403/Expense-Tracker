from datetime import UTC, datetime
from decimal import Decimal

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.core.database import Base
from app.core.enums import AccountType, TransactionType
from app.modules.accounts.models import Account
from app.modules.transactions.models import Transaction
from app.modules.transactions.repository import TransactionRepository


def test_transaction_repository_crud() -> None:
    """The repository owns transaction persistence operations."""

    engine = create_engine("sqlite://")
    Base.metadata.create_all(engine)

    with Session(engine) as session:
        account = Account(name="Cash", account_type=AccountType.CASH)
        session.add(account)
        session.commit()

        repository = TransactionRepository(session)
        transaction = repository.create(
            Transaction(
                account_id=account.id,
                transaction_type=TransactionType.EXPENSE,
                amount=Decimal("42.50"),
                transaction_date=datetime(2026, 9, 9, tzinfo=UTC),
            )
        )
        session.commit()

        assert repository.get_by_id(transaction.id) is transaction
        assert repository.get_all() == [transaction]

        transaction.notes = "Lunch"
        assert repository.update(transaction).notes == "Lunch"
        session.commit()

        assert repository.delete(transaction.id) is True
        session.commit()
        assert repository.get_by_id(transaction.id) is None
        assert repository.delete(transaction.id) is False
