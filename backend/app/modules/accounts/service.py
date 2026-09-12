from decimal import Decimal
from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.enums import AccountType
from app.modules.accounts.exceptions import AccountHasTransactionsError, InvalidAccountDataError
from app.modules.accounts.models import Account
from app.modules.accounts.repository import AccountRepository
from app.modules.accounts.schemas import AccountCreate, AccountUpdate


class AccountService:
    """Handle business logic for accounts."""

    def __init__(self, session: Session):
        self.repository = AccountRepository(session)
        self.session = session

    def create_account(self, data: AccountCreate) -> Account:
        """Create a new account"""

        self._validate_account_data(
            account_type=data.account_type,
            credit_limit=data.credit_limit,
        )

        account = Account(
            name=data.name,
            account_type=data.account_type,
            institution=data.institution,
            currency=data.currency.upper(),
            credit_limit=data.credit_limit,
        )

        try:
            account = self.repository.create(account)
            self.session.commit()
            return account

        except Exception:
            self.session.rollback()
            raise

    def get_account(self, account_id: UUID) -> Account | None:
        """Get an account by ID."""

        return self.repository.get_by_id(account_id)

    def get_accounts(self) -> list[Account]:
        """Get all accounts."""

        return self.repository.get_all()

    def update_account(
        self,
        account_id: UUID,
        data: AccountUpdate,
    ) -> Account | None:
        """Update an existing account."""

        account = self.repository.get_by_id(account_id)

        if account is None:
            return None

        if "name" in data.model_fields_set:
            account.name = data.name

        if "institution" in data.model_fields_set:
            account.institution = data.institution

        if "currency" in data.model_fields_set:
            if data.currency is None:
                raise InvalidAccountDataError("Currency cannot be null.")

            account.currency = data.currency.upper()

        if "credit_limit" in data.model_fields_set:
            if data.credit_limit is None:
                if account.account_type == AccountType.CREDIT_CARD:
                    raise InvalidAccountDataError("Credit card accounts must have a credit limit.")
            else:
                self._validate_credit_limit(
                    account.account_type,
                    data.credit_limit,
                )

            account.credit_limit = data.credit_limit

        if "is_active" in data.model_fields_set:
            account.is_active = data.is_active

        try:
            account = self.repository.update(account)
            self.session.commit()
            return account
        except Exception:
            self.session.rollback()
            raise

    def delete_account(self, account_id: UUID) -> bool:
        """Delete an account."""

        try:
            if self.repository.has_transactions(account_id):
                raise AccountHasTransactionsError()

            deleted = self.repository.delete(account_id)

            if not deleted:
                return False

            self.session.commit()
            return True

        except IntegrityError as error:
            self.session.rollback()
            raise AccountHasTransactionsError() from error
        except Exception:
            self.session.rollback()
            raise

    @staticmethod
    def _validate_account_data(
        account_type: AccountType,
        credit_limit: Decimal | None,
    ) -> None:
        """Validate account-specific business rules."""

        if account_type == AccountType.CREDIT_CARD:
            if credit_limit is None:
                raise InvalidAccountDataError("Credit card accounts must have a credit limit.")

            if credit_limit <= 0:
                raise InvalidAccountDataError("Credit limit must be greater than zero.")

        elif credit_limit is not None:
            raise InvalidAccountDataError("Only credit card accounts can have a credit limit.")

    @staticmethod
    def _validate_credit_limit(
        account_type: AccountType,
        credit_limit: Decimal,
    ) -> None:
        """Validate a credit limit update."""

        if account_type != AccountType.CREDIT_CARD:
            raise InvalidAccountDataError("Only credit card accounts can have a credit limit.")

        if credit_limit <= 0:
            raise InvalidAccountDataError("Credit limit must be greater than zero.")
