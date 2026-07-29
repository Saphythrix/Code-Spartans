import React, { useEffect, useState } from 'react';
import { Layout } from '../components/common/Layout';
import { VideoPlayer } from '../components/player/VideoPlayer';
import { LiveWebcam } from '../components/webcam/LiveWebcam';
import { EmotionCard } from '../components/metrics/EmotionCard';
import { AttentionGauge } from '../components/metrics/AttentionGauge';
import { MultimodalRadar } from '../components/metrics/MultimodalRadar';
import { HolographicCanvas3D } from '../components/visualizer/HolographicCanvas3D';
import { RecommendationPanel } from '../components/recommendations/RecommendationPanel';
import { AIExplanationModal } from '../components/assistant/AIExplanationModal';
import { Video } from '../types';
import { fetchVideos } from '../services/api';

export const DashboardPage: React.FC = () => {
  const [currentVideo, setCurrentVideo] = useState<Video>({
    _id: 'vid_1',
    title: 'Quantum Mechanics & Quantum Computing Demystified',
    description: 'An interactive visual guide exploring qubits, superposition, entanglement, and real-world quantum algorithms.',
    genre: 'Learning',
    duration_seconds: 600,
    video_url: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop',
    transcript: 'Welcome to quantum computing. In classical computing, bits are either 0 or 1. Qubits leverage superposition to represent both simultaneously.'
  });

  useEffect(() => {
    async function load() {
      const vids = await fetchVideos();
      if (vids && vids.length > 0) {
        setCurrentVideo(vids[0]);
      }
    }
    load();
  }, []);

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
        {/* Left Main Column: Video Player + 3D Holographic Visualizer + Telemetry (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <VideoPlayer video={currentVideo} />

          {/* Real-time 3D Holographic Core Visualizer + Emotion Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <HolographicCanvas3D />
            <EmotionCard />
            <AttentionGauge />
            <MultimodalRadar />
          </div>
        </div>

        {/* Right Sidebar Column: Live Webcam Stream + Recommendation Category Hub (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <LiveWebcam videoId={currentVideo._id} />
          <RecommendationPanel onSelectVideo={(video) => setCurrentVideo(video)} />
        </div>
      </div>

      {/* AI Concept Assistant Modal */}
      <AIExplanationModal videoTitle={currentVideo.title} transcript={currentVideo.transcript} />
    </Layout>
  );
};
