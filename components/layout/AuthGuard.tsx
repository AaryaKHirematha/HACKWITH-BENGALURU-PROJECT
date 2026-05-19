/**
 * AuthGuard
 * Redirects unauthenticated viewers to /login
 */

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import type { ReactNode } from 'react';

export function AuthGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
