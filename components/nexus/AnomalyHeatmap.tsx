/**
 * AnomalyHeatmap
 * Time-of-day × day-of-week heatmap of anomaly score intensity.
 * Generates data from simulation events.
 */

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { cn } from '@/utils/cn';
import type { ThreatEvent } from '@/simulation/types';

const hours = Array.from({ length: 24 }, (_, i) => i);
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function intensity(score: number): string {
  if (score >= 80) return 'bg-red-500/90 shadow-red-500/40 shadow-sm';
  if (score >= 60) return 'bg-orange-500/80';
  if (score >= 40) return 'bg-amber-500/60';
  if (score >= 20) return 'bg-cyan-500/35';
  if (score > 0) return 'bg-cyan-500/15';
  return 'bg-slate-800/40';
}

export function AnomalyHeatmap({ events }: { events: ThreatEvent[] }) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const grid = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    for (const day of days) {
      for (const h of hours) {
        map[`${day}-${h}`] = { total: 0, count: 0 };
      }
    }
    for (const ev of events) {
      const d = new Date(ev.timestamp);
      const dayIdx = (d.getDay() + 6) % 7; // Mon=0
      const hour = d.getHours();
      const key = `${days[dayIdx]}-${hour}`;
      if (map[key]) {
        map[key].total += ev.anomalyScore;
        map[key].count += 1;
      }
    }
    return map;
  }, [events]);

  const maxAvg = useMemo(() => {
    let m = 1;
    for (const v of Object.values(grid)) {
      if (v.count > 0) m = Math.max(m, v.total / v.count);
    }
    return m;
  }, [grid]);

  return (
    <Card glow="red" className="h-full">
      <CardHeader>
        <CardTitle><Flame className="h-5 w-5 text-red-400" />Anomaly Heatmap</CardTitle>
        <Badge variant="danger" size="sm">7-day view</Badge>
      </CardHeader>

      {/* Hour axis labels */}
      <div className="flex gap-px pl-10 mb-1">
        {hours.filter((_, i) => i % 3 === 0).map((h) => (
          <span key={h} className="flex-1 text-center text-[9px] text-gray-600 font-mono">{String(h).padStart(2, '0')}</span>
        ))}
      </div>

      <div className="space-y-[3px]">
        {days.map((day) => (
          <div key={day} className="flex items-center gap-px">
            <span className="w-8 text-[10px] font-mono text-gray-500 text-right pr-2">{day}</span>
            <div className="flex flex-1 gap-[2px]">
              {hours.map((h) => {
                const key = `${day}-${h}`;
                const cell = grid[key];
                const avg = cell && cell.count > 0 ? cell.total / cell.count : 0;
                const norm = avg / maxAvg * 100;
                const isHovered = hoveredCell === key;

                return (
                  <motion.div
                    key={key}
                    onMouseEnter={() => setHoveredCell(key)}
                    onMouseLeave={() => setHoveredCell(null)}
                    whileHover={{ scale: 1.4, zIndex: 10 }}
                    className={cn(
                      'relative h-5 flex-1 rounded-sm cursor-pointer transition-colors',
                      intensity(norm),
                    )}
                  >
                    {isHovered && cell && cell.count > 0 && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 whitespace-nowrap rounded-lg border border-slate-600 bg-slate-900 px-3 py-1.5 text-[10px] text-white shadow-xl">
                        <span className="font-semibold">{day} {String(h).padStart(2, '0')}:00</span>
                        <br />
                        <span className="text-gray-400">Avg score: <span className="text-cyan-300">{avg.toFixed(1)}</span></span>
                        <br />
                        <span className="text-gray-400">Events: <span className="text-cyan-300">{cell.count}</span></span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-[9px] text-gray-500">
        <span>Low anomaly</span>
        <div className="flex gap-1">
          {['bg-cyan-500/15', 'bg-cyan-500/35', 'bg-amber-500/60', 'bg-orange-500/80', 'bg-red-500/90'].map((c, i) => (
            <div key={i} className={cn('h-3 w-6 rounded-sm', c)} />
          ))}
        </div>
        <span>High anomaly</span>
      </div>
    </Card>
  );
}
