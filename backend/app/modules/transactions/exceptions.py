from uuid import UUID

from app.shared.exceptions import DomainError, ResourceNotFoundError


class TransactionAccountNotFoundError(ResourceNotFoundError):
    """Raised when a transaction references an account that does not exist."""

    def __init__(self, account_id: UUID):
        self.detail = f"Account with ID {account_id} not found."


class InvalidTransactionAccountError(DomainError):
    """Raised when a transaction update removes its required account."""

    detail = "A transaction must belong to an account."
