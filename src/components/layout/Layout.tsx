/**
 * Layout Component
 * Main application layout shell with sidebar and header
 */

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/store';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DrawersContainer } from './DrawersContainer';
import { ModalsContainer } from './ModalsContainer';
import { fadeInUp } from '@/utils/animations';

// ============================================================
// LAYOUT TYPES
// ============================================================

export interface LayoutProps {
  children: ReactNode;
}

// ============================================================
// LAYOUT COMPONENT
// ============================================================

import { useAuthStore } from '@/store';

export const Layout = ({ children }: LayoutProps) => {
  const { sidebarWidth } = useAppStore();
  const { isAuthenticated } = useAuthStore();

  // If not authenticated, render ONLY the page content itself (no Sidebar, Header, Drawers, Modals)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/50 to-slate-800/30" />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/50 to-slate-800/30" />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <motion.main
        initial={false}
        animate={{
          marginLeft: sidebarWidth,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          'relative min-h-screen',
          'transition-all duration-300'
        )}
      >
        {/* Header */}
        <Header />

        {/* Page Content */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="relative z-10 p-6"
        >
          {children}
        </motion.div>

        {/* Decorative corner gradients */}
        <div className="fixed top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      </motion.main>

      {/* Global Overlays & Sliding Drawers */}
      <DrawersContainer />
      <ModalsContainer />
    </div>
  );
};
