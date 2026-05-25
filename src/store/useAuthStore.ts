/**
 * useAuthStore
 * Enterprise demo authentication with persisted account registry,
 * strict sign-in validation, and password reset support.
 */

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export interface AuthUser {
  userId: string;
  username: string;
  email: string;
  department: string;
  role: string;
  clearanceLevel: number;
  isPrivileged: boolean;
  isContractor: boolean;
  avatarInitials: string;
}

export interface AuthAccount extends AuthUser {
  password: string;
  createdAt: string;
}

interface SignUpPayload {
  username: string;
  email: string;
  password: string;
  department: string;
  role: string;
}

interface ResetPasswordPayload {
  identifier: string;
  email: string;
  newPassword: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  accounts: AuthAccount[];
  signIn: (identifier: string, password: string) => AuthUser;
  signUp: (payload: SignUpPayload) => AuthUser;
  resetPassword: (payload: ResetPasswordPayload) => void;
  signOut: () => void;
  updateProfile: (patch: Partial<AuthUser>) => void;
}

const defaultClearance = (department: string): number => {
  if (department === 'Executive') return 5;
  if (department === 'IT Security' || department === 'IT Infrastructure') return 4;
  if (department === 'Finance') return 3;
  if (department === 'Engineering' || department === 'HR') return 2;
  return 1;
};

const initialsFrom = (username: string): string =>
  username
    .split(/[.\s_-]+/)
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase() || username.slice(0, 2).toUpperCase();

const seedAccounts: AuthAccount[] = [
  {
    userId: 'USR-DEMO-001',
    username: 'agent.smith',
    email: 'agent.smith@aegis-corp.com',
    department: 'IT Security',
    role: 'Security Analyst',
    clearanceLevel: 4,
    isPrivileged: true,
    isContractor: false,
    avatarInitials: 'AS',
    password: 'Aegis@123',
    createdAt: new Date().toISOString(),
  },
  {
    userId: 'USR-DEMO-002',
    username: 'sarah.chen',
    email: 'sarah.chen@aegis-corp.com',
    department: 'IT Security',
    role: 'SOC Lead',
    clearanceLevel: 5,
    isPrivileged: true,
    isContractor: false,
    avatarInitials: 'SC',
    password: 'Sentinel#1',
    createdAt: new Date().toISOString(),
  },
  {
    userId: 'USR-DEMO-003',
    username: 'maria.martinez',
    email: 'maria.martinez@aegis-corp.com',
    department: 'Executive',
    role: 'CTO',
    clearanceLevel: 5,
    isPrivileged: true,
    isContractor: false,
    avatarInitials: 'MM',
    password: 'Executive!5',
    createdAt: new Date().toISOString(),
  },
  {
    userId: 'USR-DEMO-004',
    username: 'alex.morgan',
    email: 'alex.morgan@aegis-corp.com',
    department: 'Engineering',
    role: 'Developer',
    clearanceLevel: 3,
    isPrivileged: false,
    isContractor: false,
    avatarInitials: 'AM',
    password: 'Builder@42',
    createdAt: new Date().toISOString(),
  },
];

const sanitizeUser = (account: AuthAccount): AuthUser => ({
  userId: account.userId,
  username: account.username,
  email: account.email,
  department: account.department,
  role: account.role,
  clearanceLevel: account.clearanceLevel,
  isPrivileged: account.isPrivileged,
  isContractor: account.isContractor,
  avatarInitials: account.avatarInitials,
});

const normalize = (value: string): string => value.trim().toLowerCase();

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        accounts: seedAccounts,

        signIn: (identifier, password) => {
          const normalizedIdentifier = normalize(identifier);
          const account = get().accounts.find(
            (candidate) =>
              normalize(candidate.username) === normalizedIdentifier ||
              normalize(candidate.email) === normalizedIdentifier,
          );

          if (!account) {
            throw new Error('ACCOUNT_NOT_FOUND');
          }

          if (account.password !== password) {
            throw new Error('INVALID_PASSWORD');
          }

          const user = sanitizeUser(account);
          const token = `aegis_jwt_${Math.random().toString(36).slice(2)}`;
          set({ user, token, isAuthenticated: true });
          return user;
        },

        signUp: (payload) => {
          const normalizedUsername = normalize(payload.username);
          const normalizedEmail = normalize(payload.email);

          const exists = get().accounts.some(
            (account) =>
              normalize(account.username) === normalizedUsername ||
              normalize(account.email) === normalizedEmail,
          );

          if (exists) {
            throw new Error('ACCOUNT_EXISTS');
          }

          const account: AuthAccount = {
            userId: `USR-${Date.now().toString(36).toUpperCase()}`,
            username: payload.username.trim(),
            email: payload.email.trim(),
            department: payload.department,
            role: payload.role,
            clearanceLevel: defaultClearance(payload.department),
            isPrivileged: payload.department === 'Executive' || payload.department === 'IT Security',
            isContractor: false,
            avatarInitials: initialsFrom(payload.username),
            password: payload.password,
            createdAt: new Date().toISOString(),
          };

          const token = `aegis_jwt_${Math.random().toString(36).slice(2)}`;
          set((state) => ({
            accounts: [account, ...state.accounts],
            user: sanitizeUser(account),
            token,
            isAuthenticated: true,
          }));

          return sanitizeUser(account);
        },

        resetPassword: ({ identifier, email, newPassword }) => {
          const normalizedIdentifier = normalize(identifier);
          const normalizedEmail = normalize(email);

          const account = get().accounts.find(
            (candidate) =>
              (normalize(candidate.username) === normalizedIdentifier || normalize(candidate.email) === normalizedIdentifier) &&
              normalize(candidate.email) === normalizedEmail,
          );

          if (!account) {
            throw new Error('RESET_ACCOUNT_NOT_FOUND');
          }

          set((state) => ({
            accounts: state.accounts.map((candidate) =>
              candidate.userId === account.userId
                ? { ...candidate, password: newPassword }
                : candidate,
            ),
          }));
        },

        signOut: () => {
          set({ user: null, token: null, isAuthenticated: false });
          window.location.href = '/login';
        },

        updateProfile: (patch) => {
          const current = get().user;
          if (!current) return;

          const updatedUser = { ...current, ...patch };
          set((state) => ({
            user: updatedUser,
            accounts: state.accounts.map((account) =>
              account.userId === current.userId ? { ...account, ...patch } : account,
            ),
          }));
        },
      }),
      {
        name: 'aegis-auth-store',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
          accounts: state.accounts,
        }),
      },
    ),
    { name: 'AuthStore' },
  ),
);
