import base64
import io
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class WhisperService:
    def __init__(self):
        pass

    async def transcribe_audio(self, base64_audio: str) -> Dict[str, Any]:
        try:
            if "," in base64_audio:
                base64_audio = base64_audio.split(",")[1]
            audio_bytes = base64.b64decode(base64_audio)
            
            # Simulated high-accuracy transcription for demo & test streaming
            # In production environment with OpenAI API key:
            # client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            # transcript = await client.audio.transcriptions.create(model="whisper-1", file=...)

            mock_transcripts = [
                "This concept is fascinating! Can you explain how the neural network updates its internal weights?",
                "Wait, I am a bit confused by this equation. Why did the algorithm drop the feature dimension?",
                "Amazing scene! I really love how dynamic this video playback is.",
                "Let us speed up to the main climax of this tutorial."
            ]
            
            # Deterministic selection based on audio payload length
            idx = len(audio_bytes) % len(mock_transcripts)
            transcript = mock_transcripts[idx]

            return {
                "transcript": transcript,
                "language": "en",
                "duration": round(len(audio_bytes) / 16000.0, 2)
            }
        except Exception as e:
            logger.error(f"Whisper transcription failed: {e}")
            return {"transcript": "Could not parse audio recording.", "language": "en", "duration": 0.0}
