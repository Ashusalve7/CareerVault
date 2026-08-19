'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Board } from '@/components/kanban/Board';
import { JobDetailsModal } from '@/components/kanban/JobDetailsModal';
import { AddJobModal } from '@/components/kanban/AddJobModal';
import { ATSMatcherModal } from '@/components/resumes/ATSMatcherModal';
import { ResumeUploader } from '@/components/resumes/ResumeUploader';
import { CloudflareSettingsModal } from '@/components/settings/CloudflareSettingsModal';
import { StorageEngine } from '@/lib/storage';
import { JobApplication, ApplicationStatus, ResumeItem } from '@/lib/types';

export default function KanbanPage() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedLocationType, setSelectedLocationType] = useState('all');

  // Modals state
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [quickAddStatus, setQuickAddStatus] = useState<ApplicationStatus>('wishlist');
  const [isATSMatcherOpen, setIsATSMatcherOpen] = useState(false);
  const [isUploadResumeOpen, setIsUploadResumeOpen] = useState(false);
  const [isCloudflareModalOpen, setIsCloudflareModalOpen] = useState(false);

  // Load data on mount & subscribe to storage events
  useEffect(() => {
    const loadData = () => {
      setJobs(StorageEngine.getJobs());
      setResumes(StorageEngine.getResumes());
    };

    loadData();

    const handleSync = () => loadData();
    window.addEventListener('careervault_storage_sync', handleSync);
    return () => window.removeEventListener('careervault_storage_sync', handleSync);
  }, []);

  // Update handlers
  const handleUpdateJobs = (newJobs: JobApplication[]) => {
    setJobs(newJobs);
    StorageEngine.saveJobs(newJobs);
  };

  const handleStatusChange = (id: string, newStatus: ApplicationStatus) => {
    StorageEngine.updateJobStatus(id, newStatus);
    setJobs(StorageEngine.getJobs());
    if (selectedJob && selectedJob.id === id) {
      setSelectedJob({ ...selectedJob, status: newStatus });
    }
  };

  const handleDeleteJob = (id: string) => {
    StorageEngine.deleteJob(id);
    setJobs(StorageEngine.getJobs());
    if (selectedJob && selectedJob.id === id) {
      setSelectedJob(null);
      setIsDetailsOpen(false);
    }
  };

  const handleUpdateJobDetails = (updated: JobApplication) => {
    StorageEngine.updateJob(updated.id, updated);
    setJobs(StorageEngine.getJobs());
    setSelectedJob(updated);
  };

  const handleAddJob = (jobData: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = StorageEngine.addJob(jobData);
    setJobs(StorageEngine.getJobs());
    setSelectedJob(created);
    setIsDetailsOpen(true);
  };

  const handleUploadResumeSuccess = (resumeData: Omit<ResumeItem, 'id' | 'uploadDate' | 'updatedAt'>) => {
    StorageEngine.addResume(resumeData);
    setResumes(StorageEngine.getResumes());
    setIsUploadResumeOpen(false);
  };

  const handleOpenDetails = (job: JobApplication) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };

  const handleQuickAdd = (status: ApplicationStatus) => {
    setQuickAddStatus(status);
    setIsAddJobOpen(true);
  };

  const handleOpenATSMatcher = (job?: JobApplication) => {
    if (job) setSelectedJob(job);
    setIsATSMatcherOpen(true);
  };

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchCompany = job.company.toLowerCase().includes(q);
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchTags = job.tags?.some((t) => t.toLowerCase().includes(q));
      const matchLocation = job.location?.toLowerCase().includes(q);
      if (!matchCompany && !matchTitle && !matchTags && !matchLocation) return false;
    }

    // Priority filter
    if (selectedPriority !== 'all' && job.priority !== selectedPriority) {
      return false;
    }

    // Location type filter
    if (selectedLocationType !== 'all' && job.locationType !== selectedLocationType) {
      return false;
    }

    return true;
  });

  const activeInterviewsCount = jobs.filter((j) => j.status === 'interviewing').length;

  return (
    <div className="flex min-h-screen bg-[#090D16] text-slate-100 antialiased">
      {/* Navigation Sidebar */}
      <Sidebar
        onOpenSettings={() => setIsCloudflareModalOpen(true)}
        onOpenAddJob={() => {
          setQuickAddStatus('wishlist');
          setIsAddJobOpen(true);
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          selectedLocationType={selectedLocationType}
          onLocationTypeChange={setSelectedLocationType}
          onOpenAddJob={() => {
            setQuickAddStatus('wishlist');
            setIsAddJobOpen(true);
          }}
          onOpenUploadResume={() => setIsUploadResumeOpen(true)}
          onOpenCloudflareModal={() => setIsCloudflareModalOpen(true)}
          totalJobsCount={jobs.length}
          activeInterviewsCount={activeInterviewsCount}
        />

        {/* Drag and Drop Kanban Board */}
        <main className="flex-1 overflow-hidden relative">
          <Board
            jobs={filteredJobs}
            onUpdateJobs={handleUpdateJobs}
            onOpenDetails={handleOpenDetails}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteJob}
            onQuickAdd={handleQuickAdd}
          />
        </main>
      </div>

      {/* Modals & Slide-overs */}
      <JobDetailsModal
        job={selectedJob}
        resumes={resumes}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onUpdate={handleUpdateJobDetails}
        onDelete={handleDeleteJob}
        onOpenATSMatcher={() => {
          setIsDetailsOpen(false);
          setIsATSMatcherOpen(true);
        }}
      />

      <AddJobModal
        isOpen={isAddJobOpen}
        initialStatus={quickAddStatus}
        resumes={resumes}
        onClose={() => setIsAddJobOpen(false)}
        onAddJob={handleAddJob}
      />

      <ATSMatcherModal
        initialJob={selectedJob}
        resumes={resumes}
        jobs={jobs}
        isOpen={isATSMatcherOpen}
        onClose={() => setIsATSMatcherOpen(false)}
      />

      {isUploadResumeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl">
            <ResumeUploader
              onUploadSuccess={handleUploadResumeSuccess}
              onClose={() => setIsUploadResumeOpen(false)}
            />
          </div>
        </div>
      )}

      <CloudflareSettingsModal
        isOpen={isCloudflareModalOpen}
        onClose={() => setIsCloudflareModalOpen(false)}
        jobsCount={jobs.length}
        resumesCount={resumes.length}
      />
    </div>
  );
}
