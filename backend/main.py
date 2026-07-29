import uvicorn
import logging
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.api.v1.router import api_router
from app.websocket.stream_handler import handle_webcam_stream

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("emotionsync")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Event handlers for database lifecycle
@app.on_event("startup")
async def startup_event():
    logger.info("Initializing EmotionSync AI Application...")
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down EmotionSync AI Application...")
    await close_mongo_connection()

# Include REST API v1
app.include_router(api_router, prefix=settings.API_V1_STR)

# WebSocket streaming route
@app.websocket("/ws/webcam")
async def webcam_websocket_endpoint(websocket: WebSocket):
    await handle_webcam_stream(websocket)

@app.get("/")
async def root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
