/**
 * Intel Feeds Page
 * Real-time monitoring and configuration of global intelligence feeds.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Plus, Wifi, Globe, Database, Activity } from 'lucide-react';
import { Badge, Button, Input } from '@/components/ui';
import { cn } from '@/utils/cn';
import { toastSuccess } from '@/components/ui/toast';
import type { IntelligenceFeed, IntelligenceFeedType } from '@/types';

const initialFeeds: IntelligenceFeed[] = [
  {
    id: 'feed-osint-1',
    name: 'AlienVault OTX Global Pulse',
    type: 'osint',
    url: 'https://otx.alienvault.com/api/v1/pulse',
    refreshInterval: 300,
    lastSync: new Date(Date.now() - 120000),
    status: 'active',
    indicators: 148920,
    reliability: 94.2,
  },
  {
    id: 'feed-comm-1',
    name: 'CrowdStrike Intelligence Feed',
    type: 'commercial',
    url: 'https://api.crowdstrike.com/indicators',
    refreshInterval: 600,
    lastSync: new Date(Date.now() - 45000),
    status: 'active',
    indicators: 320450,
    reliability: 99.1,
  },
  {
    id: 'feed-darkweb-1',
    name: 'DarkNet Reconnaissance Scanner',
    type: 'darkweb',
    url: 'tor://onion/threat-stream-v3',
    refreshInterval: 1800,
    lastSync: new Date(Date.now() - 840000),
    status: 'active',
    indicators: 45100,
    reliability: 82.5,
  },
  {
    id: 'feed-honeypot-1',
    name: 'Internal Global Honeypot Mesh',
    type: 'honeypot',
    url: 'aegis://honeypot/internal-sensors',
    refreshInterval: 60,
    lastSync: new Date(Date.now() - 12000),
    status: 'active',
    indicators: 8940,
    reliability: 98.7,
  },
  {
    id: 'feed-gov-1',
    name: 'CISA Automated Indicator Sharing (AIS)',
    type: 'government',
    url: 'https://cisa.gov/ais/stream',
    refreshInterval: 3600,
    lastSync: new Date(Date.now() - 1800000),
    status: 'active',
    indicators: 65200,
    reliability: 96.8,
  },
];

export function IntelFeeds() {
  const [feeds, setFeeds] = useState<IntelligenceFeed[]>(initialFeeds);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSync = (id: string) => {
    setIsSyncing(id);
    setTimeout(() => {
      setFeeds((prev) =>
        prev.map((f) => (f.id === id ? { ...f, lastSync: new Date(), indicators: f.indicators + Math.floor(Math.random() * 50) } : f)),
      );
      setIsSyncing(null);
      toastSuccess({ title: 'Feed Synchronized', description: 'Real-time indicator stream successfully ingested.' });
    }, 800);
  };

  const handleTogglePause = (id: string) => {
    setFeeds((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: f.status === 'active' ? 'paused' : 'active' } : f)),
    );
    toastSuccess({ title: 'Feed Status Updated', description: 'Stream collection parameters adjusted.' });
  };

  const handleAddFeed = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const name = fd.get('name') as string;
    const type = fd.get('type') as IntelligenceFeedType;
    const url = fd.get('url') as string;

    const newFeed: IntelligenceFeed = {
      id: `feed-custom-${Date.now()}`,
      name,
      type,
      url,
      refreshInterval: 600,
      lastSync: new Date(),
      status: 'active',
      indicators: 1200,
      reliability: 90.0,
    };

    setFeeds([newFeed, ...feeds]);
    setShowAddModal(false);
    toastSuccess({ title: 'Feed Added', description: 'Custom intelligence stream initialized.' });
  };

  const totalIndicators = feeds.reduce((sum, f) => sum + f.indicators, 0);

  return (
    <div className="space-y-6">
      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-slate-950/60 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.15),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_35%)]" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="neon" size="sm">TELEMETRY SOURCES</Badge>
              <Badge variant="success" size="sm">Active Sync</Badge>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Intelligence Feeds</h1>
            <p className="mt-1 text-sm text-gray-400 max-w-2xl">
              Global multi-source threat intelligence ingestion. Synchronize OSINT, commercial SIEM feeds, honeypot traps, and darkweb recon channels in real time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono">
              <span className="text-gray-400">Total Indicators: </span>
              <span className="text-purple-400 font-bold">{totalIndicators.toLocaleString()}</span>
            </div>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Feed
            </Button>
          </div>
        </div>
      </section>

      {/* ── FEED LIST ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence initial={false}>
          {feeds.map((f, idx) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.05, 0.4) }}
              className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950/60 p-5 flex flex-col justify-between hover:border-purple-500/40 transition-all shadow-xl"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-[240px]">{f.name}</h3>
                      <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">{f.type}</span>
                    </div>
                  </div>
                  <Badge variant={f.status === 'active' ? 'success' : 'warning'} size="sm">
                    {f.status}
                  </Badge>
                </div>

                <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-3 my-4 font-mono text-xs text-gray-400 space-y-1.5 truncate">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{f.url}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <Activity className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                    <span>Reliability: <span className="text-white font-bold">{f.reliability}%</span></span>
                    <span className="mx-1">•</span>
                    <span>Interval: {f.refreshInterval}s</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-xs mb-4">
                  <div className="rounded-lg bg-slate-900/50 p-2.5 text-center border border-slate-800">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-0.5">Ingested IOCs</span>
                    <span className="text-white font-bold text-sm">{f.indicators.toLocaleString()}</span>
                  </div>
                  <div className="rounded-lg bg-slate-900/50 p-2.5 text-center border border-slate-800">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-0.5">Last Stream Sync</span>
                    <span className="text-cyan-400 font-bold text-[11px]">{f.lastSync.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleSync(f.id)}
                  disabled={isSyncing === f.id || f.status !== 'active'}
                >
                  <RefreshCw className={cn('h-3.5 w-3.5 mr-2', isSyncing === f.id && 'animate-spin')} />
                  {isSyncing === f.id ? 'Syncing...' : 'Sync Feed'}
                </Button>
                <Button
                  variant="ghost"
                  className={cn(f.status === 'active' ? 'text-amber-400' : 'text-green-400')}
                  onClick={() => handleTogglePause(f.id)}
                >
                  {f.status === 'active' ? 'Pause' : 'Resume'}
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── ADD CUSTOM FEED MODAL ── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-slate-950 border border-purple-500/30 rounded-2xl shadow-2xl p-6 z-10 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <Database className="h-5 w-5 text-purple-400" />
                  <h2 className="text-lg font-bold text-white">Initialize Custom Intel Feed</h2>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white"><Plus className="h-5 w-5 rotate-45" /></button>
              </div>

              <form onSubmit={handleAddFeed} className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-mono mb-1 block">Feed Name</label>
                  <Input name="name" placeholder="e.g. Enterprise Global SIEM Gateway" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-mono mb-1 block">Feed Type</label>
                    <select name="type" className="w-full rounded-lg bg-slate-900 border border-slate-700 p-2.5 text-sm text-white">
                      <option value="osint">OSINT</option>
                      <option value="commercial">Commercial</option>
                      <option value="darkweb">Darkweb Recon</option>
                      <option value="honeypot">Honeypot</option>
                      <option value="internal">Internal Sensor</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-mono mb-1 block">Refresh Interval (s)</label>
                    <Input type="number" name="interval" defaultValue="600" min="30" max="86400" required />
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-mono mb-1 block">Endpoint URL</label>
                  <Input name="url" placeholder="https://api.threat-intelligence.io/v2/stream" required />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <Button variant="ghost" onClick={() => setShowAddModal(false)} type="button">Cancel</Button>
                  <Button variant="primary" type="submit">Initialize Stream</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
