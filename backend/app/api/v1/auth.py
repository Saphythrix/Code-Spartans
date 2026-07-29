from fastapi import APIRouter, Depends, status
from app.models.user import UserCreate, UserLogin, Token
from app.services.auth_service import AuthService
from app.api.deps import get_auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, auth_service: AuthService = Depends(get_auth_service)):
    return await auth_service.register(user_in)

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, auth_service: AuthService = Depends(get_auth_service)):
    return await auth_service.login(credentials)
