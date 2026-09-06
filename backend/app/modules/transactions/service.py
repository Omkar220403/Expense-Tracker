from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.accounts.models import Account

from app.modules.transactions.models import Transaction
from app.modules.transactions.schemas import TransactionCreate, TransactionUpdate

class TransactionService:
    """Handle Transaction related database operations."""

    def __init__(self, session: Session):
        self.session = session

    def create_transaction(self, data: TransactionCreate) -> Transaction:
        """Create a new transaction."""

        account = self.session.get(Account, data.account_id)

        if account is None:
            return None

        transaction = Transaction(**data.model_dump())

        self.session.add(transaction)
        self.session.commit()
        self.session.refresh(transaction)

        return transaction

    def get_transactions(self) -> list[Transaction]:
        """Get all transactions."""

        statement = select(Transaction).order_by(Transaction.transaction_date.desc())

        return list(self.session.scalars(statement).all())

    def get_transaction(self, transaction_id: UUID) -> Transaction | None:
        """Get a transaction by ID."""
        statement = select(Transaction).where(Transaction.id == transaction_id)

        return self.session.scalar(statement)

    def update_transaction(self, transaction_id: UUID, data: TransactionUpdate) -> Transaction | None:
        """Update a transaction by ID."""

        transaction = self.get_transaction(transaction_id)

        if transaction is None:
            return None

        update_data = data.model_dump(exclude_unset = True)

        for field, value in update_data.items():    
            setattr(transaction, field, value)

        self.session.commit()
        self.session.refresh(transaction)

        return transaction

    def delete_transaction(self, transaction_id: UUID) -> bool:
        """Delete a transaction by ID."""

        transaction = self.get_transaction(transaction_id)

        if transaction is None:
            return False

        self.session.delete(transaction)
        self.session.commit()

        return True