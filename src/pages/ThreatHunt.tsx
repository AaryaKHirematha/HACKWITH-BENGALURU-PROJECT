/**
 * Threat Hunt Page
 * Advanced interactive query builder and MITRE ATT&CK exploration matrix.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Search, Filter, ShieldAlert, Cpu, Database, RefreshCw, Zap, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge, Button, Input } from '@/components/ui';
import { useSimulationStore } from '@/simulation';
import { cn } from '@/utils/cn';
import { toastSuccess } from '@/components/ui/toast';
import type { ThreatEvent } from '@/simulation/types';

const mitreTactics = [
  { id: 'TA0001', name: 'Initial Access', techniques: ['T1566 Phishing', 'T1190 Exploit Public App', 'T1078 Valid Accounts'] },
  { id: 'TA0002', name: 'Execution', techniques: ['T1059 Command/Scripting', 'T1203 Exploitation for Client Execution'] },
  { id: 'TA0003', name: 'Persistence', techniques: ['T1053 Scheduled Task', 'T1547 Boot or Logon Autostart'] },
  { id: 'TA0006', name: 'Credential Access', techniques: ['T1003 OS Credential Dumping', 'T1110 Brute Force'] },
  { id: 'TA0008', name: 'Lateral Movement', techniques: ['T1021 Remote Services', 'T1570 Lateral Tool Transfer'] },
  { id: 'TA0010', name: 'Exfiltration', techniques: ['T1041 Exfil Over C2', 'T1048 Exfil Over Alt Protocol'] },
];

export function ThreatHunt() {
  const { events, selectEvent } = useSimulationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTactic, setSelectedTactic] = useState<string | null>(null);
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [executedResults, setExecutedResults] = useState<ThreatEvent[]>(events.slice(0, 8));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    setTimeout(() => {
      const q = searchQuery.toLowerCase();
      const filtered = events.filter((ev) => {
        const matchesQ = !q || ev.title.toLowerCase().includes(q) || ev.description.toLowerCase().includes(q) || ev.eventId.toLowerCase().includes(q);
        const matchesTech = !selectedTechnique || ev.tags.some((t) => t.toLowerCase().includes(selectedTechnique.toLowerCase().split(' ')[0]));
        return matchesQ && matchesTech;
      });

      setExecutedResults(filtered.slice(0, 20));
      setIsSearching(false);
      toastSuccess({ title: 'Query Executed', description: `Discovered ${filtered.length} correlated events matching query.` });
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950/60 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_30%,rgba(6,182,212,0.15),transparent_35%),radial-gradient(circle_at_90%_70%,rgba(168,85,247,0.1),transparent_35%)]" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="cyber" size="sm">INTELLIGENCE MESH</Badge>
              <Badge variant="primary" size="sm">Interactive Hunting Matrix</Badge>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Active Threat Hunting</h1>
            <p className="mt-1 text-sm text-gray-400 max-w-2xl">
              Query raw simulation streams, correlate TTPs against the MITRE ATT&CK framework, and isolate persistent threat vectors across global enterprise nodes.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl">
            <Database className="h-4 w-4 text-cyan-400 flex-shrink-0" />
            <span>Telemetry Index: <span className="text-white font-bold">{events.length.toLocaleString()}</span></span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_2.2fr] gap-6">
        {/* ── LEFT: QUERY BUILDER & MITRE MATRIX ── */}
        <div className="space-y-6">
          <Card glow="cyan">
            <CardHeader>
              <CardTitle><Filter className="h-5 w-5 text-cyan-400" />Hunting Query Builder</CardTitle>
            </CardHeader>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-400 font-mono mb-1 block">Search Telemetry (IOCs, Titles, IDs)</label>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. EVT-1029, Pass-the-hash, 185.220..."
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-gray-400 font-mono mb-1 block">MITRE Tactic Filter</label>
                <div className="flex flex-wrap gap-1.5">
                  {mitreTactics.map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => {
                        setSelectedTactic(t.id === selectedTactic ? null : t.id);
                        setSelectedTechnique(null);
                      }}
                      className={cn(
                        'rounded-lg border px-3 py-1.5 text-xs transition-colors font-semibold',
                        selectedTactic === t.id ? 'border-cyan-500/50 bg-cyan-500/20 text-cyan-300' : 'border-slate-800 bg-slate-900 text-gray-400 hover:border-slate-700',
                      )}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {selectedTactic && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1.5 pt-2 border-t border-slate-800">
                  <label className="text-xs uppercase tracking-wider text-cyan-400 font-mono block">Select Specific Technique</label>
                  <div className="space-y-1">
                    {mitreTactics.find((t) => t.id === selectedTactic)?.techniques.map((tech) => (
                      <button
                        type="button"
                        key={tech}
                        onClick={() => setSelectedTechnique(tech === selectedTechnique ? null : tech)}
                        className={cn(
                          'w-full rounded-lg border p-2 text-left text-xs transition-colors font-mono flex items-center justify-between',
                          selectedTechnique === tech ? 'border-purple-500/50 bg-purple-500/20 text-purple-300' : 'border-slate-800/80 bg-slate-950/60 text-gray-400 hover:border-slate-700',
                        )}
                      >
                        <span>{tech}</span>
                        {selectedTechnique === tech && <Zap className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <Button variant="primary" type="submit" className="w-full" loading={isSearching}>
                <RefreshCw className={cn('h-4 w-4 mr-2', isSearching && 'animate-spin')} />
                Execute Hunting Query
              </Button>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle><Cpu className="h-5 w-5 text-purple-400" />Hunting Automation</CardTitle>
            </CardHeader>
            <p className="text-xs text-gray-400 leading-relaxed">
              When a hunting query isolates candidate threat events, the Multi-Agent mesh automatically indexes the resulting indicators into Hindsight Memory for cross-node correlation.
            </p>
          </Card>
        </div>

        {/* ── RIGHT: HUNTING RESULTS ── */}
        <Card className="flex flex-col h-full min-h-[500px]" noPadding>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white font-mono">Hunting Telemetry Stream</h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm">{executedResults.length} matches</Badge>
              {selectedTechnique && <Badge variant="warning" size="sm">{selectedTechnique}</Badge>}
            </div>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-3 max-h-[600px]">
            <AnimatePresence initial={false}>
              {executedResults.length === 0 ? (
                <div className="rounded-xl border border-slate-800 p-12 text-center text-gray-500 font-mono text-sm">
                  <ShieldAlert className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  No events match the specified threat hunting parameters.
                </div>
              ) : (
                executedResults.map((ev, idx) => (
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.03, 0.4) }}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3 hover:border-cyan-500/40 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Badge variant={ev.threatLevel === 'critical' ? 'danger' : ev.threatLevel === 'high' ? 'warning' : 'secondary'} size="sm">
                          {ev.threatLevel.toUpperCase()}
                        </Badge>
                        <span className="text-sm font-bold text-white">{ev.title}</span>
                      </div>
                      <span className="text-xs font-mono text-cyan-400">{ev.eventId}</span>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed">{ev.description}</p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-[11px] text-gray-500 font-mono">
                      <div className="flex items-center gap-4">
                        <span>Anomaly: <span className="text-cyan-300 font-semibold">{ev.anomalyScore}</span></span>
                        <span>Confidence: <span className="text-purple-300 font-semibold">{ev.confidenceScore}%</span></span>
                        <span>Source: <span className="text-white">{ev.sourceType}</span></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            selectEvent(ev);
                          }}
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            toastSuccess({ title: 'IOC Pinned', description: `Indicator ${ev.eventId} pinned to intelligence feed.` });
                          }}
                          className="text-cyan-400"
                        >
                          Pin IOC
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </Card>
      </div>
    </div>
  );
}
