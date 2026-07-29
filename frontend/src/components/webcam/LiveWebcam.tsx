import React from 'react';
import { Camera, CameraOff, Eye, EyeOff, Radio } from 'lucide-react';
import { useWebcamStream } from '../../hooks/useWebcamStream';
import { useStream } from '../../context/StreamContext';
import { Button } from '../ui/Button';

export const LiveWebcam: React.FC<{ videoId: string }> = ({ videoId }) => {
  const { updateStreamData, eyeAttention } = useStream();

  const {
    videoRef,
    canvasRef,
    isStreaming,
    hasPermission,
    startWebcam,
    stopWebcam
  } = useWebcamStream(videoId, (data) => {
    updateStreamData(data);
  });

  return (
    <div className="relative rounded-2xl overflow-hidden glass-card border border-gray-800 bg-surface/90 shadow-xl group">
      {/* Video Element */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          muted
          playsInline
          className={`w-full h-full object-cover transform -scale-x-100 ${!isStreaming ? 'hidden' : ''}`}
        />
        <canvas ref={canvasRef} className="hidden" />

        {!isStreaming && (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
              <CameraOff className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Camera Stream Offline</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">Enable camera feed to initiate multimodal emotion analysis</p>
            </div>
            <Button size="sm" onClick={startWebcam} className="mt-2">
              <Camera className="w-4 h-4 mr-2" /> Start Webcam
            </Button>
          </div>
        )}

        {/* Real-time Eye & Face Mesh HUD Overlay */}
        {isStreaming && (
          <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-mono text-emerald-400 border border-emerald-500/30">
                <Radio className="w-3 h-3 animate-ping text-emerald-400" />
                STREAMING @ 1 FPS
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${eyeAttention.lookingAway ? 'bg-rose-500/80 text-white' : 'bg-emerald-500/80 text-white'}`}>
                {eyeAttention.lookingAway ? 'Looking Away' : 'Attentive'}
              </span>
            </div>

            {/* Bounding Mesh Indicator */}
            <div className="absolute inset-x-8 inset-y-6 border border-cyan-500/30 rounded-xl pointer-events-none flex items-center justify-center">
              <div className="w-16 h-12 border-x border-cyan-400/50 rounded-full animate-pulse opacity-40"></div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-gray-300 bg-black/60 backdrop-blur-md p-1.5 rounded-lg border border-white/10">
              <span>EAR: {(eyeAttention?.ear ?? 0.28).toFixed(2)}</span>
              <span>Blink: {eyeAttention?.blinkRate ?? 15} bpm</span>
              <span>Yaw: {(eyeAttention?.headPose?.yaw ?? 0).toFixed(1)}°</span>
            </div>
          </div>
        )}
      </div>

      {/* Control Footer */}
      {isStreaming && (
        <div className="p-3 bg-surface border-t border-gray-800 flex items-center justify-between">
          <span className="text-xs text-gray-400">MediaPipe Mesh Active</span>
          <button
            onClick={stopWebcam}
            className="text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors flex items-center gap-1"
          >
            <CameraOff className="w-3.5 h-3.5" /> Stop Camera
          </button>
        </div>
      )}
    </div>
  );
};
