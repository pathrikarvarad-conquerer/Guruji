import React, { useState, useEffect } from 'react';
import { ChildProfile, Language } from '../../types';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Sparkles,
  BookOpen,
  TrendingUp,
  HelpCircle,
  Home
} from 'lucide-react';

interface ParentDashboardProps {
  activeChild: ChildProfile;
  language: Language;
  onSelectSkill: (skillId: string) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  activeChild,
  language,
  onSelectSkill
}) => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);
        const res = await fetch(`/api/parents/${activeChild.parentId}/dashboard`);
        if (res.ok) {
          const data = await res.json();
          const childReport = data.childrenReports?.find(
            (cr: any) => cr.child.id === activeChild.id
          );
          setReportData(childReport || null);
        }
      } catch (err) {
        console.error('Failed to load parent dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [activeChild.id, activeChild.parentId]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-16 px-4 text-center">
        <div className="w-10 h-10 rounded-full border-4 border-teal-600 border-t-transparent animate-spin mx-auto mb-3"></div>
        <p className="text-slate-600 font-medium text-sm">Gathering genuine learning analytics...</p>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-3xl p-8 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-2">No learning data recorded yet</h2>
          <p className="text-sm text-slate-600">
            Have {activeChild.name} complete a lesson or the Discovery Diagnostic to start tracking mastery!
          </p>
        </div>
      </div>
    );
  }

  const { metrics, progress, misconceptions, revisions, recentResponses, homeActivities } = reportData;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-8 space-y-8">
      {/* Title & Trust principle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold text-teal-800 tracking-wide uppercase">
            Parent Insights & Learning Integrity Portal
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-display mt-1">
            Learning Progress for {activeChild.name}
          </h1>
        </div>
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 max-w-sm text-xs text-amber-950">
          <span className="font-bold">Guiding Principle: </span>
          Guruji tracks genuine conceptual understanding, not just screen time or memorized answers.
        </div>
      </div>

      {/* Primary KPI Grid (Real Measured Data) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Learning Sessions</span>
            <BookOpen className="w-4 h-4 text-teal-600" />
          </div>
          <span className="text-2xl font-bold text-slate-900 tabular-nums">
            {metrics.totalSessions}
          </span>
          <span className="block text-[11px] text-slate-500 mt-1">
            Completed on this device
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Active Study Time</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-bold text-slate-900 tabular-nums">
            {metrics.totalTimeMinutes} <span className="text-sm font-normal text-slate-600">min</span>
          </span>
          <span className="block text-[11px] text-slate-500 mt-1">
            Time spent solving & reading
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Independent Success</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold text-slate-900 tabular-nums">
            {metrics.independentCorrect}{' '}
            <span className="text-sm font-normal text-slate-500">/ {metrics.totalQuestions}</span>
          </span>
          <span className="block text-[11px] text-emerald-700 font-medium mt-1">
            {metrics.assistedCorrect} hint-assisted answers
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Skills Status</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {metrics.masteredSkillsCount}
            </span>
            <span className="text-xs text-slate-500">Mastered · {metrics.practisingSkillsCount} Practising</span>
          </div>
          <span className="block text-[11px] text-slate-500 mt-1">
            {metrics.learningSkillsCount} new skills ready
          </span>
        </div>
      </div>

      {/* Skill States Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Detailed Skill Mastery Ledger
              </h2>
              <p className="text-xs text-slate-500">
                Skills advance through structured stages based on independent evidence
              </p>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              3 consecutive needed for mastery
            </span>
          </div>

          <div className="space-y-3">
            {progress.map((item: any) => {
              const stateBadge = {
                retained: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                provisional_mastery: 'bg-teal-100 text-teal-800 border-teal-300',
                practising: 'bg-amber-100 text-amber-800 border-amber-300',
                learning: 'bg-slate-100 text-slate-700 border-slate-200'
              }[item.state as 'learning' | 'practising' | 'provisional_mastery' | 'retained'];

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 text-sm">
                        {item.skillId.replace('skill_', '').replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${stateBadge}`}
                      >
                        {item.state.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>Total attempts: <b className="text-slate-700">{item.totalAttempts}</b></span>
                      <span>Independent: <b className="text-emerald-700">{item.independentCorrect}</b></span>
                      <span>Streak: <b className="text-amber-800">{item.consecutiveCorrect} / 3</b></span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectSkill(item.skillId)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-700 transition shadow-2xs self-start md:self-auto"
                  >
                    View Lesson Plan
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Spaced Revision Column */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base mb-1">
              <Calendar className="w-5 h-5 text-teal-700" />
              <span>Spaced Revision Planner</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Regular spaced reviews ensure skills enter permanent long-term memory.
            </p>

            <div className="space-y-3">
              {revisions.length === 0 ? (
                <div className="text-xs text-slate-400 italic text-center py-6">
                  No revisions due right now. Complete more lessons to schedule spaced reviews!
                </div>
              ) : (
                revisions.map((rev: any) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 block">
                        {rev.skillId.replace('skill_', '').replace(/_/g, ' ')}
                      </span>
                      <span className="text-slate-500">
                        Due Date: <b className="text-teal-900">{rev.dueDate}</b> (Interval: {rev.intervalDays}d)
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rev.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rev.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
            💡 Retention intervals: Day 1, Day 3, and Day 7 after first mastery.
          </div>
        </div>
      </div>

      {/* Observed Misconceptions & Supportive Guidance */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base mb-1">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <span>Observed Misconceptions & Supportive Remediation</span>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Mistakes are natural signposts in the learning journey. Here is how you can support at home without pressure.
        </p>

        {misconceptions.length === 0 ? (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-600">
            No repeated misconceptions detected. {activeChild.name} is progressing smoothly!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {misconceptions.map((misc: any) => (
              <div
                key={misc.id}
                className="p-5 rounded-2xl border border-amber-200 bg-amber-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-2">
                    <span className="capitalize">{misc.misconceptionKey.replace(/_/g, ' ')}</span>
                    <span className="bg-amber-200/80 px-2 py-0.5 rounded-full text-[10px]">
                      Seen {misc.frequency} time{misc.frequency > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mb-3">{misc.description}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-amber-200/70 text-xs text-slate-800">
                  <span className="font-bold text-amber-900 block mb-0.5">Parent Home Tip:</span>
                  <span>{misc.remedySuggested}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Practical Home Learning Activities */}
      <div className="bg-gradient-to-r from-teal-50/80 to-amber-50/80 rounded-3xl p-6 md:p-8 border border-teal-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base mb-1">
          <Home className="w-5 h-5 text-teal-700" />
          <span>Recommended Hands-on Home Activities (Offline Learning)</span>
        </div>
        <p className="text-xs text-slate-600 mb-6">
          Reinforce math intuition away from screens with everyday household objects.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {homeActivities.map((act: any, idx: number) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-teal-100 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-sm">{act.title}</span>
                  <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                    {act.timeMinutes} mins
                  </span>
                </div>
                <span className="text-xs font-semibold text-amber-800 block mb-2">
                  Target Skill: {act.skillTarget}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">{act.instructions}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
