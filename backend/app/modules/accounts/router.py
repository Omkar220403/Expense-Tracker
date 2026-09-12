from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.accounts.schemas import AccountCreate, AccountResponse, AccountUpdate
from app.modules.accounts.service import AccountService

router = APIRouter(
    prefix="/accounts",
    tags=["Accounts"],
)

DbSession = Annotated[Session, Depends(get_db_session)]


@router.post(
    "",
    response_model=AccountResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_account(
    data: AccountCreate,
    session: DbSession,
) -> AccountResponse:
    """Create a new account."""

    service = AccountService(session)
    account = service.create_account(data)

    return account


@router.get(
    "",
    response_model=list[AccountResponse],
)
def get_accounts(
    session: DbSession,
) -> list[AccountResponse]:
    """Get all accounts."""

    service = AccountService(session)

    return service.get_accounts()


@router.get(
    "/{account_id}",
    response_model=AccountResponse,
)
def get_account(
    account_id: UUID,
    session: DbSession,
) -> AccountResponse:
    """Get an accountby ID."""

    service = AccountService(session)
    account = service.get_account(account_id)

    if account is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Account with ID {account_id} not found.",
        )

    return account


@router.patch(
    "/{account_id}",
    response_model=AccountResponse,
)
def update_account(
    account_id: UUID,
    data: AccountUpdate,
    session: DbSession,
) -> AccountResponse:
    """Update an Account by ID."""

    service = AccountService(session)
    account = service.update_account(account_id, data)

    if account is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Account with ID {account_id} not found.",
        )

    return account


@router.delete(
    "/{account_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_account(
    account_id: UUID,
    session: DbSession,
) -> None:
    """Delete an account by ID."""

    service = AccountService(session)
    deleted = service.delete_account(account_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Account with ID {account_id} not found.",
        )
