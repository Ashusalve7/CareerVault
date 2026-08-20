'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  FileUp,
  SlidersHorizontal,
  CloudLightning,
  Sparkles,
  Briefcase,
  User,
} from 'lucide-react';
import { AuthEngine, UserAccount, AUTH_SYNC_EVENT } from '@/lib/auth';

interface NavbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedPriority: string;
  onPriorityChange: (priority: string) => void;
  selectedLocationType: string;
  onLocationTypeChange: (type: string) => void;
  onOpenAddJob: () => void;
  onOpenUploadResume?: () => void;
  onOpenCloudflareModal: () => void;
  onOpenAuth?: (tab?: 'signin' | 'signup' | 'switch') => void;
  totalJobsCount?: number;
  activeInterviewsCount?: number;
}

export function Navbar({
  searchTerm,
  onSearchChange,
  selectedPriority,
  onPriorityChange,
  selectedLocationType,
  onLocationTypeChange,
  onOpenAddJob,
  onOpenUploadResume,
  onOpenCloudflareModal,
  onOpenAuth,
  totalJobsCount = 0,
  activeInterviewsCount = 0,
}: NavbarProps) {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  useEffect(() => {
    setCurrentUser(AuthEngine.getCurrentUser());

    const handleAuthSync = () => {
      setCurrentUser(AuthEngine.getCurrentUser());
    };

    window.addEventListener(AUTH_SYNC_EVENT, handleAuthSync);
    return () => window.removeEventListener(AUTH_SYNC_EVENT, handleAuthSync);
  }, []);
  return (
    <header className="h-18 border-b border-slate-800/80 bg-[#0B1120]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 gap-4">
      {/* Search and Filters */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search applications, companies, skills, tags..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => onPriorityChange('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              selectedPriority === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onPriorityChange('high')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              selectedPriority === 'high'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            High Priority
          </button>
        </div>

        {/* Location Type Filter */}
        <select
          value={selectedLocationType}
          onChange={(e) => onLocationTypeChange(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="all">All Locations</option>
          <option value="remote">Remote Only</option>
          <option value="hybrid">Hybrid</option>
          <option value="onsite">On-site</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Cloudflare Connection Tag */}
        <button
          onClick={onOpenCloudflareModal}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-medium transition-colors"
          title="Cloudflare D1 & R2 Setup"
        >
          <CloudLightning className="w-3.5 h-3.5 text-amber-400" />
          <span>Cloudflare D1 + R2</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        </button>

        {onOpenUploadResume && (
          <button
            onClick={onOpenUploadResume}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <FileUp className="w-3.5 h-3.5 text-indigo-400" />
            <span>Upload Resume</span>
          </button>
        )}

        <button
          onClick={onOpenAddJob}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application</span>
        </button>

        {/* User Account Badge Button */}
        <button
          onClick={() => onOpenAuth && onOpenAuth('switch')}
          className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all group"
          title="Manage user profiles / Switch account"
        >
          <div
            style={{ backgroundColor: currentUser?.avatarColor || '#3B82F6' }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm"
          >
            {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400 leading-tight">
              {currentUser?.name || 'Account'}
            </div>
            <div className="text-[10px] text-slate-500 leading-tight">
              Switch
            </div>
          </div>
        </button>
      </div>
    </header>
  );
}
