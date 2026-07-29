from typing import List, Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.repositories.base import BaseRepository

class EmotionRepository(BaseRepository):
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db["emotion_logs"])
        self.events_collection = db["playback_events"]

    async def log_emotion(self, log_data: Dict[str, Any]) -> Dict[str, Any]:
        return await self.create(log_data)

    async def get_logs_for_video(self, video_id: str) -> List[Dict[str, Any]]:
        cursor = self.collection.find({"video_id": video_id}).sort("timestamp_seconds", 1)
        results = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            results.append(doc)
        return results

    async def log_playback_event(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        result = await self.events_collection.insert_one(event_data)
        event_data["_id"] = str(result.inserted_id)
        return event_data

    async def get_events_for_video(self, video_id: str) -> List[Dict[str, Any]]:
        cursor = self.events_collection.find({"video_id": video_id})
        results = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            results.append(doc)
        return results
