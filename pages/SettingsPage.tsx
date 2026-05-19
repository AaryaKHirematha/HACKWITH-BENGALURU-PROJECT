/**
 * Enterprise Settings Page
 * Global platform configuration center for UI preferences, security guardrails, and AI integrations.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sliders, Shield, Key, Volume2, Save, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge, Button, Input } from '@/components/ui';
import { toastSuccess } from '@/components/ui/toast';
import { cn } from '@/utils/cn';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'api' | 'agents'>('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toastSuccess({ title: 'Enterprise Settings Applied', description: 'Platform configurations synchronized across cluster mesh.' });
    }, 800);
  };

  const tabs = [
    { id: 'general', label: 'General & UI', icon: Sliders },
    { id: 'security', label: 'Security Guardrails', icon: Shield },
    { id: 'api', label: 'API & Webhooks', icon: Key },
    { id: 'agents', label: 'Agent Tuning SLA', icon: Volume2 },
  ] as const;

  return (
    <div className="space-y-6 font-mono">
      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950/60 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_30%,rgba(6,182,212,0.15),transparent_35%),radial-gradient(circle_at_90%_70%,rgba(168,85,247,0.1),transparent_35%)]" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="cyber" size="sm">GLOBAL PREFERENCES</Badge>
              <Badge variant="success" size="sm">Synchronized</Badge>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">Enterprise Platform Settings</h1>
            <p className="mt-1 text-sm text-gray-400 max-w-2xl font-sans">
              Configure zero-trust enforcement parameters, AI model integration endpoints, and multi-agent coordination thresholds across all operational nodes.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => toastSuccess({ title: 'Defaults Restored', description: 'Reverted configuration parameters to standard enterprise SLA.' })}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Defaults
            </Button>
            <Button variant="primary" onClick={(e) => handleSave(e as any)} loading={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              Save All
            </Button>
          </div>
        </div>
      </section>

      {/* ── NAVIGATION TABS ── */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl border transition-all uppercase tracking-wider font-bold flex-shrink-0',
                activeTab === tab.id
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/5'
                  : 'bg-slate-900/60 border-slate-800 text-gray-400 hover:border-slate-700',
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB CONTENT ── */}
      <form onSubmit={handleSave} className="space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'general' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <Card glow="cyan">
                <CardHeader>
                  <CardTitle><Sliders className="h-5 w-5 text-cyan-400" />General &amp; UI Preferences</CardTitle>
                </CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div>
                    <label className="text-gray-400 uppercase tracking-wider mb-2 block">System Theme Matrix</label>
                    <select className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-white font-mono">
                      <option>Cyberpunk Neon (Default)</option>
                      <option>High Contrast Dark</option>
                      <option>Terminal Monospace</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 uppercase tracking-wider mb-2 block">Timezone Standard</label>
                    <select className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-white font-mono">
                      <option>UTC (Coordinated Universal Time)</option>
                      <option>America/New_York (EST/EDT)</option>
                      <option>America/Los_Angeles (PST/PDT)</option>
                      <option>Europe/London (GMT/BST)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 uppercase tracking-wider mb-2 block">Telemetry Date Format</label>
                    <Input defaultValue="YYYY-MM-DD HH:mm:ss.SSS" />
                  </div>
                  <div className="space-y-3 pt-3">
                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-gray-300 font-bold cursor-pointer hover:border-slate-700">
                      <span>Enable Sound Synthesis</span>
                      <input type="checkbox" defaultChecked className="accent-cyan-500 h-4 w-4" />
                    </label>
                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-gray-300 font-bold cursor-pointer hover:border-slate-700">
                      <span>Desktop Broadcast Alerts</span>
                      <input type="checkbox" defaultChecked className="accent-cyan-500 h-4 w-4" />
                    </label>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <Card glow="red">
                <CardHeader>
                  <CardTitle><Shield className="h-5 w-5 text-red-400" />Security Guardrails &amp; Containment</CardTitle>
                </CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div>
                    <label className="text-gray-400 uppercase tracking-wider mb-2 block">Auto-Quarantine Anomaly Score SLA</label>
                    <Input type="number" defaultValue="85" min="50" max="100" />
                  </div>
                  <div>
                    <label className="text-gray-400 uppercase tracking-wider mb-2 block">Max Failed Login Threshold</label>
                    <Input type="number" defaultValue="5" min="1" max="20" />
                  </div>
                  <div className="space-y-3 pt-3 md:col-span-2">
                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-gray-300 font-bold cursor-pointer hover:border-red-500/50">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <span>Enforce Zero-Trust Network Perimeter Block on Critical Threats</span>
                      </div>
                      <input type="checkbox" defaultChecked className="accent-red-500 h-4 w-4" />
                    </label>
                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-gray-300 font-bold cursor-pointer hover:border-cyan-500/50">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <span>Require Multi-Factor Authentication (MFA) on SOC Actions</span>
                      </div>
                      <input type="checkbox" defaultChecked className="accent-cyan-500 h-4 w-4" />
                    </label>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'api' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <Card glow="purple">
                <CardHeader>
                  <CardTitle><Key className="h-5 w-5 text-purple-400" />API &amp; Webhooks</CardTitle>
                </CardHeader>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-gray-400 uppercase tracking-wider mb-1 block">OpenAI Frontier Reasoning API Key</label>
                    <Input type="password" defaultValue="sk-proj-enterprise-aegis-frontier-mesh-v5-9988..." />
                  </div>
                  <div>
                    <label className="text-gray-400 uppercase tracking-wider mb-1 block">Enterprise SIEM Webhook Gateway</label>
                    <Input defaultValue="https://siem.enterprise.net/v2/intake/webhook?token=aegis_sec" />
                  </div>
                  <div>
                    <label className="text-gray-400 uppercase tracking-wider mb-1 block">Slack / PagerDuty Alert Hook</label>
                    <Input defaultValue="https://hooks.slack.com/services/T000/B000/XXXXXX" />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'agents' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <Card glow="orange">
                <CardHeader>
                  <CardTitle><Volume2 className="h-5 w-5 text-amber-400" />Multi-Agent Tuning SLA</CardTitle>
                </CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
                  <div>
                    <label className="text-gray-400 uppercase tracking-wider mb-2 block">Max Agent Task Retries</label>
                    <Input type="number" defaultValue="2" min="0" max="5" />
                  </div>
                  <div>
                    <label className="text-gray-400 uppercase tracking-wider mb-2 block">Agent Task Timeout SLA (ms)</label>
                    <Input type="number" defaultValue="5000" min="1000" max="30000" />
                  </div>
                  <div>
                    <label className="text-gray-400 uppercase tracking-wider mb-2 block">Token Compression Aggressiveness (0-1)</label>
                    <Input type="number" defaultValue="0.75" step="0.05" min="0.1" max="1" />
                  </div>
                  <div>
                    <label className="text-gray-400 uppercase tracking-wider mb-2 block">Investigation Escalation SLA (%)</label>
                    <Input type="number" defaultValue="88" min="50" max="99" />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <Button variant="primary" type="submit" loading={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            Save Enterprise Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
