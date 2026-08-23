from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, Numeric, String, func
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.core.enums import AccountType

class Account(Base):
    """Represent financial account owned by the user"""

    __tablename__ = "accounts"

    id: Mapped[UUID] = mapped_column(
        primary_key = True,
        default = uuid4,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable = False,
    )

    account_type: Mapped[AccountType] = mapped_column(
        SQLAlchemyEnum(AccountType, name = "account_type"),
        nullable = False,
    )   

    institution: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    currency: Mapped[str] = mapped_column(
        String(3),
        nullable=False,
        default="INR",
    )

    credit_limit: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 2),
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )