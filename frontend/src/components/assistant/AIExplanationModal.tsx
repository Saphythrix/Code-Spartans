import React, { useEffect, useState } from 'react';
import { X, Sparkles, HelpCircle, CheckCircle2, XCircle, BookOpen } from 'lucide-react';
import { useStream } from '../../context/StreamContext';
import { requestLLMExplanation } from '../../services/api';
import { Button } from '../ui/Button';

export const AIExplanationModal: React.FC<{ videoTitle: string; transcript?: string }> = ({ videoTitle, transcript }) => {
  const { isExplanationOpen, setExplanationOpen, currentEmotion } = useStream();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    if (isExplanationOpen) {
      async function load() {
        setLoading(true);
        const res = await requestLLMExplanation(
          transcript || 'Quantum algorithms operate on qubits maintaining superposed states.',
          currentEmotion.emotion,
          videoTitle
        );
        setData(res);
        setLoading(false);
      }
      load();
    }
  }, [isExplanationOpen, videoTitle, transcript, currentEmotion.emotion]);

  if (!isExplanationOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface border border-gray-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600/20 text-primary-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Concept Assistant</h3>
              <p className="text-xs text-gray-400">Triggered by {currentEmotion.emotion} state detection</p>
            </div>
          </div>

          <button
            onClick={() => setExplanationOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-primary-500 animate-spin mx-auto" />
            <p className="text-sm font-medium text-gray-300">Synthesizing LLM Concept Breakdown...</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {/* Explanation Section */}
            <div className="bg-primary-950/30 border border-primary-500/30 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-primary-300 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <BookOpen className="w-4 h-4 text-primary-400" /> Simplified Explanation
              </h4>
              <p className="text-xs text-gray-200 leading-relaxed">{data.explanation}</p>
            </div>

            {/* Practical Example */}
            {data.example && (
              <div className="bg-surface-hover/50 border border-gray-800 p-3.5 rounded-xl">
                <h4 className="text-xs font-semibold text-cyan-400 mb-1">Real-World Analogy:</h4>
                <p className="text-xs text-gray-300">{data.example}</p>
              </div>
            )}

            {/* Interactive Quiz */}
            {data.quiz && data.quiz.length > 0 && (
              <div className="border border-gray-800 p-4 rounded-xl bg-surface/40 space-y-3">
                <h4 className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-accent-amber" /> Interactive Knowledge Check
                </h4>
                {data.quiz.map((q: any, qIdx: number) => (
                  <div key={qIdx} className="space-y-2 text-xs">
                    <p className="font-medium text-gray-200">{qIdx + 1}. {q.question}</p>
                    <div className="grid grid-cols-1 gap-1.5">
                      {q.options.map((opt: string, optIdx: number) => {
                        const isSelected = selectedAnswers[qIdx] === optIdx;
                        const isCorrect = optIdx === q.answer;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => setSelectedAnswers({ ...selectedAnswers, [qIdx]: optIdx })}
                            className={`p-2 rounded-lg text-left transition-all flex items-center justify-between border ${
                              isSelected
                                ? isCorrect
                                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                  : 'bg-rose-500/20 border-rose-500 text-rose-300'
                                : 'bg-surface border-gray-800 text-gray-300 hover:bg-white/5'
                            }`}
                          >
                            <span>{opt}</span>
                            {isSelected && (
                              isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button onClick={() => setExplanationOpen(false)} size="sm">
            Resume Video Stream
          </Button>
        </div>
      </div>
    </div>
  );
};
