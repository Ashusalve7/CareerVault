'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { CloudflareSettingsModal } from '@/components/settings/CloudflareSettingsModal';
import { StorageEngine } from '@/lib/storage';
import { RecruiterContact, JobApplication } from '@/lib/types';
import {
  Users,
  Plus,
  Mail,
  Phone,
  Globe,
  Building2,
  Trash2,
  Edit2,
  X,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<RecruiterContact[]>([]);
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isCloudflareModalOpen, setIsCloudflareModalOpen] = useState(false);

  // New Contact form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const loadData = () => {
      setContacts(StorageEngine.getContacts());
      setJobs(StorageEngine.getJobs());
    };
    loadData();
    const handleSync = () => loadData();
    window.addEventListener('careervault_storage_sync', handleSync);
    return () => window.removeEventListener('careervault_storage_sync', handleSync);
  }, []);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim() || !email.trim()) return;

    StorageEngine.addContact({
      name: name.trim(),
      role: role.trim() || 'Recruiter',
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      linkedIn: linkedin.trim() || undefined,
      notes: notes.trim() || undefined,
      associatedJobIds: [],
    });

    setContacts(StorageEngine.getContacts());
    setIsAddContactOpen(false);
    setName('');
    setCompany('');
    setRole('');
    setEmail('');
    setPhone('');
    setLinkedin('');
    setNotes('');
  };

  const handleDeleteContact = (id: string) => {
    if (confirm('Delete this recruiter contact?')) {
      StorageEngine.deleteContact(id);
      setContacts(StorageEngine.getContacts());
    }
  };

  const filteredContacts = contacts.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex min-h-screen bg-[#090D16] text-slate-100 antialiased">
      <Sidebar onOpenSettings={() => setIsCloudflareModalOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedPriority="all"
          onPriorityChange={() => {}}
          selectedLocationType="all"
          onLocationTypeChange={() => {}}
          onOpenAddJob={() => {}}
          onOpenCloudflareModal={() => setIsCloudflareModalOpen(true)}
          totalJobsCount={jobs.length}
        />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-blue-950/40 to-slate-900 border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  Talent Directory & CRM
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Recruiters & Hiring Managers
              </h1>
              <p className="text-sm text-slate-300">
                Maintain relationship notes, direct reach-out emails, and conversation logs with talent partners.
              </p>
            </div>

            <button
              onClick={() => setIsAddContactOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Recruiter</span>
            </button>
          </div>

          {/* Contacts Grid */}
          {filteredContacts.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30 space-y-3">
              <Users className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-200">No Recruiter Contacts Saved</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Keep track of talent acquisition partners, engineering managers, and referral contacts by clicking &quot;Add Recruiter&quot;.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-sm">
                          {contact.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">{contact.name}</h4>
                          <p className="text-xs text-slate-400">
                            {contact.role} • <strong className="text-blue-400">{contact.company}</strong>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                        <Mail className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <a href={`mailto:${contact.email}`} className="text-blue-400 hover:underline truncate">
                          {contact.email}
                        </a>
                      </div>

                      {contact.phone && (
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                          <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span>{contact.phone}</span>
                        </div>
                      )}

                      {contact.linkedIn && (
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                          <Globe className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                          <a
                            href={contact.linkedIn}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:underline truncate"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      )}

                      {contact.notes && (
                        <p className="text-xs text-slate-400 p-3 rounded-xl bg-slate-900/40 border border-slate-800/40 italic">
                          &quot;{contact.notes}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>Added {new Date(contact.createdAt).toLocaleDateString()}</span>
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 font-semibold transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Contact</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add Contact Modal */}
      {isAddContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 bg-[#131E36]/60 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Add Recruiter / Talent Contact</h3>
              <button onClick={() => setIsAddContactOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stripe"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Role Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Technical Recruiter"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sarah@stripe.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. +1 (415) 555-0192"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">LinkedIn URL</label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/..."
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Relationship Notes</label>
                <textarea
                  placeholder="e.g. Connected via mutual teammate on LinkedIn. Recruiter for Edge compute team."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddContactOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Save Recruiter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CloudflareSettingsModal
        isOpen={isCloudflareModalOpen}
        onClose={() => setIsCloudflareModalOpen(false)}
        jobsCount={jobs.length}
        resumesCount={0}
      />
    </div>
  );
}
