from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.accounts.models import Account


class AccountRepository:
    """Handle database operations for accounts."""

    def __init__(self, session: Session):
        self.session = session

    def create(self, account: Account) -> Account:
        """Create a new account."""

        self.session.add(account)
        self.session.flush()
        self.session.refresh(account)

        return account

    def get_by_id(self, account_id: UUID) -> Account | None:
        """Get an account by its ID."""

        result = self.session.execute(
            select(Account).where(Account.id == account_id)
        )

        return result.scalar_one_or_none()

    def get_all(self) -> list[Account]:
        """Get all accounts."""

        result = self.session.execute(
            select(Account).order_by(Account.created_at.desc())
        )

        return list(result.scalars().all())

    def update(self, account: Account) -> Account:
        """Update an existing account."""

        self.session.flush()
        self.session.refresh(account)

        return account

    def delete(self, account: Account) -> None:
        """Delete an account."""

        self.session.delete(account)
        self.session.flush()