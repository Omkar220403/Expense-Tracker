from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.transactions.models import Transaction


class TransactionRepository:
    """Handle database operations for transactions."""

    def __init__(self, session: Session):
        self.session = session

    def create(self, transaction: Transaction) -> Transaction:
        """Create a new transaction."""

        self.session.add(transaction)
        self.session.flush()
        self.session.refresh(transaction)

        return transaction

    def get_by_id(self, transaction_id: UUID) -> Transaction | None:
        """Get a transaction by its ID."""

        result = self.session.execute(select(Transaction).where(Transaction.id == transaction_id))

        return result.scalar_one_or_none()

    def get_all(self) -> list[Transaction]:
        """Get all transactions, newest first."""

        result = self.session.execute(
            select(Transaction).order_by(Transaction.transaction_date.desc())
        )

        return list(result.scalars().all())

    def update(self, transaction: Transaction) -> Transaction:
        """Persist changes to an existing transaction."""

        self.session.flush()
        self.session.refresh(transaction)

        return transaction

    def delete(self, transaction_id: UUID) -> bool:
        """Delete a transaction by its ID."""

        transaction = self.get_by_id(transaction_id)

        if transaction is None:
            return False

        self.session.delete(transaction)
        self.session.flush()

        return True
