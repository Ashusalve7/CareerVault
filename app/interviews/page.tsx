'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { CloudflareSettingsModal } from '@/components/settings/CloudflareSettingsModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { StorageEngine, SYNC_EVENT } from '@/lib/storage';
import { AUTH_SYNC_EVENT } from '@/lib/auth';
import { JobApplication, InterviewRound } from '@/lib/types';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Award,
  Layers,
} from 'lucide-react';

export default function InterviewsPage() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCloudflareModalOpen, setIsCloudflareModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'question_bank'>('timeline');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup' | 'switch'>('switch');

  useEffect(() => {
    const loadData = () => setJobs(StorageEngine.getJobs());
    loadData();
    const handleSync = () => loadData();
    window.addEventListener(SYNC_EVENT, handleSync);
    window.addEventListener(AUTH_SYNC_EVENT, handleSync);
    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync);
      window.removeEventListener(AUTH_SYNC_EVENT, handleSync);
    };
  }, []);

  const handleOpenAuth = (tab: 'signin' | 'signup' | 'switch' = 'switch') => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  // Collect all rounds from active interviewing jobs
  const interviewingJobs = jobs.filter(
    (j) => j.status === 'interviewing' || (j.interviewRounds && j.interviewRounds.length > 0)
  );

  const allRoundsWithJob: { round: InterviewRound; job: JobApplication }[] = [];
  interviewingJobs.forEach((job) => {
    (job.interviewRounds || []).forEach((round) => {
      allRoundsWithJob.push({ round, job });
    });
  });

  // Sort upcoming rounds first
  allRoundsWithJob.sort((a, b) => {
    const dateA = a.round.dateTime ? new Date(a.round.dateTime).getTime() : Infinity;
    const dateB = b.round.dateTime ? new Date(b.round.dateTime).getTime() : Infinity;
    return dateA - dateB;
  });

  const handleUpdateRoundStatus = (jobId: string, roundId: string, status: InterviewRound['status']) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;
    const updatedRounds = (job.interviewRounds || []).map((r) =>
      r.id === roundId ? { ...r, status } : r
    );
    StorageEngine.updateJob(jobId, { interviewRounds: updatedRounds });
    setJobs(StorageEngine.getJobs());
  };

  const curatedQuestionBank = [
    {
      category: 'System Design & Architecture',
      question: 'Design an offline-first collaborative workspace with real-time optimistic sync and conflict resolution (CRDT / Operational Transforms).',
      tags: ['CRDT', 'WebSockets', 'IndexedDB', 'Distributed Systems'],
      company: 'Linear / Stripe',
    },
    {
      category: 'Frontend Performance & Core Web Vitals',
      question: 'How do React Server Components (RSC) differ from Server-Side Rendering (SSR)? How does streaming HTML with Suspense prevent hydration waterfalls?',
      tags: ['React 19', 'Next.js', 'Hydration', 'Turbopack'],
      company: 'Vercel',
    },
    {
      category: 'Distributed Edge & Serverless DBs',
      question: 'Explain how Cloudflare D1 implements distributed SQLite replication at the edge with WAL (Write-Ahead Logging) and read-replicas.',
      tags: ['Cloudflare D1', 'SQLite', 'Raft', 'Edge Compute'],
      company: 'Cloudflare',
    },
    {
      category: 'Behavioral & Leadership (STAR Method)',
      question: 'Tell me about a time you had to make an architectural trade-off under strict deadline pressure. What were the trade-offs and how did you measure the outcome?',
      tags: ['Leadership', 'Trade-offs', 'STAR'],
      company: 'Anthropic / Stripe',
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#090D16] text-slate-100 antialiased">
      <Sidebar
        onOpenSettings={() => setIsCloudflareModalOpen(true)}
        onOpenAuth={handleOpenAuth}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedPriority="all"
          onPriorityChange={() => {}}
          selectedLocationType="all"
          onLocationTypeChange={() => {}}
          onOpenAddJob={() => {}}
          onOpenCloudflareModal={() => setIsCloudflareModalOpen(true)}
          onOpenAuth={handleOpenAuth}
          totalJobsCount={jobs.length}
        />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Interview Progress Hub
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Interview Rounds & Prep Tracking
              </h1>
              <p className="text-sm text-slate-300">
                Track each interview round stage, prep notes, scheduled times, and master high-yield questions.
              </p>
            </div>

            {/* Tab switch */}
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
                  activeTab === 'timeline'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Active Rounds ({allRoundsWithJob.length})
              </button>
              <button
                onClick={() => setActiveTab('question_bank')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
                  activeTab === 'question_bank'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Question Bank
              </button>
            </div>
          </div>

          {/* TAB 1: ROUNDS TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              {allRoundsWithJob.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30 space-y-3">
                  <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
                  <h3 className="text-base font-bold text-slate-200">No Interview Rounds Logged Yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Drag applications into the &quot;Interviewing&quot; column on your board to automatically schedule rounds.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allRoundsWithJob.map(({ round, job }) => (
                    <div
                      key={round.id}
                      className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base text-white shadow-lg flex-shrink-0"
                          style={{ backgroundColor: job.color || '#3B82F6' }}
                        >
                          {job.company.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-white">{job.company}</h4>
                            <span className="text-xs text-slate-400 font-medium">• {job.title}</span>
                          </div>
                          <h5 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                            <span>Round {round.roundNumber}: {round.title}</span>
                          </h5>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Video className="w-3.5 h-3.5 text-blue-400" />
                              <span className="capitalize">{round.format || 'Video'}</span>
                            </span>
                            {round.dateTime && (
                              <span className="flex items-center gap-1 text-slate-300 font-medium">
                                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                                {new Date(round.dateTime).toLocaleString(undefined, {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                })}
                              </span>
                            )}
                            {round.interviewerName && (
                              <span>With {round.interviewerName} ({round.interviewerRole || 'Interviewer'})</span>
                            )}
                          </div>
                          {round.notes && (
                            <p className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 mt-2 max-w-xl">
                              {round.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <select
                          value={round.status}
                          onChange={(e) =>
                            handleUpdateRoundStatus(job.id, round.id, e.target.value as InterviewRound['status'])
                          }
                          className={`rounded-xl text-xs font-bold px-3.5 py-2 border cursor-pointer ${
                            round.status === 'passed'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : round.status === 'failed'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          }`}
                        >
                          <option value="scheduled">Scheduled ⏰</option>
                          <option value="in_progress">In Progress ⚡</option>
                          <option value="passed">Passed ✅</option>
                          <option value="failed">Failed ❌</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: QUESTION BANK */}
          {activeTab === 'question_bank' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {curatedQuestionBank.map((q, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-indigo-400">{q.category}</span>
                      <span className="text-slate-400 font-medium">Seen at: {q.company}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-100 leading-relaxed">
                      &quot;{q.question}&quot;
                    </h4>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/80">
                    {q.tags.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/50"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <CloudflareSettingsModal
        isOpen={isCloudflareModalOpen}
        onClose={() => setIsCloudflareModalOpen(false)}
        jobsCount={jobs.length}
        resumesCount={0}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab={authTab}
      />
    </div>
  );
}
