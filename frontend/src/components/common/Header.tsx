import React from 'react';
import { Camera, Radio, Zap, ShieldCheck } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useStream } from '../../context/StreamContext';

export const Header: React.FC = () => {
  const { fusion, eyeAttention } = useStream();

  const engagementVal = typeof fusion?.engagement === 'number' ? fusion.engagement : 85.0;
  const confidenceVal = typeof fusion?.confidence === 'number' ? fusion.confidence : 0.88;

  return (
    <header className="h-16 glass-panel border-b border-gray-800 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold text-white tracking-wide">Live Session Monitor</h2>
        <Badge variant="emerald" className="animate-pulse flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Webcam Active
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        {/* Real-time Status Indicators */}
        <div className="flex items-center gap-2 bg-surface/70 px-3 py-1.5 rounded-xl border border-gray-800 text-xs">
          <Zap className="w-3.5 h-3.5 text-accent-cyan" />
          <span className="text-gray-400">Engagement:</span>
          <span className="font-semibold text-cyan-400">{engagementVal.toFixed(1)}%</span>
        </div>

        <div className="flex items-center gap-2 bg-surface/70 px-3 py-1.5 rounded-xl border border-gray-800 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-accent-emerald" />
          <span className="text-gray-400">Confidence:</span>
          <span className="font-semibold text-emerald-400">{(confidenceVal * 100).toFixed(0)}%</span>
        </div>
      </div>
    </header>
  );
};
