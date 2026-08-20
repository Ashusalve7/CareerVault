'use client';

import React, { useState, useEffect } from 'react';
import { AuthEngine, UserAccount } from '@/lib/auth';
import {
  X,
  UserPlus,
  LogIn,
  Users,
  ShieldCheck,
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'signin' | 'signup' | 'switch';
}

export function AuthModal({ isOpen, onClose, initialTab = 'signup' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'switch'>(initialTab);
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [avatarColor, setAvatarColor] = useState('#3B82F6');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const avatarColors = AuthEngine.getAvatarColors();

  const loadData = () => {
    setAccounts(AuthEngine.getAccounts());
    setCurrentUser(AuthEngine.getCurrentUser());
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
      setErrorMsg(null);
      setSuccessMsg(null);
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const res = AuthEngine.createAccount({
      name: name.trim(),
      email: email.trim(),
      password: password || undefined,
      roleTitle: roleTitle.trim() || 'Software Engineer',
      avatarColor,
    });

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to create account.');
      return;
    }

    setSuccessMsg(`Welcome, ${res.user?.name}! Your private workspace is ready.`);
    setName('');
    setEmail('');
    setPassword('');
    setRoleTitle('');
    loadData();

    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your email.');
      return;
    }

    const res = AuthEngine.signIn(email.trim(), password || undefined);
    if (!res.success) {
      setErrorMsg(res.error || 'Sign in failed.');
      return;
    }

    setSuccessMsg(`Welcome back, ${res.user?.name}!`);
    setEmail('');
    setPassword('');
    loadData();

    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleSwitchAccount = (userId: string) => {
    AuthEngine.switchAccount(userId);
    loadData();
    onClose();
  };

  const handleDeleteAccount = (userId: string, accountName: string) => {
    if (confirm(`Are you sure you want to delete ${accountName}'s account and private data?`)) {
      AuthEngine.deleteAccount(userId);
      loadData();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0D1527] border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl shadow-black/90 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 bg-[#111C35]/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                CareerVault Identity
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Isolated Workspaces
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Multi-account management with strict data privacy
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigator */}
        <div className="flex border-b border-slate-800/80 bg-[#0B1120] p-1.5 gap-1 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'signup'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Create Account
          </button>
          <button
            onClick={() => {
              setActiveTab('signin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'signin'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('switch');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'switch'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Accounts ({accounts.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <span className="font-bold">Error:</span> {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              {successMsg}
            </div>
          )}

          {/* TAB 1: CREATE ACCOUNT */}
          {activeTab === 'signup' && (
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ashish Salve"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. ashish@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  Target Role / Career Focus
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fullstack Engineer / Cloud Architect"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Password <span className="text-slate-500 text-[10px]">(Optional for local lock)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password or leave blank"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Avatar Color Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Profile Avatar Color
                </label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {avatarColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setAvatarColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-7 h-7 rounded-xl transition-all ${
                        avatarColor === color
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0D1527] scale-110'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                  <UserPlus className="w-4 h-4" />
                  Create Private Account
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SIGN IN */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  Account Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password (if set)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In to Workspace
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SWITCH PROFILES / MANAGE ACCOUNTS */}
          {activeTab === 'switch' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400">
                Select an account to load its isolated applications, resumes, and contacts:
              </div>

              <div className="space-y-2.5">
                {accounts.map((acc) => {
                  const isActive = currentUser?.id === acc.id;
                  return (
                    <div
                      key={acc.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                        isActive
                          ? 'bg-blue-600/10 border-blue-500/50 shadow-md shadow-blue-500/10'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          style={{ backgroundColor: acc.avatarColor }}
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md"
                        >
                          {acc.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{acc.name}</span>
                            {isActive && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">{acc.email}</p>
                          <p className="text-[10px] text-slate-500">{acc.roleTitle || 'Software Engineer'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isActive ? (
                          <button
                            onClick={() => handleSwitchAccount(acc.id)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                          >
                            Switch
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Current
                          </span>
                        )}

                        {accounts.length > 1 && (
                          <button
                            onClick={() => handleDeleteAccount(acc.id, acc.name)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete this profile and its data"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('signup')}
                  className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5 text-blue-400" />
                  Add Another Account
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0B1120] text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          Each account operates in a 100% private sandbox.
        </div>
      </div>
    </div>
  );
}
