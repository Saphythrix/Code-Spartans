import logging
import numpy as np
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class RecommendationEngine:
    def __init__(self):
        self.catalog = [
            {
                "id": "rec_1",
                "title": "Quantum Physics & Computing Demystified",
                "description": "A mind-bending journey through subatomic particles, wave functions, and relativity.",
                "genre": "Learning",
                "target_emotions": ["confused", "neutral", "happy"],
                "duration_seconds": 640.0,
                "video_url": "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop"
            },
            {
                "id": "rec_2",
                "title": "Ultimate Stand-up Comedy Special",
                "description": "Hilarious non-stop jokes, clever observations, and side-splitting comedy skits.",
                "genre": "Movies",
                "target_emotions": ["sad", "bored", "neutral"],
                "duration_seconds": 920.0,
                "video_url": "https://vjs.zencdn.net/v/oceans.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop"
            },
            {
                "id": "rec_3",
                "title": "High-Speed Cyberpunk Gaming Montage",
                "description": "Adrenaline-fueled esports highlights, fast gameplay, and electronic synthwave beats.",
                "genre": "Movies",
                "target_emotions": ["bored", "happy", "excited"],
                "duration_seconds": 480.0,
                "video_url": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop"
            },
            {
                "id": "rec_4",
                "title": "Deep Focus Synthwave Study Session",
                "description": "Calm ambient melodies designed for productivity, relaxation, and stress relief.",
                "genre": "Music",
                "target_emotions": ["anxious", "confused", "sad"],
                "duration_seconds": 1800.0,
                "video_url": "https://vjs.zencdn.net/v/oceans.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop"
            },
            {
                "id": "rec_5",
                "title": "Cybersecurity & Neural Network AI Mastery",
                "description": "Comprehensive practical tutorial building deep neural networks and real-time vision pipelines.",
                "genre": "Learning",
                "target_emotions": ["happy", "neutral", "confused"],
                "duration_seconds": 1200.0,
                "video_url": "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop"
            }
        ]

    def get_recommendations(
        self,
        emotion: str = "neutral",
        history: List[str] = None,
        genre: str = None,
        preferences: List[str] = None,
        limit: int = 5
    ) -> List[Dict[str, Any]]:

        results = []
        for item in self.catalog:
            score = 0.50
            if emotion in item["target_emotions"]:
                score += 0.30
            if genre and genre.lower() in item["genre"].lower():
                score += 0.20
            results.append((score, item))

        results.sort(key=lambda x: x[0], reverse=True)
        return [item for _, item in results[:limit]]
