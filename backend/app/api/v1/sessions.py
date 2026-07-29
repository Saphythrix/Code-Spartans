from fastapi import APIRouter, Depends, status
from app.models.session import StreamSessionCreate, StreamSessionResponse
from app.repositories.session_repository import SessionRepository
from app.api.deps import get_session_repo, get_current_user
from datetime import datetime

router = APIRouter(prefix="/sessions", tags=["Sessions"])

@router.post("/", response_model=StreamSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    session_in: StreamSessionCreate,
    current_user=Depends(get_current_user),
    session_repo: SessionRepository = Depends(get_session_repo)
):
    data = {
        "user_id": current_user["_id"],
        "video_id": session_in.video_id,
        "started_at": datetime.utcnow(),
        "average_engagement": 85.0,
        "dominant_emotion": "neutral"
    }
    created = await session_repo.create(data)
    return StreamSessionResponse(
        _id=created["_id"],
        user_id=created["user_id"],
        video_id=created["video_id"],
        started_at=created["started_at"],
        average_engagement=created["average_engagement"],
        dominant_emotion=created["dominant_emotion"]
    )
