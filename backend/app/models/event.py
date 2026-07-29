from typing import Optional, Any, Dict
from pydantic import BaseModel, Field
from datetime import datetime

class PlaybackEvent(BaseModel):
    user_id: str
    video_id: str
    session_id: str
    event_type: str  # pause, skip, replay, seek, speed_change, play
    timestamp_seconds: float
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PlaybackEventCreate(BaseModel):
    video_id: str
    session_id: str
    event_type: str
    timestamp_seconds: float
    metadata: Optional[Dict[str, Any]] = None
