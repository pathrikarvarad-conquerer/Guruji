import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ChildDashboard } from './components/child/ChildDashboard';
import { LessonPlayer } from './components/child/LessonPlayer';
import { DiagnosticAssessment } from './components/child/DiagnosticAssessment';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { ParentResourceCentre } from './components/parent/ParentResourceCentre';
import { ParentSettings } from './components/parent/ParentSettings';
import { ChildProfile, ParentAccount, Language } from './types';

export function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [parent, setParent] = useState<ParentAccount | null>(null);
  const [childrenList, setChildrenList] = useState<ChildProfile[]>([]);
  const [activeChild, setActiveChild] = useState<ChildProfile | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [activeLessonSkillId, setActiveLessonSkillId] = useState<string>('skill_tens_and_ones');
  const [loading, setLoading] = useState(true);

  // Initial data bootstrap from server
  const loadInitialData = async () => {
    try {
      setLoading(true);
      // Fetch demo parent dashboard
      const res = await fetch('/api/parents/parent_demo_01/dashboard');
      if (res.ok) {
        const data = await res.json();
        setParent(data.parent);
        const children = data.childrenReports?.map((cr: any) => cr.child) || [];
        setChildrenList(children);
        if (children.length > 0) {
          setActiveChild(children[0]);
          setLanguage(children[0].language || 'en');
        }
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleToggleLanguage = () => {
    const nextLang = language === 'en' ? 'mr' : 'en';
    setLanguage(nextLang);
    if (activeChild) {
      // Persist language choice
      fetch(`/api/children/${activeChild.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: nextLang })
      });
      setActiveChild({ ...activeChild, language: nextLang });
    }
  };

  const handleStartLesson = (skillId: string) => {
    setActiveLessonSkillId(skillId);
    setCurrentView('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChildCreated = async () => {
    await loadInitialData();
    setCurrentView('parent_dashboard');
  };

  const handleChildDeleted = async () => {
    await loadInitialData();
  };

  const handleAccountDeleted = () => {
    setParent(null);
    setChildrenList([]);
    setActiveChild(null);
    setCurrentView('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl mx-auto shadow-sm animate-pulse">
            ग
          </div>
          <p className="text-sm font-semibold text-slate-700">Loading Guruji AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 flex flex-col font-sans selection:bg-amber-200">
      {/* Universal Top Navigation conforming to Top Bar Contract */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeChild={activeChild}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onEnterChild={() => {
              setCurrentView('child_dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onEnterParent={() => {
              setCurrentView('parent_dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onEnterDiagnostic={() => {
              setCurrentView('diagnostic');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            activeChild={activeChild}
            language={language}
          />
        )}

        {currentView === 'child_dashboard' && activeChild && (
          <ChildDashboard
            child={activeChild}
            language={language}
            onStartLesson={handleStartLesson}
            onStartDiagnostic={() => {
              setCurrentView('diagnostic');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'lesson' && activeChild && (
          <LessonPlayer
            skillId={activeLessonSkillId}
            child={activeChild}
            language={language}
            onExit={() => {
              setCurrentView('child_dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLessonComplete={() => {
              loadInitialData();
            }}
          />
        )}

        {currentView === 'diagnostic' && activeChild && (
          <DiagnosticAssessment
            child={activeChild}
            language={language}
            onComplete={() => {
              loadInitialData();
              setCurrentView('child_dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'parent_dashboard' && activeChild && (
          <ParentDashboard
            activeChild={activeChild}
            language={language}
            onSelectSkill={(skillId) => handleStartLesson(skillId)}
          />
        )}

        {currentView === 'resource_centre' && parent && (
          <ParentResourceCentre parentId={parent.id} language={language} />
        )}

        {currentView === 'settings' && parent && (
          <ParentSettings
            parent={parent}
            childrenList={childrenList}
            activeChild={activeChild}
            onSelectChild={(id) => {
              const ch = childrenList.find((c) => c.id === id);
              if (ch) {
                setActiveChild(ch);
                setLanguage(ch.language);
              }
            }}
            onChildCreated={handleChildCreated}
            onChildDeleted={handleChildDeleted}
            onAccountDeleted={handleAccountDeleted}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/60 py-6 px-4 md:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Guruji AI</span>
            <span>·</span>
            <span>Personalized Learning for Children Aged 4–12</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Pedagogical Standard: 6-Stage Adaptive Loop</span>
            <span>·</span>
            <span>Deterministic Math Grading</span>
            <span>·</span>
            <span>English & मराठी Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
