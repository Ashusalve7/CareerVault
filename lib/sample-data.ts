import { JobApplication, ResumeItem, RecruiterContact } from './types';

// Clean initial state without dummy data
export const INITIAL_RESUMES: ResumeItem[] = [];

export const INITIAL_CONTACTS: RecruiterContact[] = [];

export const INITIAL_JOBS: JobApplication[] = [];

export const PIPELINE_COLUMNS: { id: import('./types').ApplicationStatus; title: string; color: string; badgeBg: string; description: string }[] = [
  {
    id: 'wishlist',
    title: 'Wishlist & Saved',
    color: 'from-slate-500 to-slate-700',
    badgeBg: 'bg-slate-500/10 text-slate-400 border-slate-700/50',
    description: 'Target companies and open roles to research and tailor resumes for'
  },
  {
    id: 'applied',
    title: 'Applied',
    color: 'from-blue-500 to-indigo-600',
    badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-700/50',
    description: 'Submitted applications awaiting recruiter confirmation'
  },
  {
    id: 'screening',
    title: 'Screening / OA',
    color: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-700/50',
    description: 'Recruiter call, Take-home challenge, or Online Assessment'
  },
  {
    id: 'interviewing',
    title: 'Interviewing',
    color: 'from-purple-500 to-pink-600',
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-700/50',
    description: 'Active technical rounds, system design, and loop interviews'
  },
  {
    id: 'offer',
    title: 'Offer Received',
    color: 'from-emerald-500 to-teal-600',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-700/50',
    description: 'Formal job offers extended - review compensation and negotiate'
  },
  {
    id: 'accepted',
    title: 'Accepted',
    color: 'from-green-500 to-emerald-600',
    badgeBg: 'bg-green-500/10 text-green-400 border-green-700/50',
    description: 'Signed and confirmed dream role!'
  },
  {
    id: 'rejected',
    title: 'Rejected / Archived',
    color: 'from-rose-500 to-red-700',
    badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-700/50',
    description: 'Archived opportunities or rejected applications'
  }
];
