from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.transactions.schemas import (TransactionCreate, TransactionResponse, TransactionUpdate)

from app.modules.transactions.service import TransactionService

router = APIRouter(
    prefix = "/transactions",
    tags = ["Transactions"],
)

@router.post(
    "",
    response_model = TransactionResponse,
    status_code = status.HTTP_201_CREATED,
)
def create_transaction(
    data: TransactionCreate,
    session: Session = Depends(get_db_session),
) -> TransactionResponse:
    """Create a new transaction"""

    service = TransactionService(session)
    transaction = service.create_transaction(data)

    if transaction is None:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail=f"Account with ID {data.account_id} not found.",
        )

    return transaction

@router.get(
    "",
    response_model = list[TransactionResponse],
)
def get_transactions(
    session: Session = Depends(get_db_session),
) -> list[TransactionResponse]:
    """Get all transactions"""

    service = TransactionService(session)

    return service.get_transactions()

@router.get(
    "/{transaction_id}",
    response_model = TransactionResponse
)
def get_transaction(
    transaction_id: UUID,
    session: Session = Depends(get_db_session),
) -> TransactionResponse:
    """Get a transaction by ID"""

    service = TransactionService(session)
    transaction = service.get_transaction(transaction_id)

    if transaction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transaction with ID {transaction_id} not found",
        )

    return transaction

@router.patch(
    "/{transcation_id}",
    response_model = TransactionResponse,
)
def update_transaction(
    transaction_id: UUID,
    data: TransactionUpdate,
    session: Session = Depends(get_db_session),
)  -> TransactionResponse:
    """Update a transaction by ID"""

    service = TransactionService(session)
    transaction = service.update_transaction(transaction_id, data)

    if transaction is None:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = f"Transaction with ID {transaction_id} not found",
        )

    return transaction

@router.delete(
    "/{transaction_id}",
    status_code = status.HTTP_204_NO_CONTENT,
)
def delete_transaction(
    transaction_id: UUID,
    session: Session = Depends(get_db_session)
) -> None:
    """Delete a transaction by ID"""

    service = TransactionService(session)
    deleted = service.delete_transaction(transaction_id)

    if not deleted:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = f"Transaction with ID {transaction_id} not found",
        )