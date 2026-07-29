import React from 'react';
import { Layers } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { useStream } from '../../context/StreamContext';

export const MultimodalRadar: React.FC = () => {
  const { fusion } = useStream();

  const engagementVal = typeof fusion?.engagement === 'number' ? fusion.engagement : 85.0;

  const data = [
    { modality: 'Face (40%)', score: (fusion?.explainable_breakdown?.modalities?.face?.confidence ?? 0.8) * 100 },
    { modality: 'Eye (10%)', score: fusion?.explainable_breakdown?.modalities?.eye_attention?.score ?? 90 },
    { modality: 'Voice (25%)', score: (fusion?.explainable_breakdown?.modalities?.voice?.confidence ?? 0.75) * 100 },
    { modality: 'Text (15%)', score: (fusion?.explainable_breakdown?.modalities?.text_sentiment?.confidence ?? 0.85) * 100 },
    { modality: 'Behaviour (10%)', score: fusion?.explainable_breakdown?.modalities?.behaviour?.score ?? 85 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Layers className="w-4 h-4 text-accent-purple" /> Fusion Engine Radar
        </CardTitle>
        <span className="text-xs font-mono text-purple-400 font-bold">
          {engagementVal.toFixed(0)}% Engaged
        </span>
      </CardHeader>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#1F2937" />
            <PolarAngleAxis dataKey="modality" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#374151" tick={false} />
            <Radar
              name="Modality Fusion Score"
              dataKey="score"
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
