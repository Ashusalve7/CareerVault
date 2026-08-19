'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  Clock,
  MoreVertical,
  CheckCircle2,
  Flame,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { JobApplication, ApplicationStatus } from '@/lib/types';
import { PIPELINE_COLUMNS } from '@/lib/sample-data';

interface JobCardProps {
  job: JobApplication;
  onOpenDetails: (job: JobApplication) => void;
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
  onDelete: (id: string) => void;
  isOverlay?: boolean;
}

export function JobCard({
  job,
  onOpenDetails,
  onStatusChange,
  onDelete,
  isOverlay = false,
}: JobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: job.id,
    data: {
      type: 'Job',
      job,
    },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <Flame className="w-3 h-3 text-rose-400 fill-rose-400/30" />
            HIGH
          </span>
        );
      case 'medium':
        return (
          <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 border border-slate-700">
            LOW
          </span>
        );
    }
  };

  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return null;
    const formatK = (n: number) => `$${Math.round(n / 1000)}k`;
    if (job.salaryMin && job.salaryMax) {
      return `${formatK(job.salaryMin)} - ${formatK(job.salaryMax)}`;
    }
    return job.salaryMin ? `${formatK(job.salaryMin)}+` : `Up to ${formatK(job.salaryMax!)}`;
  };

  const activeRounds = job.interviewRounds || [];
  const nextScheduledRound = activeRounds.find(r => r.status === 'scheduled');
  const latestPassedRound = [...activeRounds].reverse().find(r => r.status === 'passed');

  const getCompanyInitial = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpenDetails(job)}
      className={`glass-card rounded-2xl p-4 cursor-grab active:cursor-grabbing group relative select-none ${
        isDragging ? 'dnd-dragging opacity-30 border-blue-500' : ''
      } ${
        job.status === 'offer'
          ? 'border-emerald-500/40 hover:border-emerald-400/80 bg-emerald-950/20'
          : job.status === 'accepted'
          ? 'border-green-500/50 hover:border-green-400 bg-green-950/20'
          : ''
      }`}
    >
      {/* Top Bar: Company Initial Badge + Company Name + Priority */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-inner flex-shrink-0"
            style={{
              backgroundColor: job.color || '#3B82F6',
              boxShadow: `0 4px 12px ${job.color || '#3B82F6'}40`,
            }}
          >
            {getCompanyInitial(job.company)}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-100 text-sm truncate group-hover:text-blue-400 transition-colors">
              {job.company}
            </h4>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="capitalize">{job.locationType}</span>
              {job.location && (
                <>
                  <span>•</span>
                  <span className="truncate max-w-[110px]">{job.location}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div>{getPriorityBadge(job.priority)}</div>
      </div>

      {/* Role Title */}
      <h5 className="font-semibold text-slate-200 text-sm mb-3 line-clamp-2 leading-snug">
        {job.title}
      </h5>

      {/* Highlights & Tags */}
      <div className="space-y-2 mb-3">
        {/* Salary */}
        {formatSalary() && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <DollarSign className="w-3.5 h-3.5" />
            <span>{formatSalary()} / yr</span>
          </div>
        )}

        {/* Next/Latest Interview Round indicator */}
        {job.status === 'interviewing' && nextScheduledRound && (
          <div className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
            <div className="truncate">
              <span className="font-semibold">Next: </span>
              {nextScheduledRound.title}
            </div>
          </div>
        )}

        {job.status === 'offer' && (
          <div className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Offer in hand! Reviewing terms</span>
          </div>
        )}
      </div>

      {/* Tags preview */}
      {job.tags && job.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {job.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60"
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 3 && (
            <span className="text-[10px] text-slate-500 font-medium px-1">
              +{job.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Bottom Bar: Resume Version Pill + Checklist Status + Stage quick action */}
      <div className="pt-2.5 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 truncate max-w-[140px]">
          {job.resumeVersionName ? (
            <span className="flex items-center gap-1 text-slate-400 font-medium truncate" title={`Attached: ${job.resumeVersionName}`}>
              <FileText className="w-3 h-3 text-blue-400 flex-shrink-0" />
              <span className="truncate">{job.resumeVersionName.split('-')[0]}</span>
            </span>
          ) : (
            <span className="text-slate-400">No resume attached</span>
          )}
        </div>

        {/* Checklist Progress */}
        {job.checklist && job.checklist.length > 0 && (
          <div className="flex items-center gap-1 text-slate-400">
            <CheckCircle2 className="w-3 h-3 text-slate-400" />
            <span>
              {job.checklist.filter(c => c.completed).length}/{job.checklist.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
