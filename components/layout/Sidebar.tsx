'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  BarChart3,
  Users,
  Briefcase,
  Sparkles,
  RotateCcw,
  ChevronDown,
  UserPlus,
} from 'lucide-react';
import { StorageEngine } from '@/lib/storage';
import { AuthEngine, UserAccount, AUTH_SYNC_EVENT } from '@/lib/auth';

interface SidebarProps {
  onOpenAddJob?: () => void;
  onOpenAuth?: (tab?: 'signin' | 'signup' | 'switch') => void;
}

export function Sidebar({ onOpenAuth }: SidebarProps) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  useEffect(() => {
    setCurrentUser(AuthEngine.getCurrentUser());

    const handleAuthSync = () => {
      setCurrentUser(AuthEngine.getCurrentUser());
    };

    window.addEventListener(AUTH_SYNC_EVENT, handleAuthSync);
    return () => window.removeEventListener(AUTH_SYNC_EVENT, handleAuthSync);
  }, []);

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
      badge: 'PDF Vault',
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
            <p className="text-xs text-slate-400 font-medium">Career & Resume Hub</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
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
      </nav>

      {/* Active User Profile Widget */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0B1120] space-y-2">
        <button
          onClick={() => onOpenAuth && onOpenAuth('switch')}
          className="w-full p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between text-left transition-all group"
          title="Click to switch or create accounts"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              style={{ backgroundColor: currentUser?.avatarColor || '#3B82F6' }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0"
            >
              {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-200 truncate group-hover:text-blue-400 transition-colors">
                {currentUser?.name || 'Personal Account'}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {currentUser?.email || 'user@careervault.dev'}
              </div>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 shrink-0" />
        </button>

        <div className="flex items-center gap-1.5 pt-1">
          <button
            onClick={() => onOpenAuth && onOpenAuth('signup')}
            className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg text-[11px] font-medium border border-slate-800 flex items-center justify-center gap-1 transition-colors"
          >
            <UserPlus className="w-3 h-3 text-blue-400" />
            New Account
          </button>
          <button
            onClick={handleResetData}
            className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg text-[11px] font-medium border border-slate-800 flex items-center justify-center transition-colors"
            title="Clear active account data"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
}
