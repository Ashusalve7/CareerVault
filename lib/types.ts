export type ApplicationStatus =
  | 'wishlist'
  | 'applied'
  | 'screening'
  | 'interviewing'
  | 'offer'
  | 'rejected'
  | 'accepted'
  | 'withdrawn';

export type JobPriority = 'high' | 'medium' | 'low';
export type JobLocationType = 'remote' | 'hybrid' | 'onsite';

export interface InterviewRound {
  id: string;
  jobId: string;
  roundNumber: number;
  title: string; // e.g. "Recruiter Screen", "Technical Coding", "System Design", "HR & Culture"
  dateTime?: string; // ISO string
  interviewerName?: string;
  interviewerRole?: string;
  interviewerEmail?: string;
  meetingLink?: string;
  format?: 'video' | 'phone' | 'onsite' | 'takehome';
  status: 'scheduled' | 'in_progress' | 'passed' | 'failed' | 'cancelled';
  notes?: string;
  questionsAsked?: string[];
  feedback?: string;
  rating?: number; // 1-5
  createdAt: string;
}

export interface JobApplication {
  id: string;
  company: string;
  title: string;
  location: string;
  locationType: JobLocationType;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  salaryPeriod: 'year' | 'month' | 'hour';
  status: ApplicationStatus;
  columnOrder: number;
  priority: JobPriority;
  jobUrl?: string;
  jobDescription?: string;
  notes?: string;
  appliedDate?: string;
  deadlineDate?: string;
  resumeId?: string;
  resumeVersionName?: string;
  coverLetter?: string;
  recruiterName?: string;
  recruiterEmail?: string;
  recruiterPhone?: string;
  recruiterLinkedIn?: string;
  source?: string; // e.g. 'LinkedIn', 'Referral', 'Wellfound', 'Company Site'
  interviewRounds: InterviewRound[];
  checklist?: { id: string; text: string; completed: boolean }[];
  tags: string[];
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeItem {
  id: string;
  name: string;
  versionTag: string; // e.g. "Fullstack v3", "AI Engineer", "Backend Go"
  fileName: string;
  fileSize: number;
  fileType: string;
  r2Key: string;
  r2Url?: string;
  targetRoles: string[];
  skills: string[];
  summary?: string;
  contentSnippet?: string;
  downloadUrl?: string;
  isDefault?: boolean;
  linkedJobsCount?: number;
  uploadDate: string;
  updatedAt: string;
}

export interface RecruiterContact {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  notes?: string;
  associatedJobIds: string[];
  lastContactedDate?: string;
  createdAt: string;
}

export interface ColumnDefinition {
  id: ApplicationStatus;
  title: string;
  color: string;
  badgeBg: string;
  iconName: string;
  description: string;
}

export interface CloudflareConfig {
  accountId: string;
  d1DatabaseId: string;
  apiToken: string;
  r2BucketName: string;
  r2AccessKeyId: string;
  r2SecretAccessKey: string;
  r2PublicUrl: string;
  isD1Connected: boolean;
  isR2Connected: boolean;
}

export interface ATSMatchResult {
  matchPercentage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  experienceScore: number;
  educationScore: number;
  suggestions: string[];
}
