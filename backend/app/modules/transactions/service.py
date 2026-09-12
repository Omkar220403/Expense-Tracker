from uuid import UUID

from sqlalchemy.orm import Session

from app.modules.accounts.repository import AccountRepository
from app.modules.transactions.exceptions import (
    InvalidTransactionAccountError,
    TransactionAccountNotFoundError,
)
from app.modules.transactions.models import Transaction
from app.modules.transactions.repository import TransactionRepository
from app.modules.transactions.schemas import TransactionCreate, TransactionUpdate


class TransactionService:
    """Handle Transaction related database operations."""

    def __init__(self, session: Session):
        self.session = session
        self.repository = TransactionRepository(session)
        self.account_repository = AccountRepository(session)

    def create_transaction(self, data: TransactionCreate) -> Transaction:
        """Create a new transaction."""

        account = self.account_repository.get_by_id(data.account_id)

        if account is None:
            raise TransactionAccountNotFoundError(data.account_id)

        transaction = Transaction(**data.model_dump())

        try:
            transaction = self.repository.create(transaction)
            self.session.commit()
            return transaction
        except Exception:
            self.session.rollback()
            raise

    def get_transactions(self) -> list[Transaction]:
        """Get all transactions."""

        return self.repository.get_all()

    def get_transaction(self, transaction_id: UUID) -> Transaction | None:
        """Get a transaction by ID."""

        return self.repository.get_by_id(transaction_id)

    def update_transaction(
        self,
        transaction_id: UUID,
        data: TransactionUpdate,
    ) -> Transaction | None:
        """Update a transaction by ID."""

        transaction = self.get_transaction(transaction_id)

        if transaction is None:
            return None

        update_data = data.model_dump(exclude_unset=True)

        if "account_id" in update_data:
            account_id = update_data["account_id"]
            if account_id is None:
                raise InvalidTransactionAccountError()

            account = self.account_repository.get_by_id(account_id)
            if account is None:
                raise TransactionAccountNotFoundError(account_id)

        for field, value in update_data.items():
            setattr(transaction, field, value)

        try:
            transaction = self.repository.update(transaction)
            self.session.commit()
            return transaction
        except Exception:
            self.session.rollback()
            raise

    def delete_transaction(self, transaction_id: UUID) -> bool:
        """Delete a transaction by ID."""

        try:
            deleted = self.repository.delete(transaction_id)

            if not deleted:
                return False

            self.session.commit()
            return True
        except Exception:
            self.session.rollback()
            raise
