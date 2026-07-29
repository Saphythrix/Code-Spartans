import React, { useEffect, useState } from 'react';
import { Sparkles, Play, Clock, Tag, Film, BookOpen, Music } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Recommendation, Video } from '../../types';
import { fetchRecommendations } from '../../services/api';
import { useStream } from '../../context/StreamContext';

export const RecommendationPanel: React.FC<{ onSelectVideo: (video: Video) => void }> = ({ onSelectVideo }) => {
  const { currentEmotion } = useStream();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const categories = [
    { name: 'All', icon: Sparkles },
    { name: 'Movies', icon: Film },
    { name: 'Learning', icon: BookOpen },
    { name: 'Music', icon: Music },
  ];

  useEffect(() => {
    async function load() {
      setLoading(true);
      const genreFilter = activeCategory === 'All' ? undefined : activeCategory;
      const recs = await fetchRecommendations(currentEmotion?.emotion || 'neutral');
      setRecommendations(recs);
      setLoading(false);
    }
    load();
  }, [currentEmotion?.emotion, activeCategory]);

  const filteredRecs = recommendations.filter((item) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Movies') return item.genre.includes('Comedy') || item.genre.includes('Sci-Fi') || item.genre.includes('Action');
    if (activeCategory === 'Learning') return item.genre.includes('Science') || item.genre.includes('Education');
    if (activeCategory === 'Music') return item.genre.includes('Music') || item.genre.includes('Ambient');
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Sparkles className="w-4 h-4 text-accent-amber" /> Content Hub & Recommendations
        </CardTitle>
        <span className="text-xs text-amber-400 font-mono capitalize">
          Tailored for {currentEmotion?.emotion || 'Happy'}
        </span>
      </CardHeader>

      {/* Category Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-surface/80 rounded-xl border border-gray-800 mb-4 overflow-x-auto">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-primary-600 text-white font-bold shadow-md shadow-primary-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.name}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="p-6 text-center text-xs text-gray-500 animate-pulse">Running HuggingFace & Vector Search...</div>
        ) : (
          (filteredRecs.length > 0 ? filteredRecs : recommendations).map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectVideo({
                  _id: item.id,
                  title: item.title,
                  description: item.description,
                  genre: item.genre,
                  duration_seconds: item.duration_seconds,
                  video_url: item.video_url,
                  thumbnail_url: item.thumbnail_url
                });
              }}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-surface/40 hover:bg-surface-hover border border-gray-800/80 hover:border-primary-500/40 cursor-pointer transition-all group"
            >
              <div className="relative w-24 aspect-video rounded-lg overflow-hidden bg-black flex-shrink-0">
                <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-white truncate group-hover:text-primary-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-400 truncate mt-0.5">{item.description}</p>

                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-500">
                  <span className="flex items-center gap-1 font-mono text-cyan-400">
                    <Tag className="w-3 h-3" /> {item.genre}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" /> {Math.floor(item.duration_seconds / 60)}m
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
