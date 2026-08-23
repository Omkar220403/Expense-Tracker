from enum import StrEnum

class AccountType(StrEnum):
    """Supported Financial Account Types"""

    BANK_ACCOUNT = "bank_account"
    CREDIT_CARD = "credit_card"
    CASH = "cash"
