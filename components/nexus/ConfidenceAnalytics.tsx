/**
 * ConfidenceAnalytics
 * Visual analytics for AI model confidence distribution across events,
 * showing histogram, breakdown by severity, and trend indicators.
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { cn } from '@/utils/cn';
import type { ThreatEvent, ThreatLevel } from '@/simulation/types';

const buckets = ['0-20', '20-40', '40-60', '60-80', '80-100'];

export function ConfidenceAnalytics({ events }: { events: ThreatEvent[] }) {
  const stats = useMemo(() => {
    const hist = [0, 0, 0, 0, 0];
    const bySeverity: Record<ThreatLevel, { total: number; count: number }> = {
      critical: { total: 0, count: 0 }, high: { total: 0, count: 0 },
      medium: { total: 0, count: 0 }, low: { total: 0, count: 0 }, info: { total: 0, count: 0 },
    };
    let sum = 0;

    for (const ev of events) {
      const c = ev.confidenceScore;
      sum += c;
      if (c < 20) hist[0]++;
      else if (c < 40) hist[1]++;
      else if (c < 60) hist[2]++;
      else if (c < 80) hist[3]++;
      else hist[4]++;
      bySeverity[ev.threatLevel].total += c;
      bySeverity[ev.threatLevel].count += 1;
    }

    const avg = events.length > 0 ? sum / events.length : 0;
    const max = Math.max(...hist, 1);
    return { hist, max, avg, bySeverity };
  }, [events]);

  const severityRows: Array<{ level: ThreatLevel; label: string; color: string }> = [
    { level: 'critical', label: 'Critical', color: 'bg-red-500' },
    { level: 'high', label: 'High', color: 'bg-orange-500' },
    { level: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { level: 'low', label: 'Low', color: 'bg-blue-500' },
    { level: 'info', label: 'Info', color: 'bg-slate-500' },
  ];

  return (
    <Card glow="purple">
      <CardHeader>
        <CardTitle><BarChart3 className="h-5 w-5 text-purple-400" />Confidence Analytics</CardTitle>
        <Badge variant="secondary" size="sm">{events.length.toLocaleString()} signals</Badge>
      </CardHeader>

      {/* Big average number */}
      <div className="mb-5 flex items-end gap-3">
        <motion.p
          className="text-5xl font-extrabold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {stats.avg.toFixed(1)}<span className="text-2xl text-gray-500">%</span>
        </motion.p>
        <div className="flex items-center gap-1 text-green-400 text-sm mb-2">
          <TrendingUp className="h-4 w-4" /> avg confidence
        </div>
      </div>

      {/* Histogram */}
      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Distribution</p>
      <div className="flex items-end gap-1.5 h-28 mb-1">
        {stats.hist.map((count, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(count / stats.max) * 100}%` }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={cn(
                'w-full rounded-t-md',
                i <= 1 ? 'bg-red-500/70' : i === 2 ? 'bg-amber-500/70' : 'bg-cyan-500/70',
              )}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 text-[9px] text-gray-500 font-mono">
        {buckets.map((b) => <span key={b} className="flex-1 text-center">{b}</span>)}
      </div>

      {/* By severity */}
      <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-5 mb-3">Avg by severity</p>
      <div className="space-y-2.5">
        {severityRows.map(({ level, label, color }) => {
          const s = stats.bySeverity[level];
          const avg = s.count > 0 ? s.total / s.count : 0;
          return (
            <div key={level} className="flex items-center gap-3 text-[12px]">
              <div className={cn('h-2.5 w-2.5 rounded-full', color)} />
              <span className="w-14 text-gray-400">{label}</span>
              <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${avg}%` }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={cn('h-full rounded-full', color)}
                  style={{ opacity: 0.8 }}
                />
              </div>
              <span className="w-10 text-right font-mono text-white">{avg.toFixed(0)}%</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
