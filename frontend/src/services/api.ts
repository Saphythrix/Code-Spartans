import { Video, Recommendation, CreatorAnalytics, FusionResult, AIDecision } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export async function fetchVideos(): Promise<Video[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/videos/`);
    if (!res.ok) throw new Error('Failed to fetch videos');
    return await res.json();
  } catch (err) {
    console.warn('API fallback for videos');
    return [
      {
        _id: 'vid_1',
        title: 'Quantum Mechanics & Quantum Computing Demystified',
        description: 'An interactive visual guide exploring qubits, superposition, entanglement, and real-world quantum algorithms.',
        genre: 'Science & Tech',
        duration_seconds: 600,
        video_url: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop',
        transcript: 'Welcome to quantum computing. In classical computing, bits are either 0 or 1. Qubits leverage superposition to represent both simultaneously.'
      },
      {
        _id: 'vid_2',
        title: 'Cyberpunk 2077 Night City Action Highlights',
        description: 'High-octane futuristic gameplay with vibrant neon graphics and intense vehicle chases.',
        genre: 'Gaming',
        duration_seconds: 450,
        video_url: 'https://vjs.zencdn.net/v/oceans.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop',
        transcript: 'Cruising through Night City under neon signs. Speed boost engaged, turning onto the main freeway.'
      }
    ];
  }
}

export async function fetchRecommendations(emotion: string = 'neutral'): Promise<Recommendation[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/recommendations/?emotion=${encodeURIComponent(emotion)}`);
    if (!res.ok) throw new Error('Failed recommendations');
    return await res.json();
  } catch (err) {
    return [
      {
        id: 'rec_1',
        title: 'Ultimate Stand-up Comedy Special',
        description: 'Hilarious non-stop jokes and clever comedy skits.',
        genre: 'Comedy',
        target_emotions: ['sad', 'bored'],
        duration_seconds: 920,
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop'
      },
      {
        id: 'rec_2',
        title: 'Deep Focus Synthwave Study Session',
        description: 'Calm ambient melodies designed for productivity.',
        genre: 'Music',
        target_emotions: ['anxious', 'confused'],
        duration_seconds: 1800,
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop'
      }
    ];
  }
}

export async function fetchCreatorAnalytics(videoId: string): Promise<CreatorAnalytics> {
  try {
    const res = await fetch(`${API_BASE_URL}/analytics/creator/${videoId}`);
    if (!res.ok) throw new Error('Failed analytics');
    return await res.json();
  } catch (err) {
    return {
      video_id: videoId,
      total_views: 1420,
      retention_curve: [
        { timestamp: 0, retention: 100, boredom: 5, confusion: 2, happiness: 85 },
        { timestamp: 60, retention: 95, boredom: 10, confusion: 12, happiness: 75 },
        { timestamp: 120, retention: 88, boredom: 25, confusion: 35, happiness: 50 },
        { timestamp: 180, retention: 82, boredom: 40, confusion: 15, happiness: 45 },
        { timestamp: 240, retention: 76, boredom: 15, confusion: 5, happiness: 80 },
        { timestamp: 300, retention: 70, boredom: 10, confusion: 4, happiness: 88 }
      ],
      emotion_distribution: { happy: 45, neutral: 25, confused: 15, bored: 10, sad: 5 },
      drop_off_points: [120, 185],
      recommendations: [
        'High viewer confusion at 02:00 mark (Quantum Equations slide). Insert a 15s recap.',
        'Boredom spike around 03:00 during intro. Recommend editing speed by 1.25x.'
      ]
    };
  }
}

export async function requestLLMExplanation(transcript: string, emotion: string, topic: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/emotions/llm-explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, emotion, topic })
    });
    return await res.json();
  } catch (err) {
    return {
      explanation: "Qubits use quantum superposition to exist in multiple states simultaneously, allowing parallel calculation paths.",
      summary: ["Quantum superposition vs classical bits", "Parallel compute channels"],
      quiz: [
        {
          question: "What state can a qubit maintain under superposition?",
          options: ["0 only", "1 only", "Linear combination of 0 and 1", "None"],
          answer: 2
        }
      ],
      example: "Imagine spinning a coin: while in motion, it is both heads and tails at once until observed."
    };
  }
}
