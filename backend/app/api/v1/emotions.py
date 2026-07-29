from fastapi import APIRouter, Depends, Body, HTTPException
from typing import Dict, Any
from app.models.emotion import (
    FaceEmotionInput, FaceEmotionResult,
    VoiceEmotionInput, VoiceEmotionResult,
    SentimentInput, SentimentResult,
    EyeAttentionResult, FusionInput, FusionResult, ActionDecision
)
from app.models.event import PlaybackEventCreate, PlaybackEvent
from app.api.deps import (
    face_service_instance, eye_service_instance, voice_service_instance,
    whisper_service_instance, sentiment_service_instance, fusion_engine_instance,
    decision_engine_instance, llm_service_instance, get_emotion_repo, get_current_user
)
from app.repositories.emotion_repository import EmotionRepository

router = APIRouter(prefix="/emotions", tags=["Emotion & AI Core"])

@router.post("/face", response_model=FaceEmotionResult)
async def detect_face_emotion(payload: FaceEmotionInput):
    return face_service_instance.analyze_face(payload.image_base64)

@router.post("/eye-attention", response_model=EyeAttentionResult)
async def detect_eye_attention(payload: FaceEmotionInput):
    return eye_service_instance.analyze_attention(payload.image_base64)

@router.post("/voice", response_model=VoiceEmotionResult)
async def detect_voice_emotion(payload: VoiceEmotionInput):
    return voice_service_instance.analyze_audio(payload.audio_base64)

@router.post("/whisper-transcribe")
async def transcribe_audio(payload: VoiceEmotionInput):
    return await whisper_service_instance.transcribe_audio(payload.audio_base64)

@router.post("/sentiment", response_model=SentimentResult)
async def detect_sentiment(payload: SentimentInput):
    return sentiment_service_instance.analyze_text(payload.text)

@router.post("/fuse", response_model=FusionResult)
async def fuse_multimodal_emotions(payload: FusionInput):
    return fusion_engine_instance.fuse(
        face=payload.face_emotion,
        voice=payload.voice_emotion,
        text_sentiment=payload.text_sentiment,
        attention=payload.attention,
        behaviour_score=payload.behaviour_score or 80.0
    )

@router.post("/decide", response_model=ActionDecision)
async def make_ai_decision(fusion: FusionResult):
    return decision_engine_instance.decide_action(fusion)

@router.post("/llm-explain")
async def get_llm_explanation(
    payload: Dict[str, Any] = Body(...)
):
    transcript = payload.get("transcript", "Introduction to complex neural concepts.")
    emotion = payload.get("emotion", "confused")
    topic = payload.get("topic", "Quantum AI")
    return await llm_service_instance.generate_explanation_and_quiz(transcript, emotion, topic)

@router.post("/track-event", response_model=PlaybackEvent)
async def track_playback_event(
    event_in: PlaybackEventCreate,
    current_user=Depends(get_current_user),
    emotion_repo: EmotionRepository = Depends(get_emotion_repo)
):
    data = {
        "user_id": current_user["_id"],
        "video_id": event_in.video_id,
        "session_id": event_in.session_id,
        "event_type": event_in.event_type,
        "timestamp_seconds": event_in.timestamp_seconds,
        "metadata": event_in.metadata or {}
    }
    saved = await emotion_repo.log_playback_event(data)
    return PlaybackEvent(**saved)
