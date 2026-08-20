'use client';

import React, { useState } from 'react';
import {
  X,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  Trash2,
  ExternalLink,
  Plus,
  CheckCircle2,
  Clock,
  User,
  Mail,
  Globe,
  Sparkles,
  Flame,
  CheckSquare,
  Square,
  Star,
  Check,
  Phone,
} from 'lucide-react';
import { JobApplication, ApplicationStatus, InterviewRound, ResumeItem } from '@/lib/types';
import { PIPELINE_COLUMNS } from '@/lib/sample-data';

interface JobDetailsModalProps {
  job: JobApplication | null;
  resumes: ResumeItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedJob: JobApplication) => void;
  onDelete: (id: string) => void;
  onOpenATSMatcher?: (job: JobApplication) => void;
}

export function JobDetailsModal({
  job,
  resumes,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onOpenATSMatcher,
}: JobDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'interviews' | 'recruiter' | 'checklist' | 'notes'>('overview');
  const [newChecklistText, setNewChecklistText] = useState('');
  const [newRoundTitle, setNewRoundTitle] = useState('');

  if (!isOpen || !job) return null;

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    const updated: JobApplication = {
      ...job,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    if (newStatus === 'applied' && !job.appliedDate) {
      updated.appliedDate = new Date().toISOString();
    }
    onUpdate(updated);
  };

  const handlePriorityChange = (priority: 'high' | 'medium' | 'low') => {
    onUpdate({ ...job, priority });
  };

  const handleResumeSelect = (resumeId: string) => {
    const selected = resumes.find((r) => r.id === resumeId);
    onUpdate({
      ...job,
      resumeId,
      resumeVersionName: selected ? selected.versionTag : undefined,
    });
  };

  // Interview Rounds Management
  const handleAddRound = () => {
    if (!newRoundTitle.trim()) return;
    const rounds = job.interviewRounds || [];
    const newRound: InterviewRound = {
      id: `r-${Date.now()}`,
      jobId: job.id,
      roundNumber: rounds.length + 1,
      title: newRoundTitle.trim(),
      status: 'scheduled',
      format: 'video',
      dateTime: new Date(Date.now() + 86400000 * 2).toISOString(),
      createdAt: new Date().toISOString(),
    };
    onUpdate({
      ...job,
      interviewRounds: [...rounds, newRound],
    });
    setNewRoundTitle('');
  };

  const handleUpdateRound = (roundId: string, updates: Partial<InterviewRound>) => {
    const rounds = (job.interviewRounds || []).map((r) =>
      r.id === roundId ? { ...r, ...updates } : r
    );
    onUpdate({
      ...job,
      interviewRounds: rounds,
    });
  };

  const handleDeleteRound = (roundId: string) => {
    const rounds = (job.interviewRounds || []).filter((r) => r.id !== roundId);
    onUpdate({
      ...job,
      interviewRounds: rounds,
    });
  };

  // Checklist Management
  const handleToggleChecklist = (checkId: string) => {
    const checklist = (job.checklist || []).map((c) =>
      c.id === checkId ? { ...c, completed: !c.completed } : c
    );
    onUpdate({ ...job, checklist });
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    const checklist = job.checklist || [];
    const newItem = {
      id: `c-${Date.now()}`,
      text: newChecklistText.trim(),
      completed: false,
    };
    onUpdate({ ...job, checklist: [...checklist, newItem] });
    setNewChecklistText('');
  };

  const handleDeleteChecklistItem = (checkId: string) => {
    const checklist = (job.checklist || []).filter((c) => c.id !== checkId);
    onUpdate({ ...job, checklist });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0F172A] border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-black/80 overflow-hidden">
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-800/80 bg-[#131E36]/60 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base text-white shadow-lg flex-shrink-0"
              style={{
                backgroundColor: job.color || '#3B82F6',
              }}
            >
              {job.company.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white truncate">{job.company}</h2>
                {job.jobUrl && (
                  <a
                    href={job.jobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-blue-400 p-1 transition-colors"
                    title="Open Job Listing"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <p className="text-sm font-medium text-slate-300 truncate">{job.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Status Dropdown */}
            <select
              value={job.status}
              onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
              className="bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {PIPELINE_COLUMNS.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>

            {/* Priority Selector */}
            <select
              value={job.priority}
              onChange={(e) => handlePriorityChange(e.target.value as 'high' | 'medium' | 'low')}
              className="bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="high">🔥 High Priority</option>
              <option value="medium">⚡ Medium</option>
              <option value="low">💤 Low</option>
            </select>

            <button
              onClick={() => {
                if (confirm(`Delete application for ${job.company}?`)) {
                  onDelete(job.id);
                  onClose();
                }
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors"
              title="Delete Application"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800/80 px-6 bg-[#0B1120]/80">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Overview & Details
          </button>

          <button
            onClick={() => setActiveTab('interviews')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'interviews'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Interview Rounds ({job.interviewRounds?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'checklist'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Checklist ({job.checklist?.filter(c => c.completed).length || 0}/{job.checklist?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('recruiter')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'recruiter'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Recruiter & CRM
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'notes'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Prep Notes
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Compensation</span>
                  </div>
                  <div className="text-base font-bold text-emerald-400">
                    {job.salaryMin || job.salaryMax
                      ? `$${(job.salaryMin || 0) / 1000}k - $${(job.salaryMax || 0) / 1000}k / yr`
                      : 'Not specified'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>Workplace & Location</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-200 capitalize">
                    {job.locationType} • {job.location || 'Remote'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Timeline</span>
                  </div>
                  <div className="text-xs font-medium text-slate-300">
                    Applied: {job.appliedDate ? new Date(job.appliedDate).toLocaleDateString() : 'Not applied yet'}
                  </div>
                </div>
              </div>

              {/* Linked Resume Section */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <h4 className="text-sm font-bold text-slate-100">Linked Resume Version</h4>
                  </div>
                  {onOpenATSMatcher && (
                    <button
                      onClick={() => onOpenATSMatcher(job)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      ATS Match Scanner
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={job.resumeId || ''}
                    onChange={(e) => handleResumeSelect(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Select a Resume from Vault --</option>
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.versionTag}) - {r.fileName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Job Description / Requirements</label>
                <textarea
                  value={job.jobDescription || ''}
                  onChange={(e) => onUpdate({ ...job, jobDescription: e.target.value })}
                  rows={5}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed font-sans"
                />
              </div>
            </div>
          )}

          {/* TAB 2: INTERVIEW ROUNDS */}
          {activeTab === 'interviews' && (
            <div className="space-y-6">
              {/* Add New Round Form */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 flex items-center gap-3">
                <input
                  type="text"
                  value={newRoundTitle}
                  onChange={(e) => setNewRoundTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddRound()}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleAddRound}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Round
                </button>
              </div>

              {/* Rounds List */}
              <div className="space-y-4">
                {(!job.interviewRounds || job.interviewRounds.length === 0) ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-2xl text-slate-400">
                    <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-medium">No interview rounds added yet.</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Add recruiter screening, coding loops, system design, or cultural rounds above.
                    </p>
                  </div>
                ) : (
                  job.interviewRounds.map((round, idx) => (
                    <div
                      key={round.id}
                      className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-slate-100">{round.title}</h4>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span className="capitalize">{round.format || 'Video Call'}</span>
                              {round.dateTime && (
                                <>
                                  <span>•</span>
                                  <span>{new Date(round.dateTime).toLocaleString()}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={round.status}
                            onChange={(e) =>
                              handleUpdateRound(round.id, {
                                status: e.target.value as InterviewRound['status'],
                              })
                            }
                            className={`rounded-xl text-xs font-semibold px-2.5 py-1 border cursor-pointer ${
                              round.status === 'passed'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : round.status === 'failed'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            }`}
                          >
                            <option value="scheduled">Scheduled</option>
                            <option value="in_progress">In Progress</option>
                            <option value="passed">Passed ✅</option>
                            <option value="failed">Failed ❌</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          <button
                            onClick={() => handleDeleteRound(round.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Notes / Questions */}
                      <div className="pt-2 border-t border-slate-800/80">
                        <textarea
                          value={round.notes || ''}
                          onChange={(e) => handleUpdateRound(round.id, { notes: e.target.value })}
                          rows={2}
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleAddChecklistItem}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {(job.checklist || []).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <button
                      onClick={() => handleToggleChecklist(item.id)}
                      className="flex items-center gap-3 text-left flex-1"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                      <span
                        className={`text-xs ${
                          item.completed ? 'line-through text-slate-400' : 'text-slate-200'
                        }`}
                      >
                        {item.text}
                      </span>
                    </button>
                    <button
                      onClick={() => handleDeleteChecklistItem(item.id)}
                      className="text-slate-400 hover:text-rose-400 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: RECRUITER */}
          {activeTab === 'recruiter' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Recruiter / Contact Name</label>
                  <input
                    type="text"
                    value={job.recruiterName || ''}
                    onChange={(e) => onUpdate({ ...job, recruiterName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Recruiter Email</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={job.recruiterEmail || ''}
                      onChange={(e) => onUpdate({ ...job, recruiterEmail: e.target.value })}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                    {job.recruiterEmail && (
                      <a
                        href={`mailto:${job.recruiterEmail}`}
                        className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center hover:bg-blue-600/30"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Phone Number</label>
                  <input
                    type="text"
                    value={job.recruiterPhone || ''}
                    onChange={(e) => onUpdate({ ...job, recruiterPhone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">LinkedIn Profile URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={job.recruiterLinkedIn || ''}
                      onChange={(e) => onUpdate({ ...job, recruiterLinkedIn: e.target.value })}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                    {job.recruiterLinkedIn && (
                      <a
                        href={job.recruiterLinkedIn}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center hover:bg-blue-600/30"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300">Freeform Research & Strategy Notes</label>
              <textarea
                value={job.notes || ''}
                onChange={(e) => onUpdate({ ...job, notes: e.target.value })}
                rows={10}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-[#131E36]/40 flex items-center justify-between text-xs text-slate-400">
          <span>Created: {new Date(job.createdAt).toLocaleDateString()}</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md transition-colors"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
