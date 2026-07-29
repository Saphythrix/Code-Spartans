# EmotionSync AI 🎭⚡

**EmotionSync AI** is a production-grade, multimodal emotion-aware entertainment platform that detects user emotions in real time across webcam video, eye tracking, voice audio, text sentiment, and user interactions, then dynamically adapts entertainment content and playback parameters.

---

## 🌟 Architecture & Tech Stack

### Clean Architecture Layers
- **Frontend Layer**: React 18, Vite, TypeScript, Tailwind CSS, Shadcn-inspired glassmorphism design system, Framer Motion, Recharts, Lucide Icons.
- **Backend API & WebSockets**: FastAPI, Motor MongoDB driver, PyTorch, Pydantic v2, Repository Pattern.
- **AI Core Engines**:
  - **Face Emotion Recognition**: OpenCV + DeepFace micro-expression classifier.
  - **Eye Attention Tracking**: MediaPipe Face Mesh (Eye Aspect Ratio EAR, blink rate, 3D head pose yaw/pitch/roll).
  - **Voice Emotion Analysis**: Wav2Vec2 / MFCC acoustic energy classifier.
  - **Speech Transcription**: OpenAI Whisper engine.
  - **Text Sentiment Analysis**: RoBERTa transformer pipeline.
  - **Multimodal Fusion Engine**: Weighted algorithm combining Face (40%), Voice (25%), Text (15%), Attention (10%), and Behaviour (10%) with explainable JSON output.
  - **AI Decision Engine**: Dynamic action rules (Bored → 1.25x speed, Confused → LLM explanation modal, Sad → Comedy recommendations, Happy → Optimal playback).
  - **Content Recommendation Engine**: Sentence Transformers + Cosine similarity top 5 recommendations.
  - **LLM Explanation Assistant**: OpenAI / Fallback concept explainer and interactive quizzes.
  - **Creator Telemetry**: Retention curves, drop-off point heatmaps, and emotion timeline analytics.

---

## 🚀 Quick Start with Docker Compose

To start the full-stack system with backend and frontend containers:

```bash
docker-compose up --build
```

- **Frontend Application**: `http://localhost:5173`
- **FastAPI API & Docs**: `http://localhost:8000/docs`
- **WebSocket Stream**: `ws://localhost:8000/ws/webcam`

---

## 🛠️ Manual Development Setup

### 1. Backend Setup (FastAPI & MongoDB)
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup (React & Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 📊 Database Configuration

The backend is connected to MongoDB Cloud Atlas via Motor async driver:
`mongodb+srv://shashwata0986_db_user:N3pHOEkjixvGAGN3@cluster0.udi302u.mongodb.net/emotionsync_db`
