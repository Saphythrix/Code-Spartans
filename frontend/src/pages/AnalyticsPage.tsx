import React from 'react';
import { Layout } from '../components/common/Layout';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Activity, Clock, Zap, Layers, Sparkles } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const timelineData = [
    { time: '00:00', happy: 80, confused: 5, bored: 10, attention: 95 },
    { time: '01:00', happy: 75, confused: 15, bored: 10, attention: 88 },
    { time: '02:00', happy: 40, confused: 45, bored: 15, attention: 72 },
    { time: '03:00', happy: 50, confused: 10, bored: 40, attention: 65 },
    { time: '04:00', happy: 85, confused: 5, bored: 10, attention: 92 },
    { time: '05:00', happy: 90, confused: 5, bored: 5, attention: 96 },
  ];

  const pieData = [
    { name: 'Happy / Engaged', value: 55, color: '#10B981' },
    { name: 'Neutral', value: 20, color: '#6366F1' },
    { name: 'Confused', value: 15, color: '#F59E0B' },
    { name: 'Bored / Drowsy', value: 10, color: '#A855F7' },
  ];

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent-cyan" /> Viewer Emotion & Engagement Analytics
            </h1>
            <p className="text-xs text-gray-400 mt-1">Real-time multimodal telemetry aggregated over playback session</p>
          </div>

          <div className="flex items-center gap-2 bg-surface p-1.5 rounded-xl border border-gray-800 text-xs text-gray-300">
            <Clock className="w-3.5 h-3.5 text-primary-400" />
            <span>Session Duration: <strong>05:24</strong></span>
          </div>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-surface/90">
            <p className="text-xs text-gray-400">Avg. Engagement</p>
            <p className="text-2xl font-black text-emerald-400 font-mono mt-1">86.4%</p>
            <span className="text-[10px] text-emerald-500 font-medium">↑ +4.2% vs benchmark</span>
          </Card>
          <Card className="bg-surface/90">
            <p className="text-xs text-gray-400">Dominant Emotion</p>
            <p className="text-2xl font-black text-white capitalize font-mono mt-1">Happy</p>
            <span className="text-[10px] text-gray-400">55% of session duration</span>
          </Card>
          <Card className="bg-surface/90">
            <p className="text-xs text-gray-400">Cognitive Confusion</p>
            <p className="text-2xl font-black text-amber-400 font-mono mt-1">15%</p>
            <span className="text-[10px] text-amber-500 font-medium">1 AI explanation triggered</span>
          </Card>
          <Card className="bg-surface/90">
            <p className="text-xs text-gray-400">Attention Index</p>
            <p className="text-2xl font-black text-cyan-400 font-mono mt-1">91.8</p>
            <span className="text-[10px] text-cyan-500 font-medium">Avg blink rate 14 bpm</span>
          </Card>
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Emotion Timeline Chart */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Zap className="w-4 h-4 text-primary-400" /> Continuous Emotion Timeline
                </CardTitle>
                <span className="text-xs text-gray-400 font-mono">1 FPS Telemetry</span>
              </CardHeader>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="happyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="confusedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis dataKey="time" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="happy" stroke="#10B981" fillOpacity={1} fill="url(#happyGrad)" name="Happy State" />
                    <Area type="monotone" dataKey="confused" stroke="#F59E0B" fillOpacity={1} fill="url(#confusedGrad)" name="Confusion Index" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Emotion Distribution Donut */}
          <div className="lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Layers className="w-4 h-4 text-accent-purple" /> Emotion Distribution
                </CardTitle>
              </CardHeader>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-gray-800 text-xs">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-300">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-mono text-gray-400 font-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};
