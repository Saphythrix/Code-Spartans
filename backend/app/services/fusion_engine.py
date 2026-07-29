from typing import Dict, Any, Optional
from datetime import datetime
from app.models.emotion import (
    FaceEmotionResult,
    VoiceEmotionResult,
    SentimentResult,
    EyeAttentionResult,
    FusionResult
)

class MultimodalFusionEngine:
    def __init__(self):
        # Weights according to system design specification
        self.WEIGHT_FACE = 0.40
        self.WEIGHT_VOICE = 0.25
        self.WEIGHT_SENTIMENT = 0.15
        self.WEIGHT_ATTENTION = 0.10
        self.WEIGHT_BEHAVIOUR = 0.10

    def fuse(
        self,
        face: Optional[FaceEmotionResult] = None,
        voice: Optional[VoiceEmotionResult] = None,
        text_sentiment: Optional[SentimentResult] = None,
        attention: Optional[EyeAttentionResult] = None,
        behaviour_score: float = 80.0
    ) -> FusionResult:
        
        emotion_votes: Dict[str, float] = {}

        # 1. Face Emotion (40% weight)
        if face:
            e = face.emotion.lower()
            c = face.confidence
            emotion_votes[e] = emotion_votes.get(e, 0.0) + (c * self.WEIGHT_FACE)

        # 2. Voice Emotion (25% weight)
        if voice:
            ve = voice.emotion.lower()
            vc = voice.confidence
            emotion_votes[ve] = emotion_votes.get(ve, 0.0) + (vc * self.WEIGHT_VOICE)

        # 3. Text Sentiment (15% weight)
        if text_sentiment:
            s_map = {"positive": "happy", "negative": "confused", "neutral": "neutral"}
            se = s_map.get(text_sentiment.sentiment, "neutral")
            sc = text_sentiment.confidence
            emotion_votes[se] = emotion_votes.get(se, 0.0) + (sc * self.WEIGHT_SENTIMENT)

        # Default neutral vote if empty
        if not emotion_votes:
            emotion_votes["neutral"] = 0.70

        # Calculate dominant emotion & confidence
        dominant_emotion = max(emotion_votes, key=emotion_votes.get)
        confidence = min(0.98, round(float(emotion_votes[dominant_emotion]), 2))

        # Calculate Engagement level (0 - 100)
        att_val = attention.attention if attention else 80.0
        looking_away = attention.lookingAway if attention else False

        engagement = (
            (att_val * 0.50) +
            (behaviour_score * 0.30) +
            (confidence * 100.0 * 0.20)
        )
        if looking_away:
            engagement -= 20.0
        engagement = float(round(max(5.0, min(100.0, engagement)), 1))

        # Build Explainable JSON breakdown
        explainable_breakdown = {
            "dominant_emotion": dominant_emotion,
            "overall_confidence": confidence,
            "engagement_score": engagement,
            "modalities": {
                "face": {
                    "detected": face.emotion if face else "N/A",
                    "confidence": face.confidence if face else 0.0,
                    "weighted_contribution": round((face.confidence * self.WEIGHT_FACE) if face else 0.0, 3)
                },
                "voice": {
                    "detected": voice.emotion if voice else "N/A",
                    "confidence": voice.confidence if voice else 0.0,
                    "weighted_contribution": round((voice.confidence * self.WEIGHT_VOICE) if voice else 0.0, 3)
                },
                "text_sentiment": {
                    "detected": text_sentiment.sentiment if text_sentiment else "N/A",
                    "confidence": text_sentiment.confidence if text_sentiment else 0.0,
                    "weighted_contribution": round((text_sentiment.confidence * self.WEIGHT_SENTIMENT) if text_sentiment else 0.0, 3)
                },
                "eye_attention": {
                    "score": att_val,
                    "looking_away": looking_away,
                    "weighted_contribution": round((att_val / 100.0 * self.WEIGHT_ATTENTION), 3)
                },
                "behaviour": {
                    "score": behaviour_score,
                    "weighted_contribution": round((behaviour_score / 100.0 * self.WEIGHT_BEHAVIOUR), 3)
                }
            },
            "timestamp": datetime.utcnow().isoformat()
        }

        return FusionResult(
            current_emotion=dominant_emotion,
            confidence=confidence,
            engagement=engagement,
            explainable_breakdown=explainable_breakdown,
            timestamp=datetime.utcnow()
        )
