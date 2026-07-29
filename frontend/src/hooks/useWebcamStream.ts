import { useEffect, useRef, useState } from 'react';
import { WebcamWebSocketClient } from '../services/websocket';

export function useWebcamStream(videoId: string, onStreamUpdate: (data: any) => void) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean>(true);
  const wsClientRef = useRef<WebcamWebSocketClient | null>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    // Initialize WebSocket Client
    wsClientRef.current = new WebcamWebSocketClient('ws://localhost:8000/ws/webcam', (data) => {
      onStreamUpdate(data);
    });
    wsClientRef.current.connect();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (wsClientRef.current) wsClientRef.current.disconnect();
    };
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, frameRate: 15 },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
        setHasPermission(true);

        // Frame capture interval (1 FPS)
        timerRef.current = setInterval(() => {
          captureAndSendFrame();
        }, 1000);
      }
    } catch (err) {
      console.warn('Webcam permission denied or device absent. Operating in synthetic simulation mode:', err);
      setHasPermission(false);
      setIsStreaming(true);
      // Fallback synthetic ticker
      timerRef.current = setInterval(() => {
        simulateFrame();
      }, 1000);
    }
  };

  const stopWebcam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  const captureAndSendFrame = () => {
    if (!videoRef.current || !canvasRef.current || !wsClientRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, 320, 240);
      const base64Img = canvas.toDataURL('image/jpeg', 0.6);
      wsClientRef.current.sendFrame(base64Img, videoId, Date.now() / 1000);
    }
  };

  const simulateFrame = () => {
    const emotions = ['happy', 'neutral', 'confused', 'bored', 'surprise'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const mockUpdate = {
      face_emotion: { emotion: randomEmotion, confidence: 0.89 },
      eye_attention: {
        attention: Math.round(75 + Math.random() * 20),
        lookingAway: Math.random() > 0.85,
        blinkRate: Math.round(12 + Math.random() * 8),
        ear: 0.27,
        headPose: { yaw: (Math.random() - 0.5) * 10, pitch: (Math.random() - 0.5) * 6, roll: 0 }
      },
      fusion: {
        current_emotion: randomEmotion,
        confidence: 0.91,
        engagement: Math.round(80 + Math.random() * 15),
        explainable_breakdown: {
          dominant_emotion: randomEmotion,
          overall_confidence: 0.91,
          engagement_score: 88.0,
          modalities: {
            face: { detected: randomEmotion, confidence: 0.91 },
            eye_attention: { score: 92.0, looking_away: false },
            behaviour: { score: 85.0 }
          },
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      },
      decision: {
        action: randomEmotion === 'bored' ? 'SPEED_UP' : randomEmotion === 'confused' ? 'SHOW_EXPLANATION' : 'CONTINUE',
        reasoning: `Engine adapted to ${randomEmotion} viewer state.`,
        speed_multiplier: randomEmotion === 'bored' ? 1.25 : 1.0,
        trigger_modal: randomEmotion === 'confused'
      }
    };
    onStreamUpdate(mockUpdate);
  };

  return {
    videoRef,
    canvasRef,
    isStreaming,
    hasPermission,
    startWebcam,
    stopWebcam
  };
}
