'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { ResumeCard } from '@/components/resumes/ResumeCard';
import { ResumeUploader } from '@/components/resumes/ResumeUploader';
import { ResumePreviewModal } from '@/components/resumes/ResumePreviewModal';
import { ATSMatcherModal } from '@/components/resumes/ATSMatcherModal';
import { CloudflareSettingsModal } from '@/components/settings/CloudflareSettingsModal';
import { StorageEngine } from '@/lib/storage';
import { ResumeItem, JobApplication } from '@/lib/types';
import { FileText, Plus, Sparkles, Cloud, HardDrive, ShieldCheck, Zap } from 'lucide-react';

export default function ResumesPage() {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [previewResume, setPreviewResume] = useState<ResumeItem | null>(null);
  const [isATSMatcherOpen, setIsATSMatcherOpen] = useState(false);
  const [atsResume, setAtsResume] = useState<ResumeItem | null>(null);
  const [isCloudflareModalOpen, setIsCloudflareModalOpen] = useState(false);

  useEffect(() => {
    const loadData = () => {
      setResumes(StorageEngine.getResumes());
      setJobs(StorageEngine.getJobs());
    };

    loadData();
    const handleSync = () => loadData();
    window.addEventListener('careervault_storage_sync', handleSync);
    return () => window.removeEventListener('careervault_storage_sync', handleSync);
  }, []);

  const handleUploadSuccess = (resumeData: Omit<ResumeItem, 'id' | 'uploadDate' | 'updatedAt'>) => {
    StorageEngine.addResume(resumeData);
    setResumes(StorageEngine.getResumes());
    setIsUploaderOpen(false);
  };

  const handleDeleteResume = (id: string) => {
    StorageEngine.deleteResume(id);
    setResumes(StorageEngine.getResumes());
  };

  const handleOpenATSMatcher = (resume: ResumeItem) => {
    setAtsResume(resume);
    setIsATSMatcherOpen(true);
  };

  const filteredResumes = resumes.filter((r) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.versionTag.toLowerCase().includes(q) ||
      r.skills.some((s) => s.toLowerCase().includes(q)) ||
      r.targetRoles.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex min-h-screen bg-[#090D16] text-slate-100 antialiased">
      <Sidebar onOpenSettings={() => setIsCloudflareModalOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedPriority="all"
          onPriorityChange={() => {}}
          selectedLocationType="all"
          onLocationTypeChange={() => {}}
          onOpenAddJob={() => {}}
          onOpenUploadResume={() => setIsUploaderOpen(true)}
          onOpenCloudflareModal={() => setIsCloudflareModalOpen(true)}
          totalJobsCount={jobs.length}
        />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Page Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900 border border-blue-500/20 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5" />
                  Cloudflare R2 Object Storage
                </span>
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  ATS Matching Engine
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Resume Vault & Version Management
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Store, version, and match customized resumes against job descriptions with zero-egress Cloudflare R2 storage.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => setIsATSMatcherOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>ATS Match Scanner</span>
              </button>

              <button
                onClick={() => setIsUploaderOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Version</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400 font-medium">Total Resume Versions</div>
              <div className="text-2xl font-black text-white">{resumes.length}</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400 font-medium">R2 Stored Files</div>
              <div className="text-2xl font-black text-blue-400">{resumes.length} PDFs</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400 font-medium">Active Applications Linked</div>
              <div className="text-2xl font-black text-emerald-400">
                {jobs.filter((j) => j.resumeId).length} / {jobs.length}
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400 font-medium">ATS Pass Rate Avg</div>
              <div className="text-2xl font-black text-indigo-400">91%</div>
            </div>
          </div>

          {/* Resumes Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>Your Stored Resumes ({filteredResumes.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onPreview={setPreviewResume}
                  onDelete={handleDeleteResume}
                  onOpenATSMatcher={handleOpenATSMatcher}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      {isUploaderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl">
            <ResumeUploader
              onUploadSuccess={handleUploadSuccess}
              onClose={() => setIsUploaderOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <ResumePreviewModal
        resume={previewResume}
        jobs={jobs}
        isOpen={Boolean(previewResume)}
        onClose={() => setPreviewResume(null)}
      />

      {/* ATS Matcher Modal */}
      <ATSMatcherModal
        initialResume={atsResume}
        resumes={resumes}
        jobs={jobs}
        isOpen={isATSMatcherOpen}
        onClose={() => setIsATSMatcherOpen(false)}
      />

      <CloudflareSettingsModal
        isOpen={isCloudflareModalOpen}
        onClose={() => setIsCloudflareModalOpen(false)}
        jobsCount={jobs.length}
        resumesCount={resumes.length}
      />
    </div>
  );
}
