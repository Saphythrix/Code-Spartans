from typing import List, Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.repositories.base import BaseRepository

class VideoRepository(BaseRepository):
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db["videos"])

    async def get_by_genre(self, genre: str, limit: int = 10) -> List[Dict[str, Any]]:
        cursor = self.collection.find({"genre": {"$regex": genre, "$options": "i"}}).limit(limit)
        results = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            results.append(doc)
        return results
