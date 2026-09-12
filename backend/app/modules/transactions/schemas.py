from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.core.enums import TransactionType


class TransactionCreate(BaseModel):
    """Schema for creating a transaction."""

    account_id: UUID
    transaction_type: TransactionType
    amount: Decimal = Field(gt=0)
    description: str | None = Field(default=None, max_length=255)
    merchant: str | None = Field(default=None, max_length=255)
    transaction_date: datetime
    notes: str | None = None


class TransactionUpdate(BaseModel):
    """Schema for updating a transaction."""

    account_id: UUID | None = None
    transaction_type: TransactionType | None = None
    amount: Decimal | None = Field(default=None, gt=0)
    description: str | None = Field(default=None, max_length=255)
    merchant: str | None = Field(default=None, max_length=255)
    transaction_date: datetime | None = None
    notes: str | None = None


class TransactionResponse(BaseModel):
    """Schema returned for a transaction."""

    id: UUID
    account_id: UUID
    transaction_type: TransactionType
    amount: Decimal
    description: str | None
    merchant: str | None
    transaction_date: datetime
    notes: str | None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
