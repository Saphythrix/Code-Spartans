from fastapi import HTTPException, status
from app.repositories.user_repository import UserRepository
from app.models.user import UserCreate, UserLogin, UserResponse, Token
from app.core.security import get_password_hash, verify_password, create_access_token
from datetime import datetime

class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def register(self, user_in: UserCreate) -> Token:
        existing = await self.user_repo.get_by_email(user_in.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        hashed_pwd = get_password_hash(user_in.password)
        data = {
            "email": user_in.email,
            "full_name": user_in.full_name or user_in.email.split("@")[0],
            "hashed_password": hashed_pwd,
            "favorite_genres": user_in.favorite_genres,
            "created_at": datetime.utcnow()
        }
        created = await self.user_repo.create(data)
        access_token = create_access_token(created["_id"])
        user_res = UserResponse(
            id=created["_id"],
            email=created["email"],
            full_name=created["full_name"],
            favorite_genres=created["favorite_genres"],
            created_at=created["created_at"]
        )
        return Token(access_token=access_token, user=user_res)

    async def login(self, credentials: UserLogin) -> Token:
        user = await self.user_repo.get_by_email(credentials.email)
        if not user or not verify_password(credentials.password, user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        access_token = create_access_token(user["_id"])
        user_res = UserResponse(
            id=user["_id"],
            email=user["email"],
            full_name=user["full_name"],
            favorite_genres=user.get("favorite_genres", []),
            created_at=user.get("created_at", datetime.utcnow())
        )
        return Token(access_token=access_token, user=user_res)
