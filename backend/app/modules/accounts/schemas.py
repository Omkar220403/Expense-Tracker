from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.core.enums import AccountType


class AccountCreate(BaseModel):
    """Schema for creating a financial account"""

    name: str = Field(min_length=1, max_length=100)
    account_type: AccountType
    institution: str | None = Field(default=None, max_length=100)
    currency: str = Field(default="INR", min_length=3, max_length=3)
    credit_limit: Decimal | None = None


class AccountUpdate(BaseModel):
    """Schema for updating a financial account"""

    name: str | None = Field(default=None, min_length=1, max_length=100)
    institution: str | None = Field(default=None, max_length=100)
    currency: str | None = Field(default=None, min_length=3, max_length=3)
    credit_limit: Decimal | None = None
    is_active: bool | None = None

    @model_validator(mode="after")
    def required_fields_cannot_be_null(self) -> "AccountUpdate":
        """Reject null values for fields backed by non-nullable columns."""

        for field in ("name", "currency", "is_active"):
            if field in self.model_fields_set and getattr(self, field) is None:
                raise ValueError(f"{field} cannot be null.")
        return self


class AccountResponse(BaseModel):
    """Schema returned by the API"""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    account_type: AccountType
    institution: str | None
    currency: str
    credit_limit: Decimal | None
    is_active: bool
    created_at: datetime
    updated_at: datetime
