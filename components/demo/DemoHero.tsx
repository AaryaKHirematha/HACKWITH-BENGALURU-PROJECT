/**
 * DemoHero
 * Cinematic opening banner for the autonomous AI demo experience.
 */

import { motion } from 'framer-motion';
import { Film, Sparkles, Radar, PlayCircle } from 'lucide-react';
import { Badge } from '@/components/ui';
import type { DemoSequence } from '@/demo';

export function DemoHero({ sequence, currentIndex, total, isAutoplay }: { sequence: DemoSequence | null; currentIndex: number; total: number; isAutoplay: boolean }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-fuchsia-500/20 bg-slate-950/60 p-7">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(236,72,153,0.16),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(6,182,212,0.15),transparent_26%),radial-gradient(circle_at_50%_95%,rgba(168,85,247,0.12),transparent_32%)]" />
      <motion.div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/60 to-transparent"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:44px_44px]" />

      <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="max-w-4xl">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge variant="neon" size="sm">PHASE 8</Badge>
            <Badge variant="secondary" size="sm">Cinematic autoplay demo</Badge>
            <Badge variant={isAutoplay ? 'success' : 'warning'} size="sm">{isAutoplay ? 'Autoplay engaged' : 'Manual replay'}</Badge>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white xl:text-5xl">
            Autonomous AI <span className="bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">Demo Experience</span>
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-gray-400 xl:text-base">
            {sequence?.tagline ?? 'Loading cinematic attack replay...'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 xl:min-w-[320px]">
          <HeroMetric icon={<Film className="h-5 w-5" />} label="Story beats" value={`${total}`} />
          <HeroMetric icon={<PlayCircle className="h-5 w-5" />} label="Current beat" value={`${currentIndex + 1}/${Math.max(total, 1)}`} />
          <HeroMetric icon={<Radar className="h-5 w-5" />} label="Demo mode" value="live" />
          <HeroMetric icon={<Sparkles className="h-5 w-5" />} label="Narration" value="adaptive" />
        </div>
      </div>
    </section>
  );
}

function HeroMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-700/40 bg-slate-900/60 p-3">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-fuchsia-500/10 text-fuchsia-300">{icon}</div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
    </div>
  );
}
