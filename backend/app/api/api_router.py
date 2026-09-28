from fastapi import APIRouter
from backend.app.api.endpoints import events, ingest, review, grievances, analytics, alerts, export, forecast

api_router = APIRouter()

api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(ingest.router, prefix="/ingest", tags=["ingest"])
api_router.include_router(review.router, prefix="/review", tags=["review"])
api_router.include_router(grievances.router, prefix="/grievances", tags=["grievances"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
api_router.include_router(export.router, prefix="/export", tags=["export"])
api_router.include_router(forecast.router, prefix="/forecast", tags=["forecast"])

