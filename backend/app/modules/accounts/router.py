from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.accounts.schemas import AccountCreate, AccountResponse
from app.modules.accounts.service import AccountService

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