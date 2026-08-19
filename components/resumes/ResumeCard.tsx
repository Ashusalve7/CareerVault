'use client';

import React from 'react';
import {
  FileText,
  Download,
  Eye,
  Trash2,
  Sparkles,
  Link as LinkIcon,
  Tag,
  Clock,
  HardDrive,
} from 'lucide-react';
import { ResumeItem } from '@/lib/types';

interface ResumeCardProps {
  resume: ResumeItem;
  onPreview: (resume: ResumeItem) => void;
  onDelete: (id: string) => void;
  onOpenATSMatcher: (resume: ResumeItem) => void;
}

export function ResumeCard({
  resume,
  onPreview,
  onDelete,
  onOpenATSMatcher,
}: ResumeCardProps) {
  const formatFileSize = (bytes: number) => {
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const handleDownload = () => {
    // Generate simulated downloadable file
    const element = document.createElement('a');
    const file = new Blob([
      `CareerVault Resume Export\n\nTitle: ${resume.name}\nVersion: ${resume.versionTag}\nSkills: ${resume.skills.join(', ')}\n\n${resume.summary || ''}\n\n${resume.contentSnippet || ''}`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = resume.fileName.replace(/\.pdf$/, '.txt');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="glass-card rounded-3xl p-6 relative group flex flex-col justify-between space-y-4 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-200">
      {/* Top Section */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-base group-hover:text-indigo-400 transition-colors">
                {resume.name}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {resume.versionTag}
                </span>
                {resume.isDefault && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    DEFAULT
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (confirm(`Delete resume version "${resume.name}"?`)) {
                onDelete(resume.id);
              }
            }}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
            title="Delete Resume"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Metadata info */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800/50 mb-3">
          <div className="flex items-center gap-1.5 truncate">
            <HardDrive className="w-3 h-3 text-slate-400" />
            <span>R2: {formatFileSize(resume.fileSize)}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <LinkIcon className="w-3 h-3 text-blue-400" />
            <span>{resume.linkedJobsCount || 0} Linked Applications</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2 text-slate-400 truncate">
            <Clock className="w-3 h-3" />
            <span>Uploaded {new Date(resume.uploadDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Target Roles */}
        {resume.targetRoles && resume.targetRoles.length > 0 && (
          <div className="mb-3">
            <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
              <Tag className="w-3 h-3 text-indigo-400" />
              Target Roles:
            </div>
            <div className="flex flex-wrap gap-1">
              {resume.targetRoles.map((role, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skills preview */}
        {resume.skills && resume.skills.length > 0 && (
          <div>
            <div className="text-[11px] font-semibold text-slate-400 mb-1.5">Parsed Skills:</div>
            <div className="flex flex-wrap gap-1">
              {resume.skills.slice(0, 6).map((skill, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-indigo-950/40 text-indigo-300 border border-indigo-800/40"
                >
                  {skill}
                </span>
              ))}
              {resume.skills.length > 6 && (
                <span className="text-[10px] text-slate-400 px-1.5 py-0.5">
                  +{resume.skills.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
        <button
          onClick={() => onOpenATSMatcher(resume)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-all"
          title="Compare with Job Description"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>ATS Matcher</span>
        </button>

        <button
          onClick={() => onPreview(resume)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
          title="Preview Resume"
        >
          <Eye className="w-4 h-4" />
        </button>

        <button
          onClick={handleDownload}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
          title="Download from Cloudflare R2"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
