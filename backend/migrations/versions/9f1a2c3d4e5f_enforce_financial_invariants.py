"""enforce financial invariants

Revision ID: 9f1a2c3d4e5f
Revises: 6337773242dd
Create Date: 2026-09-12 00:00:00.000000
"""

from collections.abc import Sequence

from alembic import op

revision: str = "9f1a2c3d4e5f"
down_revision: str | Sequence[str] | None = "6337773242dd"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_check_constraint(
        "ck_accounts_credit_limit_matches_type",
        "accounts",
        "(account_type = 'CREDIT_CARD' AND credit_limit > 0) "
        "OR (account_type <> 'CREDIT_CARD' AND credit_limit IS NULL)",
    )
    op.create_check_constraint("ck_transactions_amount_positive", "transactions", "amount > 0")


def downgrade() -> None:
    op.drop_constraint("ck_transactions_amount_positive", "transactions", type_="check")
    op.drop_constraint("ck_accounts_credit_limit_matches_type", "accounts", type_="check")
