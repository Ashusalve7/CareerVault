'use client';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  roleTitle?: string;
  avatarColor: string;
  createdAt: string;
}

const USERS_KEY = 'careervault_accounts_v1';
const CURRENT_USER_KEY = 'careervault_active_user_id_v1';
export const AUTH_SYNC_EVENT = 'careervault_auth_sync';

const AVATAR_COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
  '#EF4444', // Rose
];

export class AuthEngine {
  private static isClient(): boolean {
    return typeof window !== 'undefined';
  }

  public static getAvatarColors(): string[] {
    return AVATAR_COLORS;
  }

  // Get all registered accounts on this browser
  public static getAccounts(): UserAccount[] {
    if (!this.isClient()) return [];
    try {
      const stored = localStorage.getItem(USERS_KEY);
      if (!stored) {
        // Initialize with default initial account
        const defaultUser: UserAccount = {
          id: 'user-default',
          name: 'Personal Account',
          email: 'user@careervault.dev',
          roleTitle: 'Software Engineer',
          avatarColor: '#3B82F6',
          createdAt: new Date().toISOString(),
        };
        this.saveAccounts([defaultUser]);
        this.setActiveUserId(defaultUser.id);
        return [defaultUser];
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading accounts from storage:', e);
      return [];
    }
  }

  public static saveAccounts(accounts: UserAccount[]): void {
    if (!this.isClient()) return;
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('Error saving accounts:', e);
    }
  }

  // Active User ID
  public static getActiveUserId(): string {
    if (!this.isClient()) return 'user-default';
    const id = localStorage.getItem(CURRENT_USER_KEY);
    if (id) return id;

    const accounts = this.getAccounts();
    if (accounts.length > 0) {
      this.setActiveUserId(accounts[0].id);
      return accounts[0].id;
    }
    return 'user-default';
  }

  public static setActiveUserId(id: string): void {
    if (!this.isClient()) return;
    localStorage.setItem(CURRENT_USER_KEY, id);
    window.dispatchEvent(new CustomEvent(AUTH_SYNC_EVENT, { detail: { userId: id } }));
  }

  // Get currently active logged in user
  public static getCurrentUser(): UserAccount {
    const accounts = this.getAccounts();
    const activeId = this.getActiveUserId();
    const found = accounts.find((a) => a.id === activeId);
    if (found) return found;

    if (accounts.length > 0) {
      this.setActiveUserId(accounts[0].id);
      return accounts[0];
    }

    // Fallback if empty
    const fallback: UserAccount = {
      id: `user-${Date.now()}`,
      name: 'Default User',
      email: 'user@careervault.dev',
      roleTitle: 'Software Engineer',
      avatarColor: '#3B82F6',
      createdAt: new Date().toISOString(),
    };
    this.saveAccounts([fallback]);
    this.setActiveUserId(fallback.id);
    return fallback;
  }

  // Create a new account
  public static createAccount(data: {
    name: string;
    email: string;
    password?: string;
    roleTitle?: string;
    avatarColor?: string;
  }): { success: boolean; user?: UserAccount; error?: string } {
    if (!this.isClient()) return { success: false, error: 'Client only' };

    const accounts = this.getAccounts();
    const trimmedEmail = data.email.trim().toLowerCase();

    // Check if email already exists
    if (accounts.some((a) => a.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const randomColor =
      data.avatarColor || AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    const newUser: UserAccount = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: data.name.trim(),
      email: trimmedEmail,
      password: data.password || undefined,
      roleTitle: data.roleTitle?.trim() || 'Software Engineer',
      avatarColor: randomColor,
      createdAt: new Date().toISOString(),
    };

    accounts.push(newUser);
    this.saveAccounts(accounts);
    this.setActiveUserId(newUser.id);

    return { success: true, user: newUser };
  }

  // Sign into existing account
  public static signIn(
    email: string,
    password?: string
  ): { success: boolean; user?: UserAccount; error?: string } {
    if (!this.isClient()) return { success: false, error: 'Client only' };

    const accounts = this.getAccounts();
    const trimmedEmail = email.trim().toLowerCase();
    const user = accounts.find((a) => a.email.toLowerCase() === trimmedEmail);

    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (user.password && password && user.password !== password) {
      return { success: false, error: 'Invalid password. Please check your credentials.' };
    }

    this.setActiveUserId(user.id);
    return { success: true, user };
  }

  // Switch to another account
  public static switchAccount(userId: string): boolean {
    const accounts = this.getAccounts();
    const found = accounts.find((a) => a.id === userId);
    if (!found) return false;

    this.setActiveUserId(found.id);
    return true;
  }

  // Delete an account and its scoped data
  public static deleteAccount(userId: string): boolean {
    if (!this.isClient()) return false;
    let accounts = this.getAccounts();
    accounts = accounts.filter((a) => a.id !== userId);

    if (accounts.length === 0) {
      // Re-create default if all deleted
      const defaultUser: UserAccount = {
        id: `user-${Date.now()}`,
        name: 'Personal Account',
        email: 'user@careervault.dev',
        roleTitle: 'Software Engineer',
        avatarColor: '#3B82F6',
        createdAt: new Date().toISOString(),
      };
      accounts = [defaultUser];
    }

    this.saveAccounts(accounts);

    // Clean up isolated storage keys for this user
    try {
      localStorage.removeItem(`careervault_jobs_${userId}`);
      localStorage.removeItem(`careervault_resumes_${userId}`);
      localStorage.removeItem(`careervault_contacts_${userId}`);
    } catch (e) {
      console.error('Error cleaning deleted user keys:', e);
    }

    this.setActiveUserId(accounts[0].id);
    return true;
  }

  // Sign out
  public static signOut(): void {
    if (!this.isClient()) return;
    const accounts = this.getAccounts();
    if (accounts.length > 0) {
      this.setActiveUserId(accounts[0].id);
    }
  }
}
