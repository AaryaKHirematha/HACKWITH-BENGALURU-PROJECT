/**
 * AEGIS — Autonomous Threat Intelligence & Forensics Copilot
 * Main Application Entry Point
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '@/components/layout';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { ToastProvider } from '@/components/ui';
import { Login } from '@/pages/Login';
import { CommandCenter } from '@/pages/CommandCenter';
import { Dashboard } from '@/pages/Dashboard';
import { CascadeFlow } from '@/pages/CascadeFlow';
import { Agents } from '@/pages/Agents';
import { Forensics } from '@/pages/Forensics';
import { DemoExperience } from '@/pages/DemoExperience';
import { ThreatHunt } from '@/pages/ThreatHunt';
import { IntelFeeds } from '@/pages/IntelFeeds';
import { IocDatabase } from '@/pages/IocDatabase';
import { Team } from '@/pages/Team';
import { SettingsPage } from '@/pages/SettingsPage';
import { HelpDocs } from '@/pages/HelpDocs';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60_000, gcTime: 10 * 60_000, retry: 3, refetchOnWindowFocus: false },
    mutations: { retry: 1 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AuthGuard><CommandCenter /></AuthGuard>} />
            <Route path="/threats" element={<AuthGuard><Dashboard /></AuthGuard>} />
            <Route path="/agents" element={<AuthGuard><Agents /></AuthGuard>} />
            <Route path="/cascade" element={<AuthGuard><CascadeFlow /></AuthGuard>} />
            <Route path="/demo" element={<AuthGuard><DemoExperience /></AuthGuard>} />
            <Route path="/hunt" element={<AuthGuard><ThreatHunt /></AuthGuard>} />
            <Route path="/feeds" element={<AuthGuard><IntelFeeds /></AuthGuard>} />
            <Route path="/ioc" element={<AuthGuard><IocDatabase /></AuthGuard>} />
            <Route path="/reports" element={<AuthGuard><Forensics /></AuthGuard>} />
            <Route path="/team" element={<AuthGuard><Team /></AuthGuard>} />
            <Route path="/settings" element={<AuthGuard><SettingsPage /></AuthGuard>} />
            <Route path="/help" element={<AuthGuard><HelpDocs /></AuthGuard>} />
          </Routes>
        </Layout>
        <ToastProvider />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
