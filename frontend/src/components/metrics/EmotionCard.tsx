import React from 'react';
import { Smile, Frown, Meh, AlertCircle, HeartPulse } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { useStream } from '../../context/StreamContext';

export const EmotionCard: React.FC = () => {
  const { currentEmotion, fusion } = useStream();
  const rawEmotion = currentEmotion?.emotion || 'happy';
  const emotion = rawEmotion.toLowerCase();
  const confidence = typeof currentEmotion?.confidence === 'number' ? currentEmotion.confidence : 0.88;

  const getEmotionDetails = () => {
    switch (emotion) {
      case 'happy':
        return { icon: Smile, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', label: 'Joyful & Receptive' };
      case 'sad':
        return { icon: Frown, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30', label: 'Low Mood' };
      case 'confused':
        return { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', label: 'Cognitive Load / Puzzled' };
      case 'bored':
        return { icon: Meh, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30', label: 'Wandering Attention' };
      default:
        return { icon: Meh, color: 'text-gray-300', bg: 'bg-gray-800 border-gray-700', label: 'Neutral Focus' };
    }
  };

  const details = getEmotionDetails();
  const Icon = details.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <HeartPulse className="w-4 h-4 text-accent-rose animate-pulse" /> Live Emotion State
        </CardTitle>
        <span className="text-xs font-mono text-gray-400">DeepFace AI</span>
      </CardHeader>

      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl ${details.bg} border flex items-center justify-center shadow-lg`}>
          <Icon className={`w-8 h-8 ${details.color}`} />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-white capitalize">{rawEmotion}</h4>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {(confidence * 100).toFixed(0)}% Conf.
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{details.label}</p>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-gray-800 rounded-full mt-2.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-cyan transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, confidence * 100))}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
