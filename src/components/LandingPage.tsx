import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Repeat,
  Heart,
  BarChart3,
  BookOpen
} from 'lucide-react';
import { Language, ChildProfile } from '../types';

interface LandingPageProps {
  onEnterChild: () => void;
  onEnterParent: () => void;
  onEnterDiagnostic: () => void;
  activeChild: ChildProfile | null;
  language: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterChild,
  onEnterParent,
  onEnterDiagnostic,
  activeChild,
  language
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto pt-10 pb-6 px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Personalized AI Tutor for Children Aged 4–12</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-display text-balance leading-tight">
            Where children build <span className="text-teal-700">true mastery</span>, not just correct answers.
          </h1>

          <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Guruji AI is an adaptive, supportive learning platform. With visual models, deterministic math grading, tiered hints, and spaced revision, we guide every child to lifelong confidence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onEnterChild}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-sm transition transform hover:-translate-y-0.5"
            >
              <span>{activeChild ? `Start Learning with ${activeChild.name}` : 'Start Child Adventure'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onEnterDiagnostic}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 font-bold text-sm transition"
            >
              <span>Try Discovery Diagnostic</span>
            </button>

            <button
              onClick={onEnterParent}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm shadow-2xs transition"
            >
              Parent Portal
            </button>
          </div>
        </div>
      </section>

      {/* The 6-Stage Learning Loop Architecture */}
      <section className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/90 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-teal-800 tracking-wide uppercase block mb-1">
              The Educational Engine
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-display">
              A Structured Teaching Process, Not an Empty Chatbot
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Unlike generic conversational models that guess or flatter, Guruji AI follows a rigorous 6-step cycle grounded in pedagogical science.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                step: '01',
                title: 'Assess',
                desc: 'Friendly sample questions determine baseline understanding.'
              },
              {
                step: '02',
                title: 'Diagnose',
                desc: 'Identifies specific misconceptions (e.g. tens vs. ones reversals).'
              },
              {
                step: '03',
                title: 'Teach',
                desc: 'Simple language, physical analogies, and concrete visual models.'
              },
              {
                step: '04',
                title: 'Practise',
                desc: 'Guided challenges with tiered hints (nudge, step, visual).'
              },
              {
                step: '05',
                title: 'Reassess',
                desc: 'Measures independent success vs. hint-assisted attempts.'
              },
              {
                step: '06',
                title: 'Schedule Revision',
                desc: 'Automated spaced repetition intervals (1d, 3d, 7d) lock memory.'
              }
            ].map((st, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-teal-700 block mb-1">{st.step}</span>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{st.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Core Experience Pillars */}
      <section className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-xl mb-4 font-bold">
                🧒
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display mb-2">
                Child Experience
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                A warm, safe environment with audio narration, large touch targets, interactive Base-10 rods, ten-frames, and number lines that children navigate with joy.
              </p>
            </div>
            <button
              onClick={onEnterChild}
              className="mt-6 text-xs font-bold text-amber-900 flex items-center gap-1 hover:underline"
            >
              <span>Explore child experience</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 2 */}
          <div className="bg-teal-50/70 border border-teal-200/80 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-xl mb-4 font-bold">
                🤖
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display mb-2">
                Structured AI Tutor
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Deterministic arithmetic grading ensures calculation accuracy. AI crafts age-adapted real-world metaphors, tiered clues, and gentle explanations when children get stuck.
              </p>
            </div>
            <button
              onClick={onEnterDiagnostic}
              className="mt-6 text-xs font-bold text-teal-900 flex items-center gap-1 hover:underline"
            >
              <span>Try interactive questions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 3 */}
          <div className="bg-purple-50/70 border border-purple-200/80 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-xl mb-4 font-bold">
                👨‍👩‍👧
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display mb-2">
                Parent Trust Dashboard
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                No inflated scores or superficial praise. Real measured mastery ledgers, detected misconceptions, spaced revision calendars, and actionable offline home activities.
              </p>
            </div>
            <button
              onClick={onEnterParent}
              className="mt-6 text-xs font-bold text-purple-900 flex items-center gap-1 hover:underline"
            >
              <span>View parent reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Safety & Pedagogical Pledge */}
      <section className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-2xs text-center space-y-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-display">
            Our Educational & Privacy Commitment
          </h3>
          <p className="text-xs md:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We never label a child as "weak" or "incapable". Every learning challenge is broken down into small, achievable steps. Your family data is never used for commercial advertising, and you can delete all child records anytime with a single click.
          </p>
        </div>
      </section>
    </div>
  );
};
