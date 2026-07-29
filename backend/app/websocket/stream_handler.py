import json
import logging
from fastapi import WebSocket, WebSocketDisconnect
from app.websocket.connection_manager import ws_manager
from app.api.deps import (
    face_service_instance,
    eye_service_instance,
    fusion_engine_instance,
    decision_engine_instance
)

logger = logging.getLogger(__name__)

async def handle_webcam_stream(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            image_base64 = payload.get("image")
            video_id = payload.get("video_id", "default")
            timestamp_seconds = payload.get("timestamp_seconds", 0.0)

            if not image_base64:
                continue

            # 1. Run Face Emotion Analysis
            face_res = face_service_instance.analyze_face(image_base64)
            # 2. Run Eye Attention Analysis
            eye_res = eye_service_instance.analyze_attention(image_base64)

            # Convert to internal dataclass models for fusion
            from app.models.emotion import FaceEmotionResult, EyeAttentionResult
            face_model = FaceEmotionResult(**face_res)
            eye_model = EyeAttentionResult(**eye_res)

            # 3. Fuse modalities
            fusion = fusion_engine_instance.fuse(
                face=face_model,
                attention=eye_model,
                behaviour_score=85.0
            )

            # 4. Compute AI Decision Action
            decision = decision_engine_instance.decide_action(fusion)

            # 5. Broadcast real-time stream response back to React client
            response_payload = {
                "type": "EMOTION_UPDATE",
                "face_emotion": face_res,
                "eye_attention": eye_res,
                "fusion": fusion.model_dump(mode="json"),
                "decision": decision.model_dump(mode="json"),
                "timestamp_seconds": timestamp_seconds
            }
            await ws_manager.send_json(response_payload, websocket)

    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"Error handling webcam stream: {e}")
        ws_manager.disconnect(websocket)
