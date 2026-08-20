'use client';

import React from 'react';
import { X, FileText, Download, Cloud, ExternalLink, Tag, Briefcase } from 'lucide-react';
import { ResumeItem, JobApplication } from '@/lib/types';

interface ResumePreviewModalProps {
  resume: ResumeItem | null;
  jobs: JobApplication[];
  isOpen: boolean;
  onClose: () => void;
}

export function ResumePreviewModal({ resume, jobs, isOpen, onClose }: ResumePreviewModalProps) {
  if (!isOpen || !resume) return null;

  const linkedJobs = jobs.filter((j) => j.resumeId === resume.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0F172A] border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl shadow-black/90 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 bg-[#131E36]/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {resume.name}
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {resume.versionTag}
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {resume.fileName} • {(resume.fileSize / 1024).toFixed(1)} KB • Stored in Secure Vault
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
          {/* Summary */}
          {resume.summary && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 mb-1">Executive Summary</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{resume.summary}</p>
            </div>
          )}

          {/* Snippet / Content Preview */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
              <span>Resume Text & Key Extraction</span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                Vault Ready
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap border border-slate-800/60">
              {resume.contentSnippet || 'Resume content synced to secure vault.'}
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              Categorized Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((s, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-3 py-1 rounded-xl bg-indigo-950/40 text-indigo-300 border border-indigo-800/40"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Linked Applications */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-400" />
              Linked Job Applications ({linkedJobs.length})
            </h4>
            {linkedJobs.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                No jobs currently linked to this version.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {linkedJobs.map((j) => (
                  <div
                    key={j.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">{j.company}</h5>
                      <p className="text-[11px] text-slate-400">{j.title}</p>
                    </div>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {j.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-[#131E36]/40 flex items-center justify-between text-xs text-slate-400">
          <span>Key: {resume.r2Key}</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
