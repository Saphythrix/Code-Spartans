import React from 'react';
import { Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { useStream } from '../../context/StreamContext';

export const AttentionGauge: React.FC = () => {
  const { eyeAttention } = useStream();

  const attentionVal = typeof eyeAttention?.attention === 'number' ? eyeAttention.attention : 85.0;
  const earVal = typeof eyeAttention?.ear === 'number' ? eyeAttention.ear : 0.28;
  const blinkRate = typeof eyeAttention?.blinkRate === 'number' ? eyeAttention.blinkRate : 15;
  const yawVal = typeof eyeAttention?.headPose?.yaw === 'number' ? eyeAttention.headPose.yaw : 0;
  const isLookingAway = Boolean(eyeAttention?.lookingAway);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Eye className="w-4 h-4 text-accent-cyan" /> Attention & Eye Mesh
        </CardTitle>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${isLookingAway ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
          {isLookingAway ? 'Distracted' : 'Focused'}
        </span>
      </CardHeader>

      <div className="space-y-4">
        {/* Radial Meter / Gauge Score */}
        <div className="flex items-center justify-between bg-surface/60 p-3 rounded-xl border border-gray-800">
          <div>
            <p className="text-xs text-gray-400">Attention Score</p>
            <p className="text-2xl font-black text-white font-mono mt-0.5">
              {attentionVal.toFixed(1)}<span className="text-xs text-gray-400 font-sans">/100</span>
            </p>
          </div>

          <div className="w-12 h-12 rounded-full border-4 border-gray-800 flex items-center justify-center relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="currentColor"
                strokeWidth="4"
                className="text-gray-800"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="currentColor"
                strokeWidth="4"
                className="text-cyan-400 transition-all duration-500"
                fill="transparent"
                strokeDasharray={113}
                strokeDashoffset={113 - (113 * Math.min(100, Math.max(0, attentionVal))) / 100}
              />
            </svg>
          </div>
        </div>

        {/* Micro-metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-surface/40 p-2 rounded-xl border border-gray-800/80">
            <p className="text-[10px] text-gray-400">Blink Rate</p>
            <p className="font-bold text-white mt-1 font-mono">{blinkRate} <span className="text-[9px] text-gray-500">bpm</span></p>
          </div>

          <div className="bg-surface/40 p-2 rounded-xl border border-gray-800/80">
            <p className="text-[10px] text-gray-400">EAR Index</p>
            <p className="font-bold text-cyan-400 mt-1 font-mono">{earVal.toFixed(2)}</p>
          </div>

          <div className="bg-surface/40 p-2 rounded-xl border border-gray-800/80">
            <p className="text-[10px] text-gray-400">Head Yaw</p>
            <p className="font-bold text-purple-400 mt-1 font-mono">{yawVal.toFixed(1)}°</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
