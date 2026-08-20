'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  BarChart3,
  Users,
  Database,
  Briefcase,
  Sparkles,
  RotateCcw,
  Cloud,
} from 'lucide-react';
import { StorageEngine } from '@/lib/storage';

interface SidebarProps {
  onOpenSettings?: () => void;
  onOpenAddJob?: () => void;
}

export function Sidebar({ onOpenSettings }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Kanban Board',
      href: '/',
      icon: LayoutDashboard,
      badge: 'Live DND',
    },
    {
      name: 'Resume Vault',
      href: '/resumes',
      icon: FileText,
      badge: 'R2 Storage',
    },
    {
      name: 'Interview Prep',
      href: '/interviews',
      icon: Calendar,
      badge: 'Rounds',
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      name: 'Recruiter CRM',
      href: '/contacts',
      icon: Users,
      badge: null,
    },
  ];

  const handleResetData = () => {
    if (confirm('Clear all local application data? This will reset the workspace.')) {
      StorageEngine.resetToSampleData();
      window.location.reload();
    }
  };

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-[#0B1120] flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-blue-400 transition-colors">
                CareerVault
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Job & Resume Hub</p>
          </div>
        </Link>
      </div>

      {/* Cloudflare Status Tag */}
      <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-amber-400" />
            Cloudflare Ready
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>D1 SQL: <strong className="text-emerald-400">Bound</strong></span>
          <span>R2: <strong className="text-blue-400">Active</strong></span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-4 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Infrastructure
        </div>

        <button
          onClick={onOpenSettings}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all duration-150 text-left"
        >
          <div className="flex items-center gap-3">
            <Database className="w-4 h-4 text-slate-400" />
            <span>Cloudflare D1 & R2</span>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
            Config
          </span>
        </button>
      </nav>

      {/* Footer Utility Actions */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <button
          onClick={handleResetData}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800/50 transition-colors"
          title="Clear all stored data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear All Data
        </button>
        <div className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          CareerVault Next.js & D1/R2
        </div>
      </div>
    </aside>
  );
}
