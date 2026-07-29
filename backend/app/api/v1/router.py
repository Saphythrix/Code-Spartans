from fastapi import APIRouter
from app.api.v1 import auth, users, sessions, videos, emotions, recommendations, analytics

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(sessions.router)
api_router.include_router(videos.router)
api_router.include_router(emotions.router)
api_router.include_router(recommendations.router)
api_router.include_router(analytics.router)
