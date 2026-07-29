"""
EmotionSync AI - Real-Time Pipeline Integration Test
Verifies real-time face emotion, eye attention, sentiment, fusion, decision, and recommendation endpoints.
"""

import requests
import json
import base64
import numpy as np
import cv2

BASE_URL = "http://localhost:8000/api/v1"

def create_synthetic_test_frame():
    # Create 320x240 RGB image simulating webcam input frame
    img = np.zeros((240, 320, 3), dtype=np.uint8)
    # Draw simple facial feature shapes
    cv2.circle(img, (160, 120), 60, (200, 200, 200), -1) # Head
    cv2.circle(img, (140, 100), 10, (50, 50, 50), -1)   # Left Eye
    cv2.circle(img, (180, 100), 10, (50, 50, 50), -1)   # Right Eye
    cv2.ellipse(img, (160, 140), (25, 15), 0, 0, 180, (50, 50, 50), 3) # Smile
    
    _, buffer = cv2.imencode('.jpg', img)
    return base64.b64encode(buffer).decode('utf-8')

def test_realtime_pipeline():
    print("=== Testing EmotionSync AI Real-Time Endpoints ===")
    
    img_b64 = create_synthetic_test_frame()

    # 1. Face Emotion Endpoint
    try:
        res = requests.post(f"{BASE_URL}/emotions/face", json={"image_base64": img_b64})
        print(f"[1] Face Emotion API: status={res.status_code}, response={res.json()}")
    except Exception as e:
        print(f"[1] Face Emotion API error: {e}")

    # 2. Eye Attention Endpoint
    try:
        res = requests.post(f"{BASE_URL}/emotions/eye-attention", json={"image_base64": img_b64})
        print(f"[2] Eye Attention API: status={res.status_code}, response={res.json()}")
    except Exception as e:
        print(f"[2] Eye Attention API error: {e}")

    # 3. RoBERTa Sentiment Endpoint
    try:
        res = requests.post(f"{BASE_URL}/emotions/sentiment", json={"text": "This quantum concept is incredible!"})
        print(f"[3] Sentiment Analysis API: status={res.status_code}, response={res.json()}")
    except Exception as e:
        print(f"[3] Sentiment Analysis API error: {e}")

    # 4. Multimodal Fusion Endpoint
    try:
        fusion_payload = {
            "face_emotion": {"emotion": "happy", "confidence": 0.92},
            "attention": {"attention": 91.5, "lookingAway": False, "blinkRate": 14, "ear": 0.28, "headPose": {"yaw": 1.2, "pitch": 0, "roll": 0}},
            "behaviour_score": 85.0
        }
        res = requests.post(f"{BASE_URL}/emotions/fuse", json=fusion_payload)
        print(f"[4] Fusion Engine API: status={res.status_code}, response={res.json()}")
        fusion_result = res.json()
    except Exception as e:
        print(f"[4] Fusion Engine API error: {e}")
        fusion_result = None

    # 5. AI Decision Engine Endpoint
    if fusion_result:
        try:
            res = requests.post(f"{BASE_URL}/emotions/decide", json=fusion_result)
            print(f"[5] AI Decision Engine API: status={res.status_code}, response={res.json()}")
        except Exception as e:
            print(f"[5] AI Decision Engine API error: {e}")

    # 6. Content Recommendation Engine Endpoint
    try:
        res = requests.get(f"{BASE_URL}/recommendations/?emotion=happy")
        print(f"[6] Recommendation Engine API: status={res.status_code}, count={len(res.json())}")
    except Exception as e:
        print(f"[6] Recommendation Engine API error: {e}")

if __name__ == "__main__":
    test_realtime_pipeline()
