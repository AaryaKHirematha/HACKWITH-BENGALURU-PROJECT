/**
 * LiveIncidentStrip
 * Compact scrolling incident feed for the command center.
 * Shows latest events with severity indicators and animated entry.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Clock, User, ChevronDown, Shield, Cpu } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { cn } from '@/utils/cn';
import type { ThreatEvent, ThreatLevel } from '@/simulation/types';

const lvlColor: Record<ThreatLevel, string> = {
  critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-500', low: 'bg-blue-500', info: 'bg-slate-500',
};
const lvlBadge: Record<ThreatLevel, 'danger' | 'warning' | 'secondary' | 'info' | 'default'> = {
  critical: 'danger', high: 'warning', medium: 'secondary', low: 'info', info: 'default',
};

export function LiveIncidentStrip({ events }: { events: ThreatEvent[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sorted = events.slice(0, 20);

  return (
    <Card noPadding className="h-full">
      <div className="p-5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="relative"><Radio className="h-5 w-5 text-red-400" /><div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" /></div>
            <CardTitle>Live Incident Feed</CardTitle>
          </div>
          <Badge variant="danger" size="sm">{sorted.length} recent</Badge>
        </CardHeader>
      </div>

      <div className="max-h-[500px] overflow-y-auto px-5 pb-5 space-y-2">
        <AnimatePresence initial={false}>
          {sorted.map((ev, idx) => {
            const isOpen = expandedId === ev.id;
            return (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.015, 0.3) }}
                className={cn(
                  'rounded-lg border transition-all overflow-hidden',
                  isOpen ? 'border-cyan-500/40 bg-slate-900/60' : 'border-slate-700/30 bg-slate-950/40 hover:border-slate-600/50',
                )}
              >
                {/* Severity line */}
                <div className={cn('h-0.5', lvlColor[ev.threatLevel])} />

                <button onClick={() => setExpandedId(isOpen ? null : ev.id)} className="w-full p-3 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={lvlBadge[ev.threatLevel]} size="sm" className="text-[9px]">{ev.threatLevel}</Badge>
                    <span className="flex-1 text-[12px] font-medium text-white truncate">{ev.title}</span>
                    <span className="text-[10px] font-mono text-gray-600">{ev.anomalyScore}</span>
                    <ChevronDown className={cn('h-3.5 w-3.5 text-gray-600 transition-transform', isOpen && 'rotate-180')} />
                  </div>
                  <div className="flex gap-3 text-[10px] text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(ev.timestamp).toLocaleTimeString('en-US', { hour12: false })}</span>
                    <span className="flex items-center gap-1"><Cpu className="h-3 w-3" />{ev.sourceType}</span>
                    {ev.user && <span className="flex items-center gap-1"><User className="h-3 w-3" />{ev.user.username}</span>}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="px-3 pb-3 space-y-2 border-t border-slate-700/30 pt-2">
                        <p className="text-[11px] text-gray-300">{ev.description}</p>
                        <div className="rounded-lg bg-slate-950/60 p-2.5 border border-cyan-500/15">
                          <p className="text-[9px] text-cyan-400 font-semibold flex items-center gap-1 mb-1"><Shield className="h-3 w-3" />AI Summary</p>
                          <p className="text-[10px] text-gray-400">{ev.aiSummary}</p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {ev.tags.slice(0, 5).map((t) => <span key={t} className="rounded-full bg-slate-800 border border-slate-700/40 px-1.5 py-0.5 text-[8px] text-gray-500">{t}</span>)}
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
