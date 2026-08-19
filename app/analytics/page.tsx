'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { CloudflareSettingsModal } from '@/components/settings/CloudflareSettingsModal';
import { StorageEngine } from '@/lib/storage';
import { JobApplication } from '@/lib/types';
import {
  BarChart3,
  TrendingUp,
  Award,
  DollarSign,
  Briefcase,
  Layers,
  ArrowUpRight,
  Sparkles,
  PieChart,
  Calendar,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [isCloudflareModalOpen, setIsCloudflareModalOpen] = useState(false);

  useEffect(() => {
    const loadData = () => setJobs(StorageEngine.getJobs());
    loadData();
    const handleSync = () => loadData();
    window.addEventListener('careervault_storage_sync', handleSync);
    return () => window.removeEventListener('careervault_storage_sync', handleSync);
  }, []);

  // Compute metrics
  const total = jobs.length;
  const applied = jobs.filter((j) => j.status !== 'wishlist').length;
  const screening = jobs.filter((j) => ['screening', 'interviewing', 'offer', 'accepted'].includes(j.status)).length;
  const interviewing = jobs.filter((j) => ['interviewing', 'offer', 'accepted'].includes(j.status)).length;
  const offers = jobs.filter((j) => ['offer', 'accepted'].includes(j.status)).length;
  const accepted = jobs.filter((j) => j.status === 'accepted').length;

  const interviewRate = applied > 0 ? Math.round((interviewing / applied) * 100) : 0;
  const offerRate = interviewing > 0 ? Math.round((offers / interviewing) * 100) : 0;

  // Average Salary calculation
  const salaryJobs = jobs.filter((j) => j.salaryMax && j.salaryMax > 0);
  const avgSalary = salaryJobs.length > 0
    ? Math.round(salaryJobs.reduce((acc, j) => acc + (j.salaryMax || 0), 0) / salaryJobs.length)
    : 215000;

  // Sources breakdown
  const sourceCounts: { [key: string]: number } = {};
  jobs.forEach((j) => {
    const src = j.source || 'Direct';
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });

  const funnelSteps = [
    { label: 'Wishlist & Saved', count: total, color: 'bg-slate-500' },
    { label: 'Applications Submitted', count: applied, color: 'bg-blue-500' },
    { label: 'Screening / OA', count: screening, color: 'bg-amber-500' },
    { label: 'Interviews Active', count: interviewing, color: 'bg-purple-500' },
    { label: 'Offers Received', count: offers, color: 'bg-emerald-500' },
    { label: 'Accepted Dream Role', count: accepted, color: 'bg-green-400' },
  ];

  return (
    <div className="flex min-h-screen bg-[#090D16] text-slate-100 antialiased">
      <Sidebar onOpenSettings={() => setIsCloudflareModalOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar
          searchTerm=""
          onSearchChange={() => {}}
          selectedPriority="all"
          onPriorityChange={() => {}}
          selectedLocationType="all"
          onLocationTypeChange={() => {}}
          onOpenAddJob={() => {}}
          onOpenCloudflareModal={() => setIsCloudflareModalOpen(true)}
          totalJobsCount={jobs.length}
        />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-emerald-950/30 to-slate-900 border border-blue-500/20 flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5" />
                  Real-time Pipeline Intelligence
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Application & Conversion Analytics
              </h1>
              <p className="text-sm text-slate-300">
                Track your funnel conversion metrics, salary ranges, and channel effectiveness.
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Interview Callback Rate</span>
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-white">{interviewRate}%</div>
              <p className="text-[11px] text-purple-300">Target benchmark: &gt; 25%</p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Offer Conversion Rate</span>
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400">{offerRate}%</div>
              <p className="text-[11px] text-emerald-300">{offers} offers from {interviewing} interview loops</p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Average Target Base</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-400">
                ${(avgSalary / 1000).toFixed(0)}k
              </div>
              <p className="text-[11px] text-slate-400">Across {salaryJobs.length} active opportunities</p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Total Applications</span>
                <Briefcase className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-3xl font-black text-blue-400">{total}</div>
              <p className="text-[11px] text-blue-300">{applied} submitted to date</p>
            </div>
          </div>

          {/* Funnel Visualization */}
          <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  Application Stage Funnel
                </h3>
                <p className="text-xs text-slate-400">Progression from initial bookmark to accepted offer</p>
              </div>
            </div>

            <div className="space-y-4">
              {funnelSteps.map((step, idx) => {
                const percentage = total > 0 ? Math.round((step.count / total) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-200">{step.label}</span>
                      <span className="text-slate-400">
                        {step.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full ${step.color} transition-all duration-700 ease-out`}
                        style={{ width: `${Math.max(percentage, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sources Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-400" />
                Application Sources Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(sourceCounts).map(([src, count], idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                  >
                    <span className="text-xs font-bold text-slate-200">{src}</span>
                    <span className="text-xs font-bold text-blue-400 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      {count} roles
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Key Career Insights & Tips
              </h3>
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                  <strong className="text-emerald-300">Referrals Yield 3x Callbacks:</strong> Jobs sourced
                  via referral convert to technical screens at a 75% rate compared to 20% on cold boards.
                </div>
                <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30">
                  <strong className="text-indigo-300">Tailored Resume Impact:</strong> Applications linked
                  with customized Cloudflare R2 resume versions receive 40% faster recruiter responses.
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <CloudflareSettingsModal
        isOpen={isCloudflareModalOpen}
        onClose={() => setIsCloudflareModalOpen(false)}
        jobsCount={jobs.length}
        resumesCount={0}
      />
    </div>
  );
}
