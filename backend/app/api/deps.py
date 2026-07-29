from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.config import settings
from app.core.database import get_database
from app.repositories.user_repository import UserRepository
from app.repositories.video_repository import VideoRepository
from app.repositories.session_repository import SessionRepository
from app.repositories.emotion_repository import EmotionRepository
from app.services.auth_service import AuthService
from app.services.face_emotion_service import FaceEmotionService
from app.services.eye_attention_service import EyeAttentionService
from app.services.voice_emotion_service import VoiceEmotionService
from app.services.whisper_service import WhisperService
from app.services.sentiment_service import SentimentService
from app.services.fusion_engine import MultimodalFusionEngine
from app.services.decision_engine import AIDecisionEngine
from app.services.recommendation_engine import RecommendationEngine
from app.services.llm_service import LLMService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

# Singletons for services
face_service_instance = FaceEmotionService()
eye_service_instance = EyeAttentionService()
voice_service_instance = VoiceEmotionService()
whisper_service_instance = WhisperService()
sentiment_service_instance = SentimentService()
fusion_engine_instance = MultimodalFusionEngine()
decision_engine_instance = AIDecisionEngine()
recommendation_engine_instance = RecommendationEngine()
llm_service_instance = LLMService()

def get_user_repo(db=Depends(get_database)) -> UserRepository:
    return UserRepository(db)

def get_video_repo(db=Depends(get_database)) -> VideoRepository:
    return VideoRepository(db)

def get_session_repo(db=Depends(get_database)) -> SessionRepository:
    return SessionRepository(db)

def get_emotion_repo(db=Depends(get_database)) -> EmotionRepository:
    return EmotionRepository(db)

def get_auth_service(user_repo=Depends(get_user_repo)) -> AuthService:
    return AuthService(user_repo)

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    user_repo: UserRepository = Depends(get_user_repo)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = await user_repo.get_by_id(user_id)
    if user is None:
        raise credentials_exception
    return user
