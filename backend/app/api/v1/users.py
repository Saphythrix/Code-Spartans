from fastapi import APIRouter, Depends
from app.models.user import UserResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserResponse)
async def get_me(current_user=Depends(get_current_user)):
    return UserResponse(
        id=current_user["_id"],
        email=current_user["email"],
        full_name=current_user.get("full_name", ""),
        favorite_genres=current_user.get("favorite_genres", []),
        created_at=current_user.get("created_at")
    )
