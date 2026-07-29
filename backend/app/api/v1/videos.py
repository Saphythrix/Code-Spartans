from typing import List
from fastapi import APIRouter, Depends
from app.models.video import VideoResponse, VideoCreate
from app.repositories.video_repository import VideoRepository
from app.api.deps import get_video_repo

router = APIRouter(prefix="/videos", tags=["Videos"])

SEED_VIDEOS = [
    {
        "_id": "vid_1",
        "title": "Quantum Mechanics & Quantum Computing Demystified",
        "description": "An interactive visual guide exploring qubits, superposition, entanglement, and real-world quantum algorithms.",
        "genre": "Science & Tech",
        "duration_seconds": 600.0,
        "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "thumbnail_url": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop",
        "transcript": "Welcome to quantum computing. In classical computing, bits are either 0 or 1. Qubits leverage superposition to represent both simultaneously."
    },
    {
        "_id": "vid_2",
        "title": "Cyberpunk 2077 Night City Action Highlights",
        "description": "High-octane futuristic gameplay with vibrant neon graphics and intense vehicle chases.",
        "genre": "Gaming",
        "duration_seconds": 450.0,
        "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        "thumbnail_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop",
        "transcript": "Cruising through Night City under neon signs. Speed boost engaged, turning onto the main freeway."
    },
    {
        "_id": "vid_3",
        "title": "Nature Relaxation & Ambient Soundtrack",
        "description": "Peaceful cinematic views of mountain peaks, lush forests, and serene ocean waves.",
        "genre": "Nature",
        "duration_seconds": 900.0,
        "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "thumbnail_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop",
        "transcript": "Listen closely to the gentle rustle of leaves and flowing mountain streams."
    }
]

@router.get("/", response_model=List[VideoResponse])
async def list_videos(video_repo: VideoRepository = Depends(get_video_repo)):
    videos = await video_repo.get_all()
    if not videos:
        # Seed default video content if empty
        for v in SEED_VIDEOS:
            await video_repo.create(v)
        videos = SEED_VIDEOS
    return [VideoResponse(**v) for v in videos]

@router.get("/{video_id}", response_model=VideoResponse)
async def get_video(video_id: str, video_repo: VideoRepository = Depends(get_video_repo)):
    video = await video_repo.get_by_id(video_id)
    if not video:
        # Return fallback seed item matching id
        match = next((v for v in SEED_VIDEOS if v["_id"] == video_id), SEED_VIDEOS[0])
        return VideoResponse(**match)
    return VideoResponse(**video)
