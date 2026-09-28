from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.database import engine, Base
from backend.app.api.api_router import api_router
from typing import List
import asyncio
import json

# Ensure tables are created
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Enable CORS for React/Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_event():
    from backend.app.core.database import SessionLocal
    from backend.app.models.event import WeatherEvent
    from backend.app.services.live_ingestion import fetch_and_ingest_live_weather
    from backend.app.api.endpoints.review import seed_pending_review_events
    db = SessionLocal()
    try:
        count = db.query(WeatherEvent).count()
        if count == 0:
            print("Auto-seeding live meteorological telemetry...")
            fetch_and_ingest_live_weather(wipe_old=False)
            seed_pending_review_events(db)
            print("Auto-seeding completed.")
    except Exception as e:
        print(f"Startup seeding error: {e}")
    finally:
        db.close()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                pass

manager = ConnectionManager()

@app.websocket("/ws/stream")
async def websocket_stream(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep-alive heartbeat
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "CONNECTED",
        "spatial_engine": "Uber H3 Enabled",
        "verification_engine": "Tri-Check AI Active"
    }

# =============================================================================
# Production Static SPA Frontend Mounting
# Allows the entire application (React + FastAPI) to run from a single permanent port
# =============================================================================
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="spa-assets")

    # Also mount public assets if available
    public_assets = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "public", "assets"))
    if os.path.exists(public_assets):
        app.mount("/public/assets", StaticFiles(directory=public_assets), name="public-assets")

    @app.get("/{full_path:path}")
    async def serve_spa_frontend(full_path: str):
        # Do not catch API routes or system endpoints
        if full_path.startswith("api/") or full_path.startswith("ws/") or full_path.startswith("docs") or full_path.startswith("redoc") or full_path == "openapi.json" or full_path == "health":
            return
        candidate_file = os.path.join(frontend_dist, full_path)
        if full_path and os.path.isfile(candidate_file):
            return FileResponse(candidate_file)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

