import React, { useState } from 'react';
import { ChildProfile, ParentAccount, Language, CurriculumType } from '../../types';
import {
  User,
  Plus,
  Trash2,
  Shield,
  Volume2,
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ParentSettingsProps {
  parent: ParentAccount;
  childrenList: ChildProfile[];
  activeChild: ChildProfile | null;
  onSelectChild: (childId: string) => void;
  onChildCreated: () => void;
  onChildDeleted: () => void;
  onAccountDeleted: () => void;
}

export const ParentSettings: React.FC<ParentSettingsProps> = ({
  parent,
  childrenList,
  activeChild,
  onSelectChild,
  onChildCreated,
  onChildDeleted,
  onAccountDeleted
}) => {
  // New child modal form state
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState(7);
  const [newChildGrade, setNewChildGrade] = useState('Grade 2');
  const [newChildLanguage, setNewChildLanguage] = useState<Language>('en');
  const [newChildCurriculum, setNewChildCurriculum] = useState<CurriculumType>('cbse');
  const [newChildAvatar, setNewChildAvatar] = useState('🦊');

  // Accessibility for active child
  const [ttsSpeed, setTtsSpeed] = useState(activeChild?.accessibility.ttsSpeed || 1.0);
  const [soundEffects, setSoundEffects] = useState(
    activeChild?.accessibility.soundEffects ?? true
  );

  const [savingAccess, setSavingAccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;

    try {
      const res = await fetch('/api/children', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentId: parent.id,
          name: newChildName.trim(),
          age: Number(newChildAge),
          grade: newChildGrade,
          language: newChildLanguage,
          curriculum: newChildCurriculum,
          avatar: newChildAvatar,
          subjects: ['Mathematics']
        })
      });

      if (res.ok) {
        setShowAddChild(false);
        setNewChildName('');
        onChildCreated();
      }
    } catch (err) {
      console.error('Failed to create child:', err);
    }
  };

  const handleDeleteChild = async (childId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}'s profile and all learning records?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/children/${childId}`, { method: 'DELETE' });
      if (res.ok) {
        onChildDeleted();
      }
    } catch (err) {
      console.error('Failed to delete child:', err);
    }
  };

  const handleSaveAccessibility = async () => {
    if (!activeChild) return;
    try {
      setSavingAccess(true);
      const res = await fetch(`/api/children/${activeChild.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessibility: {
            ...activeChild.accessibility,
            ttsSpeed,
            soundEffects
          }
        })
      });
      if (res.ok) {
        setSuccessMsg('Accessibility preferences saved!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Failed to save accessibility:', err);
    } finally {
      setSavingAccess(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        'WARNING: This will permanently wipe your parent account, all child profiles, document uploads, and learning records. This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      const res = await fetch('/api/auth/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId: parent.id })
      });
      if (res.ok) {
        onAccountDeleted();
      }
    } catch (err) {
      console.error('Failed to delete account:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-6 space-y-8">
      {/* Title */}
      <div>
        <span className="text-xs font-bold text-teal-800 tracking-wide uppercase">
          Parent Account & Privacy Controls
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-display mt-1">
          Settings & Child Profiles
        </h1>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Child Profiles Management */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Child Profiles in Family ({childrenList.length})
            </h2>
            <p className="text-xs text-slate-500">
              Select who is learning or add siblings with custom curricula
            </p>
          </div>
          <button
            onClick={() => setShowAddChild(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Child Profile</span>
          </button>
        </div>

        {/* Child Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {childrenList.map((ch) => {
            const isCurrent = activeChild?.id === ch.id;
            return (
              <div
                key={ch.id}
                className={`p-5 rounded-2xl border transition-all flex items-start justify-between ${
                  isCurrent
                    ? 'border-teal-500 bg-teal-50/40 ring-2 ring-teal-200'
                    : 'border-slate-200 bg-slate-50 hover:bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl select-none">{ch.avatar}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{ch.name}</h3>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Age {ch.age} · {ch.grade} · {ch.curriculum.toUpperCase()}
                    </div>
                    <div className="text-xs text-slate-600 mt-1 font-medium">
                      Language: {ch.language === 'mr' ? 'मराठी' : 'English'}
                    </div>

                    {!isCurrent && (
                      <button
                        onClick={() => onSelectChild(ch.id)}
                        className="mt-3 text-xs font-bold text-teal-800 hover:underline"
                      >
                        Switch to this child
                      </button>
                    )}
                  </div>
                </div>

                {childrenList.length > 1 && (
                  <button
                    onClick={() => handleDeleteChild(ch.id, ch.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title="Delete child profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal: Add Child */}
        {showAddChild && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Create New Child Profile
              </h3>

              <form onSubmit={handleCreateChild} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Child's Name:</label>
                  <input
                    type="text"
                    required
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder="e.g. Diya"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Age:</label>
                    <input
                      type="number"
                      min="4"
                      max="12"
                      value={newChildAge}
                      onChange={(e) => setNewChildAge(parseInt(e.target.value, 10))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Grade:</label>
                    <select
                      value={newChildGrade}
                      onChange={(e) => setNewChildGrade(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                    >
                      <option value="Kindergarten">Kindergarten</option>
                      <option value="Grade 1">Grade 1</option>
                      <option value="Grade 2">Grade 2</option>
                      <option value="Grade 3">Grade 3</option>
                      <option value="Grade 4">Grade 4</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Language:</label>
                    <select
                      value={newChildLanguage}
                      onChange={(e) => setNewChildLanguage(e.target.value as Language)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                    >
                      <option value="en">English</option>
                      <option value="mr">मराठी (Marathi)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Curriculum:</label>
                    <select
                      value={newChildCurriculum}
                      onChange={(e) => setNewChildCurriculum(e.target.value as CurriculumType)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                    >
                      <option value="cbse">CBSE</option>
                      <option value="icse">ICSE</option>
                      <option value="state">State Board</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Choose Mascot Avatar:</label>
                  <div className="flex gap-2">
                    {['🦊', '🦁', '🐼', '🐯', '🐬', '🦉'].map((av) => (
                      <button
                        type="button"
                        key={av}
                        onClick={() => setNewChildAvatar(av)}
                        className={`text-2xl p-2 rounded-xl border transition ${
                          newChildAvatar === av
                            ? 'border-teal-600 bg-teal-50 scale-110'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddChild(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl"
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Accessibility Preferences for Active Child */}
      {activeChild && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base mb-1">
            <Volume2 className="w-5 h-5 text-teal-700" />
            <span>Audio & Accessibility Preferences for {activeChild.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Guruji Narration Speech Speed ({ttsSpeed}x):
              </label>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.1"
                value={ttsSpeed}
                onChange={(e) => setTtsSpeed(parseFloat(e.target.value))}
                className="w-full accent-teal-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>0.8x (Gentle)</span>
                <span>1.0x (Normal)</span>
                <span>1.2x (Brisk)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <span className="font-semibold text-slate-800 text-xs block">
                  Auditory Celebration Chimes
                </span>
                <span className="text-[11px] text-slate-500">
                  Play gentle tones on correct answers
                </span>
              </div>
              <input
                type="checkbox"
                checked={soundEffects}
                onChange={(e) => setSoundEffects(e.target.checked)}
                className="w-4 h-4 accent-teal-600 rounded"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveAccessibility}
              disabled={savingAccess}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition"
            >
              {savingAccess ? 'Saving...' : 'Save Accessibility Settings'}
            </button>
          </div>
        </div>
      )}

      {/* Privacy and Account Deletion Flow (Section 14 & 15) */}
      <div className="bg-rose-50/60 rounded-3xl p-6 md:p-8 border border-rose-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 font-bold text-rose-950 text-base">
          <Shield className="w-5 h-5 text-rose-600" />
          <span>Child Privacy, Data Minimization & Account Wipe</span>
        </div>
        <p className="text-xs text-rose-900 leading-relaxed max-w-2xl">
          Guruji strictly adheres to child data safety. We do not sell data, solicit unnecessary personal information, or show commercial advertisements. You can permanently wipe your account and all child records at any time.
        </p>

        <div className="pt-2">
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Permanently Delete Parent Account & All Child Data
          </button>
        </div>
      </div>
    </div>
  );
};
