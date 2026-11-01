import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Lesson,
  Skill,
  Question,
  ChildProfile,
  Language,
  GradingResult
} from '../../types';
import { AudioNarration } from '../AudioNarration';
import { TensOnesBlocks } from '../visuals/TensOnesBlocks';
import { TenFrame } from '../visuals/TenFrame';
import { NumberLine } from '../visuals/NumberLine';
import { CountingBeads } from '../visuals/CountingBeads';
import { ShapesVisualizer } from '../visuals/ShapesVisualizer';
import { audioService } from '../../utils/audio';
import {
  ChevronRight,
  HelpCircle,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

interface LessonPlayerProps {
  skillId: string;
  child: ChildProfile;
  language: Language;
  onExit: () => void;
  onLessonComplete: (skillId: string) => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  skillId,
  child,
  language,
  onExit,
  onLessonComplete
}) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [skill, setSkill] = useState<Skill | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Flow stages: 'explain' -> 'worked_example' -> 'comprehension' -> 'practice' -> 'celebrate'
  const [stage, setStage] = useState<'explain' | 'worked_example' | 'comprehension' | 'practice' | 'celebrate'>('explain');

  // Worked example progressive step reveal
  const [revealedSteps, setRevealedSteps] = useState(1);

  // Comprehension check state
  const [compAnswer, setCompAnswer] = useState<number | null>(null);
  const [compSubmitted, setCompSubmitted] = useState(false);

  // Practice questions state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [hintTier, setHintTier] = useState<number>(0);
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  // AI Tutor contextual explanation extension
  const [aiAnalogy, setAiAnalogy] = useState<{ textEn: string; textMr: string } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [lessonRes, nextRes] = await Promise.all([
          fetch(`/api/learning/lesson/${skillId}`),
          fetch(`/api/learning/next/${child.id}`)
        ]);

        if (lessonRes.ok) {
          const data = await lessonRes.json();
          setLesson(data.lesson);
          setSkill(data.skill);
        }

        if (nextRes.ok) {
          const nextData = await nextRes.json();
          if (nextData.recommendedQuestions && nextData.recommendedQuestions.length > 0) {
            setQuestions(nextData.recommendedQuestions);
          }
        }
      } catch (err) {
        console.error('Error loading lesson:', err);
      } finally {
        setLoading(false);
        setStartTime(Date.now());
      }
    }
    loadData();
  }, [skillId, child.id]);

  // Request alternative AI explanation on demand
  const fetchAiAnalogy = async () => {
    if (!lesson || !skill) return;
    try {
      setLoadingAi(true);
      const res = await fetch('/api/tutor/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillTitle: skill.titleEn,
          learningObjective: lesson.learningObjectiveEn,
          age: child.age
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiAnalogy({
          textEn: data.analogyEn || data.explanationEn,
          textMr: data.analogyMr || data.explanationMr
        });
      }
    } catch {
      // Fallback
      setAiAnalogy({
        textEn: 'Think of 10 crayons in one box! 3 boxes and 4 loose crayons make 34 crayons.',
        textMr: 'एका खोक्यात १० खडू आहेत अशी कल्पना करा! ३ खोकी आणि ४ सुटे खडू मिळून ३४ होतात.'
      });
    } finally {
      setLoadingAi(false);
    }
  };

  const handleComprehensionSubmit = (index: number) => {
    setCompAnswer(index);
    setCompSubmitted(true);
    if (lesson && index === lesson.comprehensionCheck.correctIndex) {
      audioService.playChime('correct');
    } else {
      audioService.playChime('incorrect');
    }
  };

  const currentQ = questions[currentQIndex];

  const handlePracticeSubmit = async () => {
    if (!currentQ || !userAnswer.trim()) return;

    try {
      setSubmitting(true);
      const timeSpentMs = Date.now() - startTime;

      const res = await fetch('/api/learning/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: child.id,
          questionId: currentQ.id,
          skillId: currentQ.skillId,
          submittedAnswer: userAnswer.trim(),
          hintTierUsed: hintTier,
          timeSpentMs
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGradingResult(data.grading);

        if (data.grading.isCorrect) {
          audioService.playChime('correct');
        } else {
          audioService.playChime('incorrect');
        }
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setGradingResult(null);
    setUserAnswer('');
    setHintTier(0);
    setStartTime(Date.now());

    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setStage('celebrate');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      audioService.playChime('celebrate');
      onLessonComplete(skillId);
    }
  };

  // Helper to render visual models
  const renderVisualModel = (model: any) => {
    if (!model) return null;
    switch (model.type) {
      case 'tens_ones':
        return (
          <TensOnesBlocks
            initialTens={model.data?.tens ?? 3}
            initialOnes={model.data?.ones ?? 4}
            interactive={true}
          />
        );
      case 'ten_frame':
        return (
          <TenFrame
            firstCount={model.data?.start ?? 8}
            secondCount={model.data?.jump ?? 5}
          />
        );
      case 'number_line':
        return (
          <NumberLine
            start={model.data?.start ?? 11}
            jump={model.data?.jump ?? 4}
            end={model.data?.end ?? 7}
          />
        );
      case 'counting_objects':
        return (
          <CountingBeads
            total={model.data?.total ?? 7}
            itemLabel={model.data?.items?.[0]?.label ?? 'Apples'}
          />
        );
      case 'shapes_geometry':
        return <ShapesVisualizer initialShape={model.data?.shape ?? 'triangle'} />;
      default:
        return null;
    }
  };

  if (loading || !lesson || !skill) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium">Opening your lesson with Guruji...</p>
      </div>
    );
  }

  const title = language === 'mr' ? lesson.titleMr : lesson.titleEn;
  const objective = language === 'mr' ? lesson.learningObjectiveMr : lesson.learningObjectiveEn;
  const explanation = language === 'mr' ? lesson.simpleExplanationMr : lesson.simpleExplanationEn;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 md:px-6">
      {/* Top Header / Progress Bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Lesson</span>
        </button>

        {/* Lesson Stages Navigator */}
        <div className="flex items-center gap-2">
          {(['explain', 'worked_example', 'comprehension', 'practice'] as const).map((st, idx) => {
            const labels = {
              explain: language === 'mr' ? 'संकल्पना' : 'Concept',
              worked_example: language === 'mr' ? 'उदाहरणे' : 'Worked Example',
              comprehension: language === 'mr' ? 'समजून घेणे' : 'Check',
              practice: language === 'mr' ? 'सराव' : 'Practice'
            };
            const isActive = stage === st;
            return (
              <button
                key={st}
                onClick={() => setStage(st)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}. {labels[st]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lesson Title & Objective */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
          <span>{skill.code}</span>
          <span>·</span>
          <span>{skill.subject}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-display mb-2">
          {title}
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          🎯 {objective}
        </p>
      </div>

      {/* STAGE 1: CONCEPT EXPLANATION */}
      {stage === 'explain' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-amber-700 tracking-wide uppercase">
                Step 1: Simple Explanation
              </span>
              <AudioNarration textToRead={explanation} language={language} speed={child.accessibility.ttsSpeed} />
            </div>

            <p className="text-base md:text-lg text-slate-800 leading-relaxed mb-6 font-medium">
              {explanation}
            </p>

            {/* Visual Interactive Stage */}
            <div className="my-6">
              {renderVisualModel(lesson.visualModel)}
            </div>

            {/* On-demand AI Analogy Box */}
            {aiAnalogy ? (
              <div className="p-4 bg-purple-50/80 rounded-xl border border-purple-200 mt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-900 mb-1">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Guruji’s Kid-Friendly Real-World Analogy</span>
                </div>
                <p className="text-sm text-purple-950">
                  {language === 'mr' ? aiAnalogy.textMr : aiAnalogy.textEn}
                </p>
              </div>
            ) : (
              <button
                onClick={fetchAiAnalogy}
                disabled={loadingAi}
                className="flex items-center gap-2 text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loadingAi ? 'Asking Guruji...' : 'Want another fun example from Guruji AI?'}</span>
              </button>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStage('worked_example')}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl shadow-xs transition"
            >
              <span>Next: See Worked Example</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: WORKED EXAMPLE */}
      {stage === 'worked_example' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-teal-700 tracking-wide uppercase">
                Step 2: Worked Example
              </span>
              <AudioNarration
                textToRead={
                  language === 'mr'
                    ? `${lesson.workedExample.problemMr}. ${lesson.workedExample.solutionMr}`
                    : `${lesson.workedExample.problemEn}. ${lesson.workedExample.solutionEn}`
                }
                language={language}
              />
            </div>

            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200/70 mb-6">
              <span className="block text-xs text-teal-800 font-semibold mb-1">Problem to Solve:</span>
              <h3 className="text-lg md:text-xl font-bold text-slate-900">
                {language === 'mr' ? lesson.workedExample.problemMr : lesson.workedExample.problemEn}
              </h3>
            </div>

            <div className="space-y-3 mb-6">
              {(language === 'mr' ? lesson.workedExample.stepsMr : lesson.workedExample.stepsEn)
                .slice(0, revealedSteps)
                .map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 font-medium flex items-start gap-3 animate-in fade-in-50 duration-200"
                  >
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
            </div>

            {revealedSteps < lesson.workedExample.stepsEn.length ? (
              <button
                onClick={() => setRevealedSteps(revealedSteps + 1)}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 px-3.5 py-2 rounded-lg border border-teal-200 transition"
              >
                👉 Show Next Step ({revealedSteps}/{lesson.workedExample.stepsEn.length})
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-semibold text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Final Solution:{' '}
                  {language === 'mr' ? lesson.workedExample.solutionMr : lesson.workedExample.solutionEn}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setStage('explain')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Back to Concept
            </button>
            <button
              onClick={() => setStage('comprehension')}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl shadow-xs transition"
            >
              <span>Next: Quick Comprehension Check</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: COMPREHENSION CHECK */}
      {stage === 'comprehension' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
            <span className="text-xs font-bold text-purple-700 tracking-wide uppercase block mb-3">
              Step 3: Comprehension Check
            </span>

            <h3 className="text-base md:text-lg font-bold text-slate-900 mb-4">
              {language === 'mr'
                ? lesson.comprehensionCheck.questionMr
                : lesson.comprehensionCheck.questionEn}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {(language === 'mr'
                ? lesson.comprehensionCheck.optionsMr
                : lesson.comprehensionCheck.optionsEn
              ).map((opt, idx) => {
                const isSelected = compAnswer === idx;
                const isCorrect = idx === lesson.comprehensionCheck.correctIndex;
                let btnStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';

                if (compSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                  } else if (isSelected) {
                    btnStyle = 'border-rose-500 bg-rose-50 text-rose-900';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-amber-500 bg-amber-50 text-amber-900 font-semibold';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleComprehensionSubmit(idx)}
                    disabled={compSubmitted}
                    className={`p-4 rounded-xl border text-left transition-all text-sm font-medium ${btnStyle}`}
                  >
                    <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {compSubmitted && (
              <div
                className={`p-4 rounded-xl text-sm font-medium ${
                  compAnswer === lesson.comprehensionCheck.correctIndex
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                }`}
              >
                <div className="font-bold mb-1">
                  {compAnswer === lesson.comprehensionCheck.correctIndex
                    ? '🎉 Spot on!'
                    : '💡 Let’s review together:'}
                </div>
                <p>
                  {language === 'mr'
                    ? lesson.comprehensionCheck.explanationMr
                    : lesson.comprehensionCheck.explanationEn}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setStage('worked_example')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Back to Worked Example
            </button>
            <button
              onClick={() => setStage('practice')}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl shadow-xs transition"
            >
              <span>Start Guided Practice</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 4: GUIDED PRACTICE WITH DETERMINISTIC GRADING & MULTI-TIER HINTS */}
      {stage === 'practice' && currentQ && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-amber-700 tracking-wide uppercase">
                Practice Question {currentQIndex + 1} of {questions.length}
              </span>
              <AudioNarration
                textToRead={language === 'mr' ? currentQ.promptMr : currentQ.promptEn}
                language={language}
              />
            </div>

            {/* Question Prompt */}
            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-4 leading-snug">
              {language === 'mr' ? currentQ.promptMr : currentQ.promptEn}
            </h3>

            {/* Visual model if present */}
            {currentQ.visualModel && (
              <div className="mb-6">
                {renderVisualModel(currentQ.visualModel)}
              </div>
            )}

            {/* Input choices based on question type */}
            {currentQ.optionsEn && currentQ.optionsEn.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {(language === 'mr' && currentQ.optionsMr ? currentQ.optionsMr : currentQ.optionsEn).map(
                  (opt, optIdx) => {
                    const isSelected = userAnswer === (currentQ.optionsEn?.[optIdx] || opt);
                    return (
                      <button
                        key={optIdx}
                        onClick={() => setUserAnswer(currentQ.optionsEn?.[optIdx] || opt)}
                        disabled={Boolean(gradingResult)}
                        className={`p-4 rounded-xl border text-left transition-all text-sm font-medium ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50 text-amber-950 font-semibold ring-2 ring-amber-200'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                        <span>{opt}</span>
                      </button>
                    );
                  }
                )}
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Your Answer:
                </label>
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={Boolean(gradingResult)}
                  placeholder="Type number or answer here..."
                  className="w-full max-w-xs px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg font-bold tabular-nums text-slate-900"
                />
              </div>
            )}

            {/* Hint Panel */}
            <div className="mb-6">
              {hintTier === 0 ? (
                <button
                  onClick={() => setHintTier(1)}
                  disabled={Boolean(gradingResult)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 transition"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>Need a Hint? (Guruji Clue 1)</span>
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span>Guruji Clue Level {hintTier} of 3</span>
                    </span>
                    {hintTier < 3 && !gradingResult && (
                      <button
                        onClick={() => setHintTier(hintTier + 1)}
                        className="text-xs font-semibold text-amber-800 underline hover:text-amber-950"
                      >
                        Give me another clue
                      </button>
                    )}
                  </div>
                  <p className="text-xs md:text-sm">
                    {hintTier === 1 && (language === 'mr' ? currentQ.hints.tier1NudgeMr : currentQ.hints.tier1NudgeEn)}
                    {hintTier === 2 && (language === 'mr' ? currentQ.hints.tier2GuidedMr : currentQ.hints.tier2GuidedEn)}
                    {hintTier >= 3 && (language === 'mr' ? currentQ.hints.tier3VisualMr : currentQ.hints.tier3VisualEn)}
                  </p>
                </div>
              )}
            </div>

            {/* Deterministic Grading Result & Misconception Feedback */}
            {gradingResult && (
              <div
                className={`p-4 rounded-xl mb-6 ${
                  gradingResult.isCorrect
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  {gradingResult.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm md:text-base">
                      {gradingResult.isCorrect
                        ? 'Superb! Correct!'
                        : 'Almost there! Let’s understand the step:'}
                    </h4>
                    <p className="text-xs md:text-sm mt-1 leading-relaxed">
                      {language === 'mr' ? gradingResult.feedbackMr : gradingResult.feedbackEn}
                    </p>

                    {gradingResult.detectedMisconception && (
                      <div className="mt-2 pt-2 border-t border-rose-200/60 text-xs text-rose-900">
                        <span className="font-bold">Helpful Tip: </span>
                        <span>
                          {language === 'mr'
                            ? gradingResult.detectedMisconception.remedyMr
                            : gradingResult.detectedMisconception.remedyEn}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                {hintTier > 0 ? `Assisted with Clue ${hintTier}` : 'Independent attempt'}
              </span>

              {!gradingResult ? (
                <button
                  onClick={handlePracticeSubmit}
                  disabled={submitting || !userAnswer.trim()}
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-xs transition"
                >
                  {submitting ? 'Checking...' : 'Check My Answer'}
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl shadow-xs transition"
                >
                  <span>
                    {currentQIndex + 1 < questions.length ? 'Next Question' : 'Complete Lesson!'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 5: CELEBRATION */}
      {stage === 'celebrate' && (
        <div className="bg-white rounded-3xl p-8 border border-amber-200 text-center shadow-md max-w-lg mx-auto">
          <div className="text-5xl mb-3">🌟</div>
          <h2 className="text-2xl font-bold text-slate-900 font-display mb-2">
            Fantastic Learning Adventure!
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            You completed the lesson on <span className="font-semibold text-teal-800">{skill.titleEn}</span>.
            Guruji recorded your progress and updated your learning journey!
          </p>

          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 mb-6 text-left text-xs space-y-1.5 text-slate-700">
            <div className="flex justify-between">
              <span>Skill Mastered:</span>
              <span className="font-bold text-amber-900">{skill.titleEn}</span>
            </div>
            <div className="flex justify-between">
              <span>Spaced Revision Scheduled:</span>
              <span className="font-bold text-teal-800">In 1 day (Tomorrow)</span>
            </div>
            <div className="flex justify-between">
              <span>Effort Milestone:</span>
              <span className="font-bold text-amber-900">+50 Discovery Points</span>
            </div>
          </div>

          <button
            onClick={onExit}
            className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-sm transition"
          >
            Back to Learning Journey
          </button>
        </div>
      )}
    </div>
  );
};
