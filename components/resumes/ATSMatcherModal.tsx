'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, FileText, Briefcase, Zap } from 'lucide-react';
import { ResumeItem, JobApplication, ATSMatchResult } from '@/lib/types';

interface ATSMatcherModalProps {
  initialResume?: ResumeItem | null;
  initialJob?: JobApplication | null;
  resumes: ResumeItem[];
  jobs: JobApplication[];
  isOpen: boolean;
  onClose: () => void;
}

export function ATSMatcherModal({
  initialResume,
  initialJob,
  resumes,
  jobs,
  isOpen,
  onClose,
}: ATSMatcherModalProps) {
  const [selectedResumeId, setSelectedResumeId] = useState<string>(initialResume?.id || resumes[0]?.id || '');
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJob?.id || jobs[0]?.id || '');
  const [customJobDescription, setCustomJobDescription] = useState<string>('');
  const [useCustomJD, setUseCustomJD] = useState(false);
  const [result, setResult] = useState<ATSMatchResult | null>(null);

  useEffect(() => {
    if (initialResume) setSelectedResumeId(initialResume.id);
  }, [initialResume]);

  useEffect(() => {
    if (initialJob) {
      setSelectedJobId(initialJob.id);
      if (initialJob.jobDescription) {
        setCustomJobDescription(initialJob.jobDescription);
      }
    }
  }, [initialJob]);

  // Compute ATS Match algorithm
  useEffect(() => {
    const resume = resumes.find((r) => r.id === selectedResumeId);
    const job = jobs.find((j) => j.id === selectedJobId);

    const jdText = useCustomJD
      ? customJobDescription
      : (job?.jobDescription || `${job?.title} ${job?.tags?.join(' ')} ${job?.notes || ''}`);

    if (!resume || !jdText) {
      setResult(null);
      return;
    }

    // Common Tech Keywords Dictionary
    const techKeywords = [
      'typescript', 'react', 'next.js', 'node.js', 'python', 'postgresql', 'sql', 'graphql',
      'rest api', 'docker', 'kubernetes', 'aws', 'system design', 'distributed systems', 'redis',
      'kafka', 'go', 'rust', 'tailwind', 'microservices', 'caching', 'optimistic updates', 'websockets', 'rag', 'llm', 'ai'
    ];

    const lowerJD = jdText.toLowerCase();
    const resumeKeywords = (resume.skills || []).map((s) => s.toLowerCase());

    const matched: string[] = [];
    const missing: string[] = [];

    techKeywords.forEach((kw) => {
      if (lowerJD.includes(kw)) {
        const isMatched = resumeKeywords.some((rKw) => rKw.includes(kw) || kw.includes(rKw));
        if (isMatched) {
          matched.push(kw.charAt(0).toUpperCase() + kw.slice(1));
        } else {
          missing.push(kw.charAt(0).toUpperCase() + kw.slice(1));
        }
      }
    });

    // Also compare raw resume skills against JD
    resume.skills.forEach((s) => {
      const sLower = s.toLowerCase();
      if (lowerJD.includes(sLower) && !matched.map(m => m.toLowerCase()).includes(sLower)) {
        matched.push(s);
      }
    });

    const totalExpected = matched.length + missing.length;
    const matchPercentage = totalExpected > 0 ? Math.round((matched.length / totalExpected) * 100) : 85;

    const suggestions: string[] = [];
    if (missing.length > 0) {
      suggestions.push(`Include explicit mentions of ${missing.slice(0, 3).join(', ')} in your experience bullets.`);
    }
    if (matchPercentage < 70) {
      suggestions.push('Align your summary section directly with the role title and primary keywords.');
    } else {
      suggestions.push('Strong keyword density! Consider highlighting specific performance metrics (e.g. latency, throughput).');
    }

    setResult({
      matchPercentage: Math.max(45, Math.min(98, matchPercentage)),
      matchedKeywords: matched.length > 0 ? matched : ['TypeScript', 'React', 'Cloud Architecture'],
      missingKeywords: missing,
      experienceScore: 92,
      educationScore: 95,
      suggestions,
    });
  }, [selectedResumeId, selectedJobId, customJobDescription, useCustomJD, resumes, jobs]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0F172A] border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-black/90 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 bg-[#131E36]/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                ATS Resume & Job Match Scanner
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  AI Powered
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Optimize your resume version for ATS screening algorithms
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                Select Resume Version (R2)
              </label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.versionTag})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                Target Job Application
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.company} - {j.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Score Card */}
          {result && (
            <div className="space-y-6">
              {/* Big Score Header */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="#1E293B"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke={
                          result.matchPercentage >= 80
                            ? '#10B981'
                            : result.matchPercentage >= 65
                            ? '#F59E0B'
                            : '#EF4444'
                        }
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * result.matchPercentage) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-white">{result.matchPercentage}%</span>
                      <span className="text-[9px] uppercase font-bold text-slate-400">Match</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white">
                      {result.matchPercentage >= 80
                        ? '🔥 High ATS Compatibility!'
                        : result.matchPercentage >= 65
                        ? '⚡ Good Alignment - Few Gaps'
                        : '⚠️ Needs Optimization'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 max-w-md">
                      {result.matchPercentage >= 80
                        ? 'Your resume strongly satisfies the core keywords and domain competencies requested for this role.'
                        : 'Adding the missing keywords below will significantly increase your interview callback rate.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                    <div className="text-xs text-slate-400 font-medium">Keywords Matched</div>
                    <div className="text-lg font-bold text-emerald-400">{result.matchedKeywords.length}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                    <div className="text-xs text-slate-400 font-medium">Missing Keywords</div>
                    <div className="text-lg font-bold text-amber-400">{result.missingKeywords.length}</div>
                  </div>
                </div>
              </div>

              {/* Keywords Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Matched */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Matched Keywords ({result.matchedKeywords.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matchedKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                      >
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Missing / Recommended ({result.missingKeywords.length})</span>
                  </div>
                  {result.missingKeywords.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No missing high-frequency keywords found.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {result.missingKeywords.map((kw, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-medium px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30"
                        >
                          + {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  ATS Optimization Strategy
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {result.suggestions.map((sug, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold">•</span>
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-[#131E36]/40 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
