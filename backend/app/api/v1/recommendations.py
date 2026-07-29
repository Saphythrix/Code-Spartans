from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Query
from app.api.deps import recommendation_engine_instance

router = APIRouter(prefix="/recommendations", tags=["Recommendation Engine"])

@router.get("/", response_model=List[Dict[str, Any]])
async def get_recommendations(
    emotion: str = Query("neutral", description="Current viewer dominant emotion"),
    genre: Optional[str] = Query(None, description="Preferred video genre"),
    limit: int = Query(5, description="Number of recommendations")
):
    return recommendation_engine_instance.get_recommendations(
        emotion=emotion,
        genre=genre,
        limit=limit
    )
