import logging
import asyncio
from typing import Dict, Any

logger = logging.getLogger(__name__)

class SentimentService:
    def __init__(self):
        self.emotions = ["positive", "negative", "neutral"]

    def analyze_text(self, text: str) -> Dict[str, Any]:
        if not text or not text.strip():
            return {
                "sentiment": "neutral",
                "confidence": 0.90,
                "scores": {"positive": 0.05, "neutral": 0.90, "negative": 0.05}
            }

        t_lower = text.lower()
        pos_words = ["love", "great", "awesome", "fascinating", "amazing", "good", "happy", "like", "wonderful", "cool", "superposition", "qubit"]
        neg_words = ["confused", "bad", "hard", "difficult", "boring", "bored", "slow", "hate", "terrible", "wrong", "error"]

        pos_count = sum(1 for w in pos_words if w in t_lower)
        neg_count = sum(1 for w in neg_words if w in t_lower)

        if pos_count > neg_count:
            sentiment = "positive"
            conf = min(0.95, 0.80 + pos_count * 0.04)
            scores = {"positive": round(conf, 2), "neutral": round(1 - conf - 0.05, 2), "negative": 0.05}
        elif neg_count > pos_count:
            sentiment = "negative"
            conf = min(0.95, 0.80 + neg_count * 0.04)
            scores = {"negative": round(conf, 2), "neutral": round(1 - conf - 0.05, 2), "positive": 0.05}
        else:
            sentiment = "neutral"
            conf = 0.88
            scores = {"neutral": 0.88, "positive": 0.08, "negative": 0.04}

        return {
            "sentiment": sentiment,
            "confidence": float(conf),
            "scores": scores
        }
