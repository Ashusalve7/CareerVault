'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import confetti from 'canvas-confetti';
import { ApplicationStatus, JobApplication } from '@/lib/types';
import { PIPELINE_COLUMNS } from '@/lib/sample-data';
import { Column } from './Column';
import { JobCard } from './JobCard';

interface BoardProps {
  jobs: JobApplication[];
  onUpdateJobs: (jobs: JobApplication[]) => void;
  onOpenDetails: (job: JobApplication) => void;
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
  onDelete: (id: string) => void;
  onQuickAdd: (status: ApplicationStatus) => void;
}

export function Board({
  jobs,
  onUpdateJobs,
  onOpenDetails,
  onStatusChange,
  onDelete,
  onQuickAdd,
}: BoardProps) {
  const [activeJob, setActiveJob] = useState<JobApplication | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px drag distance prevents accidental drag during click
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'],
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const job = jobs.find((j) => j.id === active.id);
    if (job) {
      setActiveJob(job);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeJobItem = jobs.find((j) => j.id === activeId);
    if (!activeJobItem) return;

    // Check if over a column directly
    const isOverColumn = PIPELINE_COLUMNS.some((col) => col.id === overId);
    if (isOverColumn) {
      const targetColumn = overId as ApplicationStatus;
      if (activeJobItem.status !== targetColumn) {
        const updated = jobs.map((j) =>
          j.id === activeId ? { ...j, status: targetColumn } : j
        );
        onUpdateJobs(updated);
      }
      return;
    }

    // Over another job card in a different or same column
    const overJobItem = jobs.find((j) => j.id === overId);
    if (overJobItem && activeJobItem.status !== overJobItem.status) {
      const updated = jobs.map((j) =>
        j.id === activeId ? { ...j, status: overJobItem.status } : j
      );
      onUpdateJobs(updated);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveJob(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeJobItem = jobs.find((j) => j.id === activeId);
    if (!activeJobItem) return;

    // If dropped on column
    const isOverColumn = PIPELINE_COLUMNS.some((col) => col.id === overId);
    if (isOverColumn) {
      const newStatus = overId as ApplicationStatus;
      if (newStatus === 'offer' || newStatus === 'accepted') {
        triggerCelebration();
      }
      return;
    }

    // Reorder inside the same or target column
    const overJobItem = jobs.find((j) => j.id === overId);
    if (overJobItem) {
      const oldIndex = jobs.findIndex((j) => j.id === activeId);
      const newIndex = jobs.findIndex((j) => j.id === overId);

      if (oldIndex !== newIndex) {
        const reordered = arrayMove(jobs, oldIndex, newIndex);
        onUpdateJobs(reordered);
      }

      if (overJobItem.status === 'offer' || overJobItem.status === 'accepted') {
        triggerCelebration();
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-6 overflow-x-auto h-[calc(100vh-4.5rem)] select-none">
        {PIPELINE_COLUMNS.map((col) => {
          const colJobs = jobs.filter((j) => j.status === col.id);
          return (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              color={col.color}
              badgeBg={col.badgeBg}
              description={col.description}
              jobs={colJobs}
              onOpenDetails={onOpenDetails}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              onQuickAdd={onQuickAdd}
            />
          );
        })}
      </div>

      {/* Active Drag Overlay */}
      <DragOverlay>
        {activeJob ? (
          <div className="w-76 rotate-2 scale-105 opacity-95 pointer-events-none shadow-2xl shadow-blue-500/20">
            <JobCard
              job={activeJob}
              onOpenDetails={() => {}}
              onStatusChange={() => {}}
              onDelete={() => {}}
              isOverlay={true}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
