from typing import Generic, TypeVar, List, Optional, Dict, Any
from motor.motor_asyncio import AsyncIOMotorCollection
from bson import ObjectId

T = TypeVar("T")

class BaseRepository(Generic[T]):
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    async def get_by_id(self, id_str: str) -> Optional[Dict[str, Any]]:
        try:
            doc = await self.collection.find_one({"_id": ObjectId(id_str)})
        except Exception:
            doc = await self.collection.find_one({"_id": id_str})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def get_all(self, limit: int = 100) -> List[Dict[str, Any]]:
        cursor = self.collection.find().limit(limit)
        results = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            results.append(doc)
        return results

    async def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        result = await self.collection.insert_one(data)
        data["_id"] = str(result.inserted_id)
        return data

    async def update(self, id_str: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        try:
            oid = ObjectId(id_str)
        except Exception:
            oid = id_str
        await self.collection.update_one({"_id": oid}, {"$set": data})
        return await self.get_by_id(id_str)

    async def delete(self, id_str: str) -> bool:
        try:
            oid = ObjectId(id_str)
        except Exception:
            oid = id_str
        result = await self.collection.delete_one({"_id": oid})
        return result.deleted_count > 0
