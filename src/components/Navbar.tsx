import React from 'react';
import { ChildProfile, Language } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  activeChild: ChildProfile | null;
  language: Language;
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeChild,
  language,
  onToggleLanguage
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-amber-200/60 sticky top-0 z-50 px-4 md:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Zone 1: Wordmark / Brand element */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 text-left group shrink-0 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            ग
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 font-display whitespace-nowrap">
            Guruji AI
          </span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('child_dashboard')}
            className={`whitespace-nowrap transition-colors py-1 ${
              currentView === 'child_dashboard' || currentView === 'lesson'
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                : 'hover:text-slate-900'
            }`}
          >
            {language === 'mr' ? 'शिकण्याची मोहीम' : 'Child Adventure'}
          </button>

          <button
            onClick={() => onNavigate('diagnostic')}
            className={`whitespace-nowrap transition-colors py-1 ${
              currentView === 'diagnostic'
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                : 'hover:text-slate-900'
            }`}
          >
            {language === 'mr' ? 'चाचणी शोध' : 'Discovery Diagnostic'}
          </button>

          <button
            onClick={() => onNavigate('parent_dashboard')}
            className={`whitespace-nowrap transition-colors py-1 ${
              currentView === 'parent_dashboard'
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                : 'hover:text-slate-900'
            }`}
          >
            {language === 'mr' ? 'पालक डॅशबोर्ड' : 'Parent Dashboard'}
          </button>

          <button
            onClick={() => onNavigate('resource_centre')}
            className={`whitespace-nowrap transition-colors py-1 ${
              currentView === 'resource_centre'
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                : 'hover:text-slate-900'
            }`}
          >
            {language === 'mr' ? 'अभ्यास साहित्य' : 'Resource Centre'}
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className={`whitespace-nowrap transition-colors py-1 ${
              currentView === 'settings'
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                : 'hover:text-slate-900'
            }`}
          >
            {language === 'mr' ? 'सेटिंग्ज' : 'Settings'}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Language Toggle */}
          <button
            onClick={onToggleLanguage}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition whitespace-nowrap"
            title="Toggle English / मराठी"
          >
            {language === 'en' ? 'मराठी' : 'English'}
          </button>

          {/* Child Mode Profile Pill or Mode Switcher */}
          {activeChild ? (
            <button
              onClick={() =>
                onNavigate(
                  currentView.startsWith('parent') || currentView === 'settings'
                    ? 'child_dashboard'
                    : 'parent_dashboard'
                )
              }
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-semibold hover:bg-amber-200/80 transition shadow-2xs whitespace-nowrap"
            >
              <span className="text-base leading-none">{activeChild.avatar}</span>
              <span className="truncate max-w-[90px]">{activeChild.name}</span>
              <span className="text-[10px] text-amber-800 font-normal">
                ({currentView.startsWith('parent') ? 'To Child' : 'To Parent'})
              </span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('parent_dashboard')}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition shadow-xs whitespace-nowrap"
            >
              Parent Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
