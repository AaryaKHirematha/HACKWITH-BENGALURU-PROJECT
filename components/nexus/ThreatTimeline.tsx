/**
 * ThreatTimeline
 * Scrollable animated timeline of threat events with severity-colored
 * markers, expandable detail cards, and live event injection.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronDown, MapPin, Shield, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { cn } from '@/utils/cn';
import type { ThreatEvent, ThreatLevel } from '@/simulation/types';

const levelColor: Record<ThreatLevel, string> = {
  critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-500', low: 'bg-blue-500', info: 'bg-slate-500',
};
const levelGlow: Record<ThreatLevel, string> = {
  critical: 'shadow-red-500/60', high: 'shadow-orange-500/40', medium: '', low: '', info: '',
};
const levelBadge: Record<ThreatLevel, 'danger' | 'warning' | 'secondary' | 'info' | 'default'> = {
  critical: 'danger', high: 'warning', medium: 'secondary', low: 'info', info: 'default',
};

export function ThreatTimeline({ events }: { events: ThreatEvent[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const sorted = useMemo(() => [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 30), [events]);

  return (
    <Card className="h-full" noPadding>
      <div className="p-5">
        <CardHeader>
          <CardTitle><Clock className="h-5 w-5 text-cyan-400" />Threat Timeline</CardTitle>
          <Badge variant="primary" size="sm">{sorted.length} events</Badge>
        </CardHeader>
      </div>

      <div className="relative max-h-[520px] overflow-y-auto px-5 pb-5">
        {/* Vertical timeline line */}
        <div className="absolute left-[29px] top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/30 via-purple-500/20 to-transparent" />

        <AnimatePresence initial={false}>
          {sorted.map((ev, idx) => {
            const isOpen = expanded === ev.id;
            const ts = new Date(ev.timestamp);
            return (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                className="relative pl-8 pb-4"
              >
                {/* Marker */}
                <div className={cn(
                  'absolute left-[22px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-slate-900 shadow-lg z-10',
                  levelColor[ev.threatLevel], levelGlow[ev.threatLevel],
                )} />

                {/* Card */}
                <button
                  onClick={() => setExpanded(isOpen ? null : ev.id)}
                  className={cn(
                    'w-full rounded-xl border p-3.5 text-left transition-all',
                    'bg-slate-950/50 backdrop-blur-sm',
                    isOpen ? 'border-cyan-500/40 shadow-lg shadow-cyan-500/5' : 'border-slate-700/40 hover:border-slate-600/60',
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={levelBadge[ev.threatLevel]} size="sm">{ev.threatLevel}</Badge>
                    <span className="flex-1 text-sm font-semibold text-white truncate">{ev.title}</span>
                    <ChevronDown className={cn('h-4 w-4 text-gray-500 transition-transform', isOpen && 'rotate-180')} />
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-500">
                    <span className="font-mono">{ts.toLocaleTimeString('en-US', { hour12: false })}</span>
                    <span>{ev.sourceType}</span>
                    {ev.user && <span className="flex items-center gap-1"><User className="h-3 w-3" />{ev.user.username}</span>}
                    {ev.geolocation && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ev.geolocation.city}</span>}
                  </div>
                </button>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 rounded-lg border border-slate-700/30 bg-slate-900/60 p-4 space-y-2">
                        <p className="text-[12px] text-gray-300">{ev.description}</p>
                        <div className="rounded-lg bg-slate-950/60 p-3 border border-cyan-500/15">
                          <p className="text-[10px] text-cyan-400 font-semibold mb-1 flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" />AI Summary</p>
                          <p className="text-[11px] text-gray-400">{ev.aiSummary}</p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {ev.tags.slice(0, 6).map((t) => (
                            <span key={t} className="rounded-full bg-slate-800 border border-slate-700/50 px-2 py-0.5 text-[9px] text-gray-400">{t}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-gray-500 pt-1">
                          <span>Anomaly: <span className="text-cyan-300 font-semibold">{ev.anomalyScore}</span></span>
                          <span>Confidence: <span className="text-purple-300 font-semibold">{ev.confidenceScore}%</span></span>
                          <span>Evidence: <span className="text-amber-300">{ev.evidence.length}</span></span>
                          {ev.relatedEvents.length > 0 && <span>Linked: <span className="text-green-300">{ev.relatedEvents.length}</span></span>}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Card>
  );
}
