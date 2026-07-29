from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from datetime import datetime

class FaceEmotionInput(BaseModel):
    image_base64: str

class FaceEmotionResult(BaseModel):
    emotion: str
    confidence: float
    raw_scores: Optional[Dict[str, float]] = None

class EyeAttentionResult(BaseModel):
    attention: float  # 0 to 100
    lookingAway: bool
    blinkRate: float  # blinks per minute
    ear: float        # Eye Aspect Ratio
    headPose: Dict[str, float]  # yaw, pitch, roll

class VoiceEmotionInput(BaseModel):
    audio_base64: str

class VoiceEmotionResult(BaseModel):
    emotion: str
    confidence: float

class SentimentInput(BaseModel):
    text: str

class SentimentResult(BaseModel):
    sentiment: str  # positive, negative, neutral
    confidence: float
    scores: Dict[str, float]

class FusionInput(BaseModel):
    face_emotion: Optional[FaceEmotionResult] = None
    voice_emotion: Optional[VoiceEmotionResult] = None
    text_sentiment: Optional[SentimentResult] = None
    attention: Optional[EyeAttentionResult] = None
    behaviour_score: Optional[float] = 80.0

class FusionResult(BaseModel):
    current_emotion: str
    confidence: float
    engagement: float
    explainable_breakdown: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ActionDecision(BaseModel):
    action: str  # e.g., "SPEED_UP", "SHOW_EXPLANATION", "RECOMMEND_COMEDY", "CONTINUE"
    reasoning: str
    speed_multiplier: Optional[float] = 1.0
    recommendation_query: Optional[str] = None
    trigger_modal: Optional[bool] = False
