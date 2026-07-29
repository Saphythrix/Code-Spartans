from typing import List, Dict, Any
from pydantic import BaseModel

class EmotionTimePoint(BaseModel):
    timestamp_seconds: float
    emotion: str
    confidence: float
    engagement: float
    attention: float

class AnalyticsSummary(BaseModel):
    video_id: str
    total_views: int
    retention_curve: List[Dict[str, Any]]
    emotion_distribution: Dict[str, float]
    drop_off_points: List[float]
    recommendations: List[str]
