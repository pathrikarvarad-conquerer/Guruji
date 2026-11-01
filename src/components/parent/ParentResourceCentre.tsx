import React, { useState, useEffect } from 'react';
import { UploadedResource, VideoResource, Language } from '../../types';
import { VETTED_VIDEOS, SKILLS } from '../../../server/curriculumData';
import {
  Upload,
  FileText,
  Trash2,
  CheckCircle,
  ExternalLink,
  Film,
  Sparkles,
  BookOpen,
  AlertCircle
} from 'lucide-react';

interface ParentResourceCentreProps {
  parentId: string;
  language: Language;
}

export const ParentResourceCentre: React.FC<ParentResourceCentreProps> = ({
  parentId,
  language
}) => {
  const [resources, setResources] = useState<UploadedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoResource | null>(null);

  // Upload Form states
  const [docTitle, setDocTitle] = useState('');
  const [docTextSnippet, setDocTextSnippet] = useState('');
  const [pageCount, setPageCount] = useState(1);
  const [uploadError, setUploadError] = useState('');

  const loadResources = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/resources/${parentId}`);
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, [parentId]);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docTextSnippet.trim()) {
      setUploadError('Please provide a document title and notes or text snippet.');
      return;
    }

    try {
      setUploading(true);
      setUploadError('');

      const res = await fetch('/api/resources/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentId,
          title: docTitle.trim(),
          fileName: `${docTitle.trim().toLowerCase().replace(/\s+/g, '_')}.pdf`,
          fileSize: 204800,
          textSnippet: docTextSnippet.trim(),
          pageCount: Number(pageCount || 1)
        })
      });

      if (res.ok) {
        setDocTitle('');
        setDocTextSnippet('');
        setPageCount(1);
        await loadResources();
      } else {
        setUploadError('Upload failed. Please check the document content.');
      }
    } catch {
      setUploadError('Network error uploading document.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this learning document?')) return;
    try {
      const res = await fetch(`/api/resources/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setResources(resources.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete resource:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-teal-800 tracking-wide uppercase">
          Parent Learning Materials & Curriculum Alignment
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-display mt-1">
          Resource Centre & Syllabus Grounding
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Upload school worksheets, notes, or chapter pages. Guruji extracts key topics, maps them to curriculum skills, and grounds tutor explanations in your child’s actual school materials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form Column */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-900 text-base mb-1">
              <Upload className="w-5 h-5 text-teal-700" />
              <span>Upload Learning Document / Notes</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Supports school textbook excerpts, homework sheets, or PDF syllabus notes.
            </p>

            {uploadError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document / Chapter Title:
                </label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. CBSE Maths Chapter 2 - Tens and Ones"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Page Count:
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={pageCount}
                  onChange={(e) => setPageCount(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Text Snippet or Chapter Summary:
                </label>
                <textarea
                  rows={4}
                  value={docTextSnippet}
                  onChange={(e) => setDocTextSnippet(e.target.value)}
                  placeholder="Paste excerpt from textbook, chapter questions, or worksheet problems..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                {uploading ? 'Processing with AI...' : 'Analyze & Map to Curriculum'}
              </button>
            </form>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
            🔒 Documents are stored privately and used exclusively for your child’s tutoring.
          </div>
        </div>

        {/* Uploaded Documents List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-slate-900 text-base">
            Active School Resources ({resources.length})
          </h2>

          {resources.length === 0 ? (
            <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
              No school documents uploaded yet. Add a chapter excerpt to ground Guruji’s lessons in your child's actual textbook!
            </div>
          ) : (
            resources.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{res.title}</h3>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{res.fileName}</span>
                        <span>·</span>
                        <span>{res.pageCount} pages</span>
                        <span>·</span>
                        <span>{new Date(res.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteResource(res.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Extracted Text Snippet */}
                {res.extractedTextSnippet && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-mono">
                    "{res.extractedTextSnippet.slice(0, 160)}..."
                  </div>
                )}

                {/* Mapped Topics */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Extracted Topics & Curriculum Alignment:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {res.mappedTopics.map((top, idx) => {
                      const matchedSkill = SKILLS.find((s) => s.id === top.matchedSkillId);
                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-teal-200 bg-teal-50/50 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-800 block">
                              {top.topicName}
                            </span>
                            <span className="text-teal-800 font-medium text-[11px]">
                              Mapped: {matchedSkill ? matchedSkill.titleEn : 'General Math'}
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-teal-900 tabular-nums bg-white px-2 py-0.5 rounded-md border border-teal-200">
                            {Math.round(top.relevanceScore * 100)}% Match
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Curated Educational Videos Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-base mb-1">
          <Film className="w-5 h-5 text-rose-600" />
          <span>Curated Educational Videos (Vetted Ad-Free Catalogue)</span>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          High-quality visual explanations from trusted educators like Numberblocks, Khan Academy Kids, and Math Antics.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VETTED_VIDEOS.map((vid) => (
            <div
              key={vid.id}
              className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-between hover:border-slate-300 transition"
            >
              <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                <iframe
                  src={vid.embedUrl}
                  title={vid.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-semibold text-rose-700">{vid.provider}</span>
                    <span>{vid.duration}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{vid.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{vid.description}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/80 text-[11px] text-slate-500">
                  Ages: {vid.ageMin}–{vid.ageMax} yrs
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
