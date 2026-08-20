'use client';

import { JobApplication, ResumeItem, RecruiterContact, ApplicationStatus } from './types';
import { INITIAL_JOBS, INITIAL_RESUMES, INITIAL_CONTACTS } from './sample-data';
import { AuthEngine } from './auth';

export const SYNC_EVENT = 'careervault_storage_sync';

export class StorageEngine {
  private static isClient(): boolean {
    return typeof window !== 'undefined';
  }

  private static getJobsKey(): string {
    return `careervault_jobs_${AuthEngine.getActiveUserId()}`;
  }

  private static getResumesKey(): string {
    return `careervault_resumes_${AuthEngine.getActiveUserId()}`;
  }

  private static getContactsKey(): string {
    return `careervault_contacts_${AuthEngine.getActiveUserId()}`;
  }

  // --- JOBS ---
  public static getJobs(): JobApplication[] {
    if (!this.isClient()) return INITIAL_JOBS;
    try {
      const stored = localStorage.getItem(this.getJobsKey());
      if (!stored) {
        return [];
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading jobs from storage:', e);
      return [];
    }
  }

  public static saveJobs(jobs: JobApplication[]): void {
    if (!this.isClient()) return;
    try {
      localStorage.setItem(this.getJobsKey(), JSON.stringify(jobs));
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { type: 'jobs' } }));
    } catch (e) {
      console.error('Error saving jobs to storage:', e);
    }
  }

  public static addJob(job: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>): JobApplication {
    const jobs = this.getJobs();
    const newJob: JobApplication = {
      ...job,
      id: `job-${Date.now()}`,
      interviewRounds: job.interviewRounds || [],
      checklist: job.checklist || [],
      tags: job.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    jobs.unshift(newJob);
    this.saveJobs(jobs);
    return newJob;
  }

  public static updateJob(id: string, updates: Partial<JobApplication>): JobApplication | null {
    const jobs = this.getJobs();
    const index = jobs.findIndex(j => j.id === id);
    if (index === -1) return null;

    const updatedJob: JobApplication = {
      ...jobs[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    jobs[index] = updatedJob;
    this.saveJobs(jobs);
    return updatedJob;
  }

  public static updateJobStatus(id: string, newStatus: ApplicationStatus): JobApplication | null {
    const jobs = this.getJobs();
    const index = jobs.findIndex(j => j.id === id);
    if (index === -1) return null;

    const job = jobs[index];
    const prevStatus = job.status;
    job.status = newStatus;
    job.updatedAt = new Date().toISOString();

    // If moved to applied and no appliedDate, set today
    if (newStatus === 'applied' && !job.appliedDate) {
      job.appliedDate = new Date().toISOString();
    }

    // Auto-create initial interview round if moved to interviewing and no rounds exist
    if (newStatus === 'interviewing' && (!job.interviewRounds || job.interviewRounds.length === 0)) {
      job.interviewRounds = [
        {
          id: `r-${Date.now()}`,
          jobId: job.id,
          roundNumber: 1,
          title: 'Technical Screen / Round 1',
          format: 'video',
          status: 'scheduled',
          dateTime: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
          notes: '',
          createdAt: new Date().toISOString(),
        }
      ];
    }

    jobs[index] = job;
    this.saveJobs(jobs);
    return job;
  }

  public static deleteJob(id: string): boolean {
    const jobs = this.getJobs();
    const filtered = jobs.filter(j => j.id !== id);
    if (filtered.length === jobs.length) return false;
    this.saveJobs(filtered);
    return true;
  }

  // --- RESUMES ---
  public static getResumes(): ResumeItem[] {
    if (!this.isClient()) return INITIAL_RESUMES;
    try {
      const stored = localStorage.getItem(this.getResumesKey());
      if (!stored) {
        return [];
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading resumes from storage:', e);
      return [];
    }
  }

  public static saveResumes(resumes: ResumeItem[]): void {
    if (!this.isClient()) return;
    try {
      localStorage.setItem(this.getResumesKey(), JSON.stringify(resumes));
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { type: 'resumes' } }));
    } catch (e) {
      console.error('Error saving resumes:', e);
    }
  }

  public static addResume(resume: Omit<ResumeItem, 'id' | 'uploadDate' | 'updatedAt'>): ResumeItem {
    const resumes = this.getResumes();
    const newResume: ResumeItem = {
      ...resume,
      id: `res-${Date.now()}`,
      uploadDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    resumes.unshift(newResume);
    this.saveResumes(resumes);
    return newResume;
  }

  public static deleteResume(id: string): boolean {
    const resumes = this.getResumes();
    const filtered = resumes.filter(r => r.id !== id);
    if (filtered.length === resumes.length) return false;
    this.saveResumes(filtered);
    return true;
  }

  // --- CONTACTS ---
  public static getContacts(): RecruiterContact[] {
    if (!this.isClient()) return INITIAL_CONTACTS;
    try {
      const stored = localStorage.getItem(this.getContactsKey());
      if (!stored) {
        return [];
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading contacts:', e);
      return [];
    }
  }

  public static saveContacts(contacts: RecruiterContact[]): void {
    if (!this.isClient()) return;
    try {
      localStorage.setItem(this.getContactsKey(), JSON.stringify(contacts));
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { type: 'contacts' } }));
    } catch (e) {
      console.error('Error saving contacts:', e);
    }
  }

  public static addContact(contact: Omit<RecruiterContact, 'id' | 'createdAt'>): RecruiterContact {
    const contacts = this.getContacts();
    const newContact: RecruiterContact = {
      ...contact,
      id: `con-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    contacts.unshift(newContact);
    this.saveContacts(contacts);
    return newContact;
  }

  public static updateContact(id: string, updates: Partial<RecruiterContact>): RecruiterContact | null {
    const contacts = this.getContacts();
    const index = contacts.findIndex(c => c.id === id);
    if (index === -1) return null;
    contacts[index] = { ...contacts[index], ...updates };
    this.saveContacts(contacts);
    return contacts[index];
  }

  public static deleteContact(id: string): boolean {
    const contacts = this.getContacts();
    const filtered = contacts.filter(c => c.id !== id);
    if (filtered.length === contacts.length) return false;
    this.saveContacts(filtered);
    return true;
  }

  // Reset active user data
  public static resetToSampleData(): void {
    if (!this.isClient()) return;
    localStorage.removeItem(this.getJobsKey());
    localStorage.removeItem(this.getResumesKey());
    localStorage.removeItem(this.getContactsKey());
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { type: 'all' } }));
  }
}
