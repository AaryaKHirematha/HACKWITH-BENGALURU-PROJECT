/**
 * Global Drawers Container
 * Houses sliding panels for Notifications and Quick Settings.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Settings as SettingsIcon, CheckCircle2, ShieldAlert, Cpu, Sliders, RefreshCw, Key, Volume2 } from 'lucide-react';
import { useAppStore, useWebSocketStore, useAuthStore } from '@/store';
import { useSimulationStore } from '@/simulation';
import { Badge, Button } from '@/components/ui';
import { cn } from '@/utils/cn';
import { toastSuccess } from '@/components/ui/toast';
import type { ThreatEvent } from '@/simulation/types';

export function DrawersContainer() {
  const { notificationsPanelOpen, settingsPanelOpen, toggleNotificationsPanel, toggleSettingsPanel } = useAppStore();
  const { events } = useSimulationStore();
  const { connected, messageCount } = useWebSocketStore();
  const { signOut } = useAuthStore();

  const criticalEvents = events.filter((e: ThreatEvent) => e.threatLevel === 'critical').slice(0, 10);

  return (
    <>
      {/* ── NOTIFICATIONS DRAWER ── */}
      <AnimatePresence>
        {notificationsPanelOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={toggleNotificationsPanel}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-l border-slate-700/50 shadow-2xl flex flex-col z-10"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-700/40 bg-slate-950/40">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-cyan-400" />
                  <h2 className="text-lg font-bold text-white">System Notifications</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="danger" size="sm">{criticalEvents.length} critical</Badge>
                  <Button variant="ghost" size="icon-sm" onClick={toggleNotificationsPanel}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-2 text-gray-400">
                    <span className={cn('h-2 w-2 rounded-full', connected ? 'bg-green-400 animate-pulse' : 'bg-red-400')} />
                    WebSocket Stream
                  </span>
                  <span className="text-cyan-400">{messageCount} frames received</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-gray-500 font-mono">Active Critical Alerts</span>
                  <button
                    onClick={() => toastSuccess({ title: 'Alerts Acknowledged', description: 'All notifications marked as read.' })}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    Mark all read
                  </button>
                </div>

                {criticalEvents.length === 0 ? (
                  <div className="rounded-xl border border-slate-800 p-8 text-center text-sm text-gray-500">
                    No unread critical alerts in the current telemetry window.
                  </div>
                ) : (
                  criticalEvents.map((ev: ThreatEvent) => (
                    <div
                      key={ev.id}
                      className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 space-y-2 hover:border-red-500/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="h-4 w-4 text-red-400 flex-shrink-0" />
                          <span className="text-sm font-semibold text-white truncate">{ev.title}</span>
                        </div>
                        <Badge variant="danger" size="sm" className="text-[10px]">CRITICAL</Badge>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">{ev.description}</p>
                      <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                        <span className="font-mono">{ev.eventId}</span>
                        <a
                          href="/reports"
                          onClick={() => toggleNotificationsPanel()}
                          className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          Investigate →
                        </a>
                      </div>
                    </div>
                  ))
                )}

                <div className="rounded-xl border border-slate-800 p-4 bg-slate-900/40 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-gray-300 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    CascadeFlow Engine Status
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    Adaptive token compression is active. Real-time inference routing operating at 99.4% SLA.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── QUICK SETTINGS DRAWER ── */}
      <AnimatePresence>
        {settingsPanelOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={toggleSettingsPanel}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-l border-slate-700/50 shadow-2xl flex flex-col z-10"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-700/40 bg-slate-950/40">
                <div className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5 text-purple-400" />
                  <h2 className="text-lg font-bold text-white">Quick Settings</h2>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={toggleSettingsPanel}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-wider text-gray-500 font-mono flex items-center gap-2">
                    <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                    AI Model Temperature (0.2)
                  </label>
                  <input type="range" min="0" max="1" step="0.05" defaultValue="0.2" className="w-full accent-cyan-500" />
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>Deterministic</span>
                    <span>Creative</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-wider text-gray-500 font-mono flex items-center gap-2">
                    <Cpu className="h-3.5 w-3.5 text-purple-400" />
                    Simulation Tick Interval (2.8s)
                  </label>
                  <input type="range" min="1" max="10" step="0.5" defaultValue="2.8" className="w-full accent-purple-500" />
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>Aggressive</span>
                    <span>Conserve CPU</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-wider text-gray-500 font-mono flex items-center gap-2">
                    <Key className="h-3.5 w-3.5 text-amber-400" />
                    API Integrations
                  </label>
                  <div className="space-y-2">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 flex items-center justify-between text-xs">
                      <span className="text-gray-300 font-mono">OpenAI Frontier API</span>
                      <Badge variant="success" size="sm">connected</Badge>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 flex items-center justify-between text-xs">
                      <span className="text-gray-300 font-mono">Enterprise SIEM Hook</span>
                      <Badge variant="success" size="sm">active</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-wider text-gray-500 font-mono flex items-center gap-2">
                    <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                    Audio & Alerts
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between rounded-xl border border-slate-800 p-3 bg-slate-950/40 text-xs text-gray-300 cursor-pointer">
                      <span>Cinematic Sound Effects</span>
                      <input type="checkbox" defaultChecked className="accent-cyan-500 h-4 w-4" />
                    </label>
                    <label className="flex items-center justify-between rounded-xl border border-slate-800 p-3 bg-slate-950/40 text-xs text-gray-300 cursor-pointer">
                      <span>Desktop Urgent Push Alerts</span>
                      <input type="checkbox" defaultChecked className="accent-cyan-500 h-4 w-4" />
                    </label>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => {
                      toastSuccess({ title: 'Settings Applied', description: 'System preferences updated across all nodes.' });
                      toggleSettingsPanel();
                    }}
                  >
                    Save Preferences
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      toastSuccess({ title: 'Settings Reset', description: 'Restored default enterprise parameters.' });
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" /> Reset Defaults
                  </Button>
                  <Button
                    variant="danger"
                    className="w-full"
                    onClick={() => {
                      toggleSettingsPanel();
                      signOut();
                      toastSuccess({ title: 'Signed Out', description: 'Your enterprise session has been terminated. Returning to login screen.' });
                    }}
                  >
                    Sign Out &amp; Return to Login
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
