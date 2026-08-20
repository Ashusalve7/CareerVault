-- Cloudflare D1 Serverless SQL Database Schema for CareerVault
-- SQLite-compatible schema with performance indexes and multi-user data isolation

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  role_title TEXT DEFAULT 'Software Engineer',
  avatar_color TEXT DEFAULT '#3B82F6',
  created_at TEXT NOT NULL
);

-- 2. Jobs Table (Scoped by user_id)
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'user-default',
  company TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT DEFAULT '',
  location_type TEXT CHECK(location_type IN ('remote', 'hybrid', 'onsite')) DEFAULT 'remote',
  salary_min REAL,
  salary_max REAL,
  salary_currency TEXT DEFAULT 'USD',
  salary_period TEXT CHECK(salary_period IN ('year', 'month', 'hour')) DEFAULT 'year',
  status TEXT CHECK(status IN ('wishlist', 'applied', 'screening', 'interviewing', 'offer', 'rejected', 'accepted', 'withdrawn')) NOT NULL DEFAULT 'wishlist',
  column_order INTEGER DEFAULT 0,
  priority TEXT CHECK(priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  job_url TEXT,
  job_description TEXT,
  notes TEXT,
  applied_date TEXT,
  deadline_date TEXT,
  resume_id TEXT,
  resume_version_name TEXT,
  cover_letter TEXT,
  recruiter_name TEXT,
  recruiter_email TEXT,
  recruiter_phone TEXT,
  recruiter_linkedin TEXT,
  source TEXT DEFAULT 'LinkedIn',
  checklist_json TEXT, -- JSON array of checklist items
  tags_json TEXT,      -- JSON array of tags
  color TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Interview Rounds Table
CREATE TABLE IF NOT EXISTS interview_rounds (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT 'user-default',
  round_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  date_time TEXT,
  interviewer_name TEXT,
  interviewer_role TEXT,
  interviewer_email TEXT,
  meeting_link TEXT,
  format TEXT CHECK(format IN ('video', 'phone', 'onsite', 'takehome')) DEFAULT 'video',
  status TEXT CHECK(status IN ('scheduled', 'in_progress', 'passed', 'failed', 'cancelled')) DEFAULT 'scheduled',
  notes TEXT,
  questions_json TEXT, -- JSON array of questions asked/prep
  feedback TEXT,
  rating INTEGER CHECK(rating >= 1 AND rating <= 5),
  created_at TEXT NOT NULL,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Resumes Table (Linked to Cloudflare R2, scoped by user_id)
CREATE TABLE IF NOT EXISTS resumes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'user-default',
  name TEXT NOT NULL,
  version_tag TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  r2_url TEXT,
  target_roles_json TEXT, -- JSON array
  skills_json TEXT,       -- JSON array of parsed skills
  summary TEXT,
  content_snippet TEXT,
  is_default INTEGER DEFAULT 0,
  upload_date TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Recruiter Contacts CRM Table (Scoped by user_id)
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'user-default',
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin TEXT,
  notes TEXT,
  associated_jobs_json TEXT, -- JSON array of job IDs
  last_contacted_date TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for blazing fast D1 multi-user query execution
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_interview_rounds_job_id ON interview_rounds(job_id);
CREATE INDEX IF NOT EXISTS idx_interview_rounds_user_id ON interview_rounds(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_rounds_status ON interview_rounds(status);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_version ON resumes(version_tag);
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company);
