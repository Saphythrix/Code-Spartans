from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class VideoBase(BaseModel):
    title: str
    description: str
    genre: str
    duration_seconds: float
    video_url: str
    thumbnail_url: str
    transcript: Optional[str] = ""

class VideoCreate(VideoBase):
    pass

class VideoResponse(VideoBase):
    id: str = Field(alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
