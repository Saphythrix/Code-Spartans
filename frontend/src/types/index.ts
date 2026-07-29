export interface User {
  id: string;
  email: string;
  full_name?: string;
  favorite_genres?: string[];
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Video {
  _id: string;
  title: string;
  description: string;
  genre: string;
  duration_seconds: number;
  video_url: string;
  thumbnail_url: string;
  transcript?: string;
}

export interface FaceEmotion {
  emotion: string;
  confidence: number;
  raw_scores?: Record<string, number>;
}

export interface EyeAttention {
  attention: number;
  lookingAway: boolean;
  blinkRate: number;
  ear: number;
  headPose: {
    yaw: number;
    pitch: number;
    roll: number;
  };
}

export interface VoiceEmotion {
  emotion: string;
  confidence: number;
}

export interface Sentiment {
  sentiment: string;
  confidence: number;
  scores: Record<string, number>;
}

export interface FusionResult {
  current_emotion: string;
  confidence: number;
  engagement: number;
  explainable_breakdown: {
    dominant_emotion: string;
    overall_confidence: number;
    engagement_score: number;
    modalities: Record<string, any>;
    timestamp: string;
  };
  timestamp: string;
}

export interface AIDecision {
  action: 'SPEED_UP' | 'SHOW_EXPLANATION' | 'RECOMMEND_COMEDY' | 'CONTINUE';
  reasoning: string;
  speed_multiplier: number;
  recommendation_query?: string;
  trigger_modal?: boolean;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  genre: string;
  target_emotions: string[];
  duration_seconds: number;
  video_url: string;
  thumbnail_url: string;
}

export interface CreatorAnalytics {
  video_id: string;
  total_views: number;
  retention_curve: Array<{
    timestamp: number;
    retention: number;
    boredom: number;
    confusion: number;
    happiness: number;
  }>;
  emotion_distribution: Record<string, number>;
  drop_off_points: number[];
  recommendations: string[];
}
