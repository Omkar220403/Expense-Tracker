from fastapi import APIRouter

from app.modules.health.schemas import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    """Confirm that the API process is accepting requests."""
    return HealthResponse(status="ok")
