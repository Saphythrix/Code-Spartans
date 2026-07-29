from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class StreamSessionCreate(BaseModel):
    video_id: str

class StreamSessionResponse(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    video_id: str
    started_at: datetime = Field(default_factory=datetime.utcnow)
    ended_at: Optional[datetime] = None
    average_engagement: float = 0.0
    dominant_emotion: str = "neutral"

    class Config:
        populate_by_name = True
