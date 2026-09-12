from app.shared.exceptions import DomainError


class InvalidAccountDataError(DomainError):
    """Raised when account data violates a business rule."""

    status_code = 422

    def __init__(self, detail: str):
        self.detail = detail


class AccountHasTransactionsError(DomainError):
    """Raised when deleting an account that has financial history."""

    status_code = 409
    detail = "Accounts with transactions cannot be deleted. Deactivate the account instead."
