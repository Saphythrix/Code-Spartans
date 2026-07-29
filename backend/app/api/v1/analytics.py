from typing import Dict, Any, List
from fastapi import APIRouter, Depends, Query
from app.models.analytics import AnalyticsSummary
from app.repositories.emotion_repository import EmotionRepository
from app.api.deps import get_emotion_repo

router = APIRouter(prefix="/analytics", tags=["Creator Analytics"])

@router.get("/creator/{video_id}", response_model=AnalyticsSummary)
async def get_creator_analytics(
    video_id: str,
    emotion_repo: EmotionRepository = Depends(get_emotion_repo)
):
    logs = await emotion_repo.get_logs_for_video(video_id)
    events = await emotion_repo.get_events_for_video(video_id)

    # Simulated retention and emotion curve aggregation
    retention_curve = [
        {"timestamp": 0, "retention": 100, "boredom": 5, "confusion": 2, "happiness": 85},
        {"timestamp": 60, "retention": 95, "boredom": 10, "confusion": 12, "happiness": 75},
        {"timestamp": 120, "retention": 88, "boredom": 25, "confusion": 35, "happiness": 50},
        {"timestamp": 180, "retention": 82, "boredom": 40, "confusion": 15, "happiness": 45},
        {"timestamp": 240, "retention": 76, "boredom": 15, "confusion": 5, "happiness": 80},
        {"timestamp": 300, "retention": 70, "boredom": 10, "confusion": 4, "happiness": 88}
    ]

    drop_off_points = [120.0, 185.0]

    emotion_dist = {
        "happy": 45.0,
        "neutral": 25.0,
        "confused": 15.0,
        "bored": 10.0,
        "sad": 5.0
    }

    recommendations = [
        "High viewer confusion at 02:00 mark (Quantum Equations slide). Consider inserting a 15-second visual recap.",
        "Boredom spike around 03:00 mark during lengthy intro. Recommend editing intro speed by 1.25x.",
        "Peak viewer engagement and happiness achieved during the live demo at 04:30."
    ]

    return AnalyticsSummary(
        video_id=video_id,
        total_views=max(1, len(logs) + len(events) + 128),
        retention_curve=retention_curve,
        emotion_distribution=emotion_dist,
        drop_off_points=drop_off_points,
        recommendations=recommendations
    )
