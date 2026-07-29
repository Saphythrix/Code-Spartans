import React, { createContext, useContext, useState } from 'react';
import { FaceEmotion, EyeAttention, FusionResult, AIDecision } from '../types';

interface StreamContextType {
  currentEmotion: FaceEmotion;
  eyeAttention: EyeAttention;
  fusion: FusionResult;
  decision: AIDecision;
  playbackSpeed: number;
  isExplanationOpen: boolean;
  setPlaybackSpeed: (speed: number) => void;
  setExplanationOpen: (open: boolean) => void;
  updateStreamData: (data: any) => void;
}

const defaultFusion: FusionResult = {
  current_emotion: 'happy',
  confidence: 0.88,
  engagement: 92.5,
  explainable_breakdown: {
    dominant_emotion: 'happy',
    overall_confidence: 0.88,
    engagement_score: 92.5,
    modalities: {
      face: { detected: 'happy', confidence: 0.88 },
      eye_attention: { score: 95.0, looking_away: false },
      behaviour: { score: 85.0 }
    },
    timestamp: new Date().toISOString()
  },
  timestamp: new Date().toISOString()
};

const defaultDecision: AIDecision = {
  action: 'CONTINUE',
  reasoning: 'Viewer is focused and experiencing positive engagement.',
  speed_multiplier: 1.0,
  trigger_modal: false
};

const StreamContext = createContext<StreamContextType | undefined>(undefined);

export const StreamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentEmotion, setCurrentEmotion] = useState<FaceEmotion>({ emotion: 'happy', confidence: 0.88 });
  const [eyeAttention, setEyeAttention] = useState<EyeAttention>({
    attention: 92.5,
    lookingAway: false,
    blinkRate: 15.0,
    ear: 0.28,
    headPose: { yaw: 1.2, pitch: -0.8, roll: 0.4 }
  });
  const [fusion, setFusion] = useState<FusionResult>(defaultFusion);
  const [decision, setDecision] = useState<AIDecision>(defaultDecision);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isExplanationOpen, setExplanationOpen] = useState<boolean>(false);

  const updateStreamData = (data: any) => {
    if (data.face_emotion) setCurrentEmotion(data.face_emotion);
    if (data.eye_attention) setEyeAttention(data.eye_attention);
    if (data.fusion) setFusion(data.fusion);
    if (data.decision) {
      setDecision(data.decision);
      if (data.decision.speed_multiplier && data.decision.speed_multiplier !== playbackSpeed) {
        setPlaybackSpeed(data.decision.speed_multiplier);
      }
      if (data.decision.trigger_modal) {
        setExplanationOpen(true);
      }
    }
  };

  return (
    <StreamContext.Provider
      value={{
        currentEmotion,
        eyeAttention,
        fusion,
        decision,
        playbackSpeed,
        isExplanationOpen,
        setPlaybackSpeed,
        setExplanationOpen,
        updateStreamData
      }}
    >
      {children}
    </StreamContext.Provider>
  );
};

export const useStream = () => {
  const context = useContext(StreamContext);
  if (!context) throw new Error('useStream must be used within a StreamProvider');
  return context;
};
