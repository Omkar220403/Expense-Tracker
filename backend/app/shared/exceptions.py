class DomainError(Exception):
    """Base exception for expected business/domain failures."""

    status_code = 400
    detail = "The request could not be completed."


class ResourceNotFoundError(DomainError):
    """Raised when a requested domain resource does not exist."""

    status_code = 404
    detail = "The requested resource was not found."
