import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class HuggingFaceAIPipeline:
    def __init__(self):
        self.sentiment_model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"
        self.embedding_model_name = "sentence-transformers/all-MiniLM-L6-v2"

        self._sentiment_pipeline = None
        self._sentence_model = None

    @property
    def sentiment_pipeline(self):
        if self._sentiment_pipeline is None:
            try:
                from transformers import pipeline
                logger.info("Lazy-loading HuggingFace RoBERTa Sentiment Model...")
                self._sentiment_pipeline = pipeline(
                    "sentiment-analysis",
                    model=self.sentiment_model_name,
                    tokenizer=self.sentiment_model_name,
                    top_k=None
                )
            except Exception as e:
                logger.warning(f"RoBERTa sentiment pipeline deferred: {e}")
        return self._sentiment_pipeline

    @property
    def sentence_model(self):
        if self._sentence_model is None:
            try:
                from sentence_transformers import SentenceTransformer
                logger.info("Lazy-loading HuggingFace Sentence Transformers Model...")
                self._sentence_model = SentenceTransformer(self.embedding_model_name)
            except Exception as e:
                logger.warning(f"SentenceTransformer deferred: {e}")
        return self._sentence_model

    def predict_sentiment(self, text: str) -> Dict[str, Any]:
        if not text or not text.strip():
            return {"sentiment": "neutral", "confidence": 0.90, "scores": {"positive": 0.05, "neutral": 0.90, "negative": 0.05}}

        pipe = self.sentiment_pipeline
        if pipe:
            try:
                raw = pipe(text[:512])[0]
                score_dict = {}
                for item in raw:
                    lbl = item["label"].lower()
                    if "pos" in lbl:
                        score_dict["positive"] = round(float(item["score"]), 3)
                    elif "neg" in lbl:
                        score_dict["negative"] = round(float(item["score"]), 3)
                    else:
                        score_dict["neutral"] = round(float(item["score"]), 3)
                dominant = max(score_dict, key=score_dict.get)
                return {"sentiment": dominant, "confidence": score_dict[dominant], "scores": score_dict}
            except Exception as e:
                logger.error(f"RoBERTa inference error: {e}")

        # Lexicon rule-based fallback
        t_lower = text.lower()
        if any(w in t_lower for w in ["love", "great", "awesome", "good", "happy"]):
            return {"sentiment": "positive", "confidence": 0.85, "scores": {"positive": 0.85, "neutral": 0.10, "negative": 0.05}}
        elif any(w in t_lower for w in ["confused", "bad", "hard", "difficult", "boring"]):
            return {"sentiment": "negative", "confidence": 0.85, "scores": {"negative": 0.85, "neutral": 0.10, "positive": 0.05}}
        return {"sentiment": "neutral", "confidence": 0.90, "scores": {"neutral": 0.90, "positive": 0.05, "negative": 0.05}}

    def encode_embeddings(self, texts: List[str]):
        model = self.sentence_model
        if model:
            return model.encode(texts)
        return None

hf_pipeline = HuggingFaceAIPipeline()
