'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, MoreHorizontal } from 'lucide-react';
import { ApplicationStatus, JobApplication } from '@/lib/types';
import { JobCard } from './JobCard';

interface ColumnProps {
  id: ApplicationStatus;
  title: string;
  color: string;
  badgeBg: string;
  description: string;
  jobs: JobApplication[];
  onOpenDetails: (job: JobApplication) => void;
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
  onDelete: (id: string) => void;
  onQuickAdd: (status: ApplicationStatus) => void;
}

export function Column({
  id,
  title,
  color,
  badgeBg,
  description,
  jobs,
  onOpenDetails,
  onStatusChange,
  onDelete,
  onQuickAdd,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'Column',
      columnId: id,
    },
  });

  const jobIds = jobs.map((j) => j.id);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-80 min-w-[320px] max-w-[320px] h-full rounded-2xl bg-[#0F172A]/70 border transition-colors duration-200 ${
        isOver
          ? 'border-blue-500/80 bg-blue-950/20 shadow-lg shadow-blue-500/10'
          : 'border-slate-800/80'
      }`}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${color}`} />
          <h3 className="font-bold text-sm text-slate-100">{title}</h3>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${badgeBg}`}
          >
            {jobs.length}
          </span>
        </div>

        <button
          onClick={() => onQuickAdd(id)}
          className="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 flex items-center justify-center transition-colors"
          title={`Add job to ${title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Cards List with Drag Context */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[400px]">
        <SortableContext items={jobIds} strategy={verticalListSortingStrategy}>
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onOpenDetails={onOpenDetails}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>

        {/* Empty State / Drop Hint */}
        {jobs.length === 0 && (
          <div
            onClick={() => onQuickAdd(id)}
            className="h-32 border-2 border-dashed border-slate-800/80 hover:border-slate-700 rounded-2xl flex flex-col items-center justify-center p-4 text-center cursor-pointer group transition-colors"
          >
            <p className="text-xs text-slate-400 font-medium group-hover:text-slate-400">
              Drag applications here
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              or click to add one
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
