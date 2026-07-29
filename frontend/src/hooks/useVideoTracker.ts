import { useCallback } from 'react';

export function useVideoTracker(videoId: string, sessionId: string = 'session_default') {
  const logEvent = useCallback(
    async (eventType: 'pause' | 'skip' | 'replay' | 'seek' | 'speed_change' | 'play', timestampSeconds: number, metadata?: any) => {
      try {
        await fetch('http://localhost:8000/api/v1/emotions/track-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('emotionsync_token') || ''}`
          },
          body: JSON.stringify({
            video_id: videoId,
            session_id: sessionId,
            event_type: eventType,
            timestamp_seconds: timestampSeconds,
            metadata: metadata || {}
          })
        });
        console.log(`[EventTrack] Logged ${eventType} at ${timestampSeconds.toFixed(1)}s`);
      } catch (err) {
        console.warn(`Failed to log playback event: ${eventType}`, err);
      }
    },
    [videoId, sessionId]
  );

  return { logEvent };
}
