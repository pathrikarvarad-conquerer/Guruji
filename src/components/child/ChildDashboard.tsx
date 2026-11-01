import React, { useState, useEffect } from 'react';
import { ChildProfile, Language, SkillProgress, RevisionSchedule } from '../../types';
import { TOPICS, SKILLS } from '../../../server/curriculumData';
import {
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle,
  Clock,
  BookOpen,
  Award,
  ChevronRight,
  Flame,
  Star
} from 'lucide-react';

interface ChildDashboardProps {
  child: ChildProfile;
  language: Language;
  onStartLesson: (skillId: string) => void;
  onStartDiagnostic: () => void;
}

export const ChildDashboard: React.FC<ChildDashboardProps> = ({
  child,
  language,
  onStartLesson,
  onStartDiagnostic
}) => {
  const [progressList, setProgressList] = useState<SkillProgress[]>([]);
  const [revisions, setRevisions] = useState<RevisionSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/learning/progress/${child.id}`);
        if (res.ok) {
          const data = await res.json();
          setProgressList(data.progressList || []);
          setRevisions(data.revisions || []);
        }
      } catch (err) {
        console.error('Failed to load child progress:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [child.id]);

  const dueRevision = revisions.find((r) => r.status === 'pending');

  const greeting =
    language === 'mr'
      ? `नमस्ते ${child.name}! आज गणिताची कोणती नवी गोष्ट शिकायची?`
      : `Namaste ${child.name}! Ready for today's math adventure?`;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-teal-50 to-emerald-50 rounded-3xl p-6 md:p-8 border border-amber-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-3xl flex items-center justify-center shadow-xs select-none">
            {child.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
              <span>{child.grade}</span>
              <span>·</span>
              <span>{child.curriculum.toUpperCase()}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-display">
              {greeting}
            </h1>
          </div>
        </div>

        {/* Quick Discovery or Resume Button */}
        {!child.diagnosticCompleted ? (
          <button
            onClick={onStartDiagnostic}
            className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-2xl shadow-xs transition shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Take Discovery Diagnostic</span>
          </button>
        ) : (
          <button
            onClick={() => onStartLesson('skill_tens_and_ones')}
            className="flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-2xl shadow-xs transition shrink-0"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Continue Daily Quest</span>
          </button>
        )}
      </div>

      {/* Daily Mission Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Star className="w-5 h-5 fill-amber-500" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                {language === 'mr' ? "आजची गणिताची मोहीम" : "Today's Math Mission"}
              </h2>
              <p className="text-xs text-slate-500">
                A bite-sized 10-minute journey to build lasting mastery
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Active Quest
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Mission Step 1: Lesson */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide block mb-1">
                Step 1 · Visual Lesson
              </span>
              <h3 className="font-bold text-slate-800 text-sm mb-1">Tens & Ones Workshop</h3>
              <p className="text-xs text-slate-600">
                Explore base-10 rods and single unit cubes with visual models.
              </p>
            </div>
            <button
              onClick={() => onStartLesson('skill_tens_and_ones')}
              className="mt-4 flex items-center justify-between w-full text-xs font-bold text-teal-800 hover:text-teal-950 pt-2 border-t border-slate-200/80"
            >
              <span>Start Micro-Lesson</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mission Step 2: Practice */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wide block mb-1">
                Step 2 · Adaptive Practice
              </span>
              <h3 className="font-bold text-slate-800 text-sm mb-1">3 Guided Questions</h3>
              <p className="text-xs text-slate-600">
                Solve with Guruji clues and immediate feedback.
              </p>
            </div>
            <button
              onClick={() => onStartLesson('skill_tens_and_ones')}
              className="mt-4 flex items-center justify-between w-full text-xs font-bold text-teal-800 hover:text-teal-950 pt-2 border-t border-slate-200/80"
            >
              <span>Practice Questions</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mission Step 3: Spaced Revision */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wide block mb-1">
                Step 3 · Spaced Memory Refresh
              </span>
              <h3 className="font-bold text-slate-800 text-sm mb-1">
                {dueRevision ? 'Due Review' : 'Counting Warmup'}
              </h3>
              <p className="text-xs text-slate-600">
                2 quick retention check questions to lock knowledge into memory.
              </p>
            </div>
            <button
              onClick={() => onStartLesson(dueRevision?.skillId || 'skill_count_objects')}
              className="mt-4 flex items-center justify-between w-full text-xs font-bold text-teal-800 hover:text-teal-950 pt-2 border-t border-slate-200/80"
            >
              <span>Review Now</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Learning Adventure Trail / Map */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              {language === 'mr' ? "तुमचा शिकण्याचा प्रवास" : "Your Math Adventure Trail"}
            </h2>
            <p className="text-xs text-slate-500">
              Each milestone represents a verified skill demonstrated with understanding
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600">
            {SKILLS.length} Skills Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SKILLS.map((skill, index) => {
            const prog = progressList.find((p) => p.skillId === skill.id);
            const state = prog?.state || 'learning';
            const isMastered = state === 'provisional_mastery' || state === 'retained';

            return (
              <div
                key={skill.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  isMastered
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : state === 'practising'
                    ? 'bg-amber-50/60 border-amber-200 ring-1 ring-amber-200'
                    : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">
                      Stage {index + 1} · {skill.code}
                    </span>
                    {isMastered ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        <span>Mastered</span>
                      </span>
                    ) : state === 'practising' ? (
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        Practising
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-500">Ready</span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1.5">
                    {language === 'mr' ? skill.titleMr : skill.titleEn}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {language === 'mr' ? skill.descriptionMr : skill.descriptionEn}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    {prog ? `${prog.consecutiveCorrect}/3 Independent` : 'Not started'}
                  </span>
                  <button
                    onClick={() => onStartLesson(skill.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 text-xs font-bold transition shadow-2xs"
                  >
                    {isMastered ? 'Review Lesson' : 'Open Lesson'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
