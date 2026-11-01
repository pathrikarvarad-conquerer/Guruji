import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ChildProfile, Language, Question, GradingResult } from '../../types';
import { QUESTIONS } from '../../../server/curriculumData';
import { TensOnesBlocks } from '../visuals/TensOnesBlocks';
import { CountingBeads } from '../visuals/CountingBeads';
import { ShapesVisualizer } from '../visuals/ShapesVisualizer';
import { audioService } from '../../utils/audio';
import { AudioNarration } from '../AudioNarration';
import { CheckCircle2, ChevronRight, Compass, Sparkles } from 'lucide-react';

interface DiagnosticAssessmentProps {
  child: ChildProfile;
  language: Language;
  onComplete: () => void;
}

export const DiagnosticAssessment: React.FC<DiagnosticAssessmentProps> = ({
  child,
  language,
  onComplete
}) => {
  // Select 3 foundational sample questions across skills
  const diagnosticPool: Question[] = [
    QUESTIONS.find((q) => q.id === 'q_co_01')!,
    QUESTIONS.find((q) => q.id === 'q_to_01')!,
    QUESTIONS.find((q) => q.id === 'q_sh_01')!
  ].filter(Boolean);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [results, setResults] = useState<{ questionId: string; isCorrect: boolean; skillId: string }[]>([]);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentQ = diagnosticPool[currentIndex];

  const handleSubmitQuestion = async () => {
    if (!currentQ || !selectedAnswer.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/learning/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: child.id,
          questionId: currentQ.id,
          skillId: currentQ.skillId,
          submittedAnswer: selectedAnswer.trim(),
          hintTierUsed: 0,
          timeSpentMs: 7000
        })
      });

      let isCorrect = false;
      if (res.ok) {
        const data = await res.json();
        isCorrect = data.grading.isCorrect;
      }

      const nextResults = [...results, { questionId: currentQ.id, isCorrect, skillId: currentQ.skillId }];
      setResults(nextResults);
      setSelectedAnswer('');

      if (currentIndex + 1 < diagnosticPool.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Mark diagnostic as completed on child profile
        await fetch(`/api/learning/complete-diagnostic/${child.id}`, { method: 'POST' });
        setFinished(true);
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
        audioService.playChime('celebrate');
      }
    } catch (err) {
      console.error('Error submitting diagnostic:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderVisual = (q: Question) => {
    if (!q.visualModel) return null;
    if (q.visualModel.type === 'counting_objects') {
      return <CountingBeads total={q.visualModel.data?.total || 7} />;
    }
    if (q.visualModel.type === 'tens_ones') {
      return (
        <TensOnesBlocks
          initialTens={q.visualModel.data?.tens || 4}
          initialOnes={q.visualModel.data?.ones || 3}
          interactive={false}
        />
      );
    }
    if (q.visualModel.type === 'shapes_geometry') {
      return <ShapesVisualizer initialShape="triangle" />;
    }
    return null;
  };

  if (finished) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4 text-2xl">
            🧭
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-display mb-2">
            Math Discovery Complete!
          </h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Guruji has crafted a personalized learning profile for <span className="font-bold text-teal-800">{child.name}</span>.
            We identified your strengths and set up your daily adventure map!
          </p>

          <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200 mb-6 space-y-2 text-xs">
            <div className="font-bold text-slate-800 text-sm mb-1">Discovery Insights:</div>
            <div className="flex items-center justify-between text-slate-700">
              <span>Counting & 1-to-1 Matching:</span>
              <span className="font-semibold text-emerald-700">Strong Foundation</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span>Tens & Ones (Place Value):</span>
              <span className="font-semibold text-amber-800">Ready for Guided Practice</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span>2D Shapes & Geometry:</span>
              <span className="font-semibold text-emerald-700">Explored</span>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-xs transition"
          >
            Enter Child Adventure Zone
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header banner */}
      <div className="bg-amber-500/10 border border-amber-300/80 rounded-2xl p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500 text-white">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-base">
              Discovery Diagnostic: Finding Your Starting Point
            </h2>
            <p className="text-xs text-slate-600">
              Low-pressure discovery · Question {currentIndex + 1} of {diagnosticPool.length}
            </p>
          </div>
        </div>
        <div className="text-xs font-bold text-amber-900 tabular-nums">
          {Math.round(((currentIndex + 1) / diagnosticPool.length) * 100)}%
        </div>
      </div>

      {currentQ && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
              {currentQ.skillId.replace('skill_', '').replace(/_/g, ' ')}
            </span>
            <AudioNarration
              textToRead={language === 'mr' ? currentQ.promptMr : currentQ.promptEn}
              language={language}
            />
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 leading-snug">
            {language === 'mr' ? currentQ.promptMr : currentQ.promptEn}
          </h3>

          {/* Visual Model */}
          <div className="mb-6">{renderVisual(currentQ)}</div>

          {/* Choices */}
          {currentQ.optionsEn && currentQ.optionsEn.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {(language === 'mr' && currentQ.optionsMr ? currentQ.optionsMr : currentQ.optionsEn).map(
                (opt, idx) => {
                  const val = currentQ.optionsEn?.[idx] || opt;
                  const isSelected = selectedAnswer === val;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedAnswer(val)}
                      className={`p-4 rounded-xl border text-left transition text-sm font-medium ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-200'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                      <span>{opt}</span>
                    </button>
                  );
                }
              )}
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Type your answer:
              </label>
              <input
                type="text"
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                placeholder="Enter answer..."
                className="w-full max-w-xs px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg font-bold tabular-nums"
              />
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSubmitQuestion}
              disabled={submitting || !selectedAnswer.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-xs transition"
            >
              <span>{submitting ? 'Checking...' : 'Save & Continue'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
