# Database design notes

The first migration will model six core concepts: **User**, **Account**, **Transaction**, **Category**, **Merchant**, and **Statement**.

- A user owns many accounts, categories, and statements.
- An account has many transactions and represents a bank account or credit card; account type will distinguish them.
- A transaction belongs to one account and may reference a normalized merchant, category, and source statement.
- Categories can support a parent category later for subcategories.
- A statement represents an import event and may retain minimal local source metadata; raw source content is kept separately from normalized transactions.

The MVP deliberately excludes investments, loans, shared/family ownership, and account aggregation. Transaction data will retain an import/manual source and enough identity data for future duplicate detection and user corrections.
