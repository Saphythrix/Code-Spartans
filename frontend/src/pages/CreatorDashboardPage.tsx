import React, { useEffect, useState } from 'react';
import { Layout } from '../components/common/Layout';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Radio, AlertTriangle, TrendingDown, Download, FileText, Sparkles } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { CreatorAnalytics } from '../types';
import { fetchCreatorAnalytics } from '../services/api';

export const CreatorDashboardPage: React.FC = () => {
  const [data, setData] = useState<CreatorAnalytics | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetchCreatorAnalytics('vid_1');
      setData(res);
    }
    load();
  }, []);

  const handleExportCSV = () => {
    if (!data) return;
    let csvContent = 'data:text/csv;charset=utf-8,Timestamp_Sec,Retention_Pct,Boredom_Pct,Confusion_Pct,Happiness_Pct\n';
    data.retention_curve.forEach((row) => {
      csvContent += `${row.timestamp},${row.retention},${row.boredom},${row.confusion},${row.happiness}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Creator_Telemetry_${data.video_id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Radio className="w-5 h-5 text-accent-purple" /> Creator Studio & Retention Telemetry
            </h1>
            <p className="text-xs text-gray-400 mt-1">AI insights on audience retention, drop-off points, and emotional engagement</p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleExportCSV} className="flex items-center gap-1.5">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
            <Button size="sm" onClick={handleExportPDF} className="flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> PDF Report
            </Button>
          </div>
        </div>

        {data && (
          <>
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <p className="text-xs text-gray-400">Total Viewer Impressions</p>
                <p className="text-2xl font-black text-white font-mono mt-1">{data.total_views.toLocaleString()}</p>
              </Card>

              <Card>
                <p className="text-xs text-gray-400">Critical Drop-off Points</p>
                <p className="text-2xl font-black text-rose-400 font-mono mt-1">{data.drop_off_points.length} Segments</p>
                <p className="text-[10px] text-gray-400 mt-0.5">At {data.drop_off_points.map(p => `${Math.floor(p / 60)}:${Math.floor(p % 60).toString().padStart(2, '0')}`).join(', ')}</p>
              </Card>

              <Card>
                <p className="text-xs text-gray-400">AI Optimization Score</p>
                <p className="text-2xl font-black text-emerald-400 font-mono mt-1">92 / 100</p>
              </Card>
            </div>

            {/* Retention & Dropoff Chart */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <TrendingDown className="w-4 h-4 text-accent-rose" /> Viewer Retention & Emotion Curve
                </CardTitle>
                <span className="text-xs text-gray-400 font-mono">Timestamped Analytics</span>
              </CardHeader>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.retention_curve} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis dataKey="timestamp" stroke="#9CA3AF" tickFormatter={(t) => `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`} />
                    <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="retention" stroke="#6366F1" strokeWidth={3} name="Retention %" />
                    <Line type="monotone" dataKey="confusion" stroke="#F59E0B" strokeWidth={2} name="Confusion Spike" />
                    <Line type="monotone" dataKey="boredom" stroke="#A855F7" strokeWidth={2} name="Boredom Index" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* AI Creator Recommendations List */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <Sparkles className="w-4 h-4 text-accent-cyan" /> Actionable Creator Insights
                </CardTitle>
              </CardHeader>

              <div className="space-y-3">
                {data.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-surface/50 border border-gray-800 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300 leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};
