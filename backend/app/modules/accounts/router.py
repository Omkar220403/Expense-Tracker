from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.accounts.schemas import AccountCreate, AccountResponse, AccountUpdate
from app.modules.accounts.service import AccountService

from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(
    prefix="/accounts",
    tags=["Accounts"],
)

@router.post(
    "",
    response_model = AccountResponse,
    status_code = status.HTTP_201_CREATED,
)
def create_account(
    data: AccountCreate,
    session: Session = Depends(get_db_session),
) -> AccountResponse:
    """Create a new account."""

    service = AccountService(session)
    account = service.create_account(data)

    return account

@router.get(
    "",
    response_model = list[AccountResponse],
)
def get_accounts(
    session: Session = Depends(get_db_session),
) -> list[AccountResponse]:
    """Get all accounts."""

    service = AccountService(session)

    return service.get_accounts()

@router.get(
    "/{account_id}",
    response_model = AccountResponse,
)
def get_account(
    account_id : UUID,
    session: Session = Depends(get_db_session),
) -> AccountResponse:
    """Get an accountby ID."""

    service = AccountService(session)
    account = service.get_account(account_id)

    if account is None:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = f"Account with ID {account_id} not found.",
        )

    return account

@router.patch(
    "/{account_id}",
    response_model = AccountResponse,
)
def update_account(
    account_id: UUID,
    data: AccountUpdate,
    session: Session = Depends(get_db_session),
) -> AccountResponse:
    """Update an Account by ID."""

    service = AccountService(session)
    account = service.update_account(account_id, data)

    if account is None:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = f"Account with ID {account_id} not found.",
        )

    return account