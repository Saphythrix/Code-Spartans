import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, FastForward, Gauge, Sparkles, HelpCircle, Subtitles, Volume2, Bookmark, Layers } from 'lucide-react';
import { Video } from '../../types';
import { useStream } from '../../context/StreamContext';
import { useVideoTracker } from '../../hooks/useVideoTracker';

export const VideoPlayer: React.FC<{ video: Video }> = ({ video }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(video.duration_seconds || 100);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [audioEnhanced, setAudioEnhanced] = useState<boolean>(false);
  
  const [videoSrc, setVideoSrc] = useState<string>(video.video_url);

  const { playbackSpeed, setPlaybackSpeed, decision, setExplanationOpen } = useStream();
  const { logEvent } = useVideoTracker(video._id);

  useEffect(() => {
    setVideoSrc(video.video_url);
  }, [video.video_url]);

  const handleVideoError = () => {
    console.warn("Primary video stream failed to load, switching to fallback stream.");
    const fallbacks = [
      "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
      "https://vjs.zencdn.net/v/oceans.mp4",
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
    ];
    const nextSrc = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    if (videoSrc !== nextSrc) {
      setVideoSrc(nextSrc);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      logEvent('pause', currentTime);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      logEvent('play', currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
      logEvent('seek', val);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    logEvent('speed_change', currentTime, { speed });
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      const next = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
      videoRef.current.currentTime = next;
      setCurrentTime(next);
      logEvent('skip', next, { skip_seconds: seconds });
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
      logEvent('replay', 0);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden glass-card border border-gray-800 flex flex-col bg-surface shadow-2xl">
      {/* AI Context Engine Header Banner */}
      <div className="bg-surface/90 border-b border-gray-800 p-2.5 px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-mono text-cyan-400">
          <Bookmark className="w-3.5 h-3.5" />
          <span>Topic: <strong>{video.genre || 'General Concept'}</strong></span>
          <span className="text-gray-600">•</span>
          <span className="text-amber-400">Difficulty: <strong>High</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSubtitles(!showSubtitles)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              showSubtitles ? 'bg-primary-600/30 text-primary-300 border border-primary-500/40' : 'text-gray-400 hover:text-white'
            }`}
            title="Toggle Dynamic AI Subtitles"
          >
            <Subtitles className="w-3 h-3" /> Subtitles
          </button>

          <button
            onClick={() => setAudioEnhanced(!audioEnhanced)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              audioEnhanced ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40' : 'text-gray-400 hover:text-white'
            }`}
            title="Toggle AI Spatial Audio Enhancement"
          >
            <Volume2 className="w-3 h-3" /> Audio Boost
          </button>
        </div>
      </div>

      {/* Dynamic AI Decision Notice Banner */}
      {decision?.action && decision.action !== 'CONTINUE' && (
        <div className="bg-gradient-to-r from-primary-600/30 to-accent-purple/30 border-b border-primary-500/30 p-2.5 px-4 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-medium text-primary-300">
            <Sparkles className="w-4 h-4 text-accent-cyan animate-spin" />
            <span><strong>AI Decision Engine:</strong> {decision.reasoning}</span>
          </div>
          {decision.action === 'SHOW_EXPLANATION' && (
            <button
              onClick={() => setExplanationOpen(true)}
              className="text-xs bg-primary-600 hover:bg-primary-500 text-white px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all shadow-md"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Explain Concept
            </button>
          )}
        </div>
      )}

      {/* Main Video Viewport */}
      <div className="relative aspect-video w-full bg-black group overflow-hidden">
        <video
          ref={videoRef}
          src={videoSrc}
          poster={video.thumbnail_url}
          className="w-full h-full object-cover"
          onError={handleVideoError}
          onTimeUpdate={() => {
            if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
          }}
          onLoadedMetadata={() => {
            if (videoRef.current) setDuration(videoRef.current.duration);
          }}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Dynamic AI Subtitles Overlay */}
        {showSubtitles && (
          <div className="absolute bottom-16 inset-x-8 text-center pointer-events-none">
            <span className="inline-block px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-xs font-medium text-white border border-white/10 shadow-lg">
              {video.transcript || 'Real-time AI Subtitles tracking audio stream...'}
            </span>
          </div>
        )}

        {/* Video Controls Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col gap-3 opacity-95 group-hover:opacity-100 transition-opacity">
          {/* Progress Timeline */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-gray-300">
              {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500 hover:accent-primary-400"
            />
            <span className="text-xs font-mono text-gray-400">
              {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-xl bg-primary-600 hover:bg-primary-500 text-white flex items-center justify-center transition-all shadow-md shadow-primary-600/30"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={() => handleSkip(10)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
                title="Skip +10s"
              >
                <FastForward className="w-4 h-4" />
              </button>

              <button
                onClick={handleReplay}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
                title="Replay Video"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Playback Speed Controls */}
            <div className="flex items-center gap-1.5 bg-surface/80 p-1 rounded-xl border border-gray-800">
              <Gauge className="w-3.5 h-3.5 text-gray-400 ml-1.5" />
              {[0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                <button
                  key={s}
                  onClick={() => handleSpeedChange(s)}
                  className={`px-2 py-0.5 text-xs font-mono rounded-lg transition-all ${
                    playbackSpeed === s
                      ? 'bg-primary-600 text-white font-bold shadow'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Details Header */}
      <div className="p-4 border-t border-gray-800/80 bg-surface flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">{video.title}</h2>
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{video.description}</p>
        </div>
      </div>
    </div>
  );
};
