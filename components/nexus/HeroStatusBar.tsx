/**
 * HeroStatusBar
 * Cinematic top banner with animated system pulse, live threat counters,
 * and global status indicators. Sets the tone for the entire command center.
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Wifi, Activity, Brain, Zap, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';
/* UI primitives available if needed */

interface HeroStatusBarProps {
  totalEvents: number;
  criticalCount: number;
  activeAgents: number;
  totalAgents: number;
  avgConfidence: number;
  isLive: boolean;
}

export function HeroStatusBar({
  totalEvents, criticalCount, activeAgents, totalAgents, avgConfidence, isLive,
}: HeroStatusBarProps) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const i = setInterval(() => setPulse((p) => !p), 2000);
    return () => clearInterval(i);
  }, []);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-cyan-500/20">
      {/* Animated gradient backdrop */}
      <div className="absolute inset-0 bg-[#07090f]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_40%,rgba(6,182,212,0.18),transparent_50%),radial-gradient(ellipse_at_90%_30%,rgba(168,85,247,0.14),transparent_50%),radial-gradient(ellipse_at_50%_90%,rgba(6,182,212,0.06),transparent_40%)]" />
      {/* Scan line */}
      <motion.div
        className="pointer-events-none absolute left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(6,182,212,0.5),transparent)' }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left — Title block */}
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ boxShadow: pulse ? '0 0 40px rgba(6,182,212,0.5)' : '0 0 10px rgba(6,182,212,0.15)' }}
            transition={{ duration: 1 }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/40 bg-cyan-500/10"
          >
            <Shield className="h-7 w-7 text-cyan-400" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white lg:text-3xl">
              AEGIS <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Command Center</span>
            </h1>
            <p className="mt-0.5 text-xs text-gray-500 font-mono tracking-wider">
              AUTONOMOUS THREAT INTELLIGENCE & FORENSICS COPILOT
            </p>
          </div>
        </div>

        {/* Right — Status pills */}
        <div className="flex flex-wrap items-center gap-3">
          <Pill icon={<Wifi className="h-3.5 w-3.5" />} label="LIVE FEED" active={isLive} color="green" />
          <Pill icon={<Activity className="h-3.5 w-3.5" />} label={`${totalEvents.toLocaleString()} EVENTS`} active color="cyan" />
          <Pill icon={<AlertTriangle className="h-3.5 w-3.5" />} label={`${criticalCount} CRITICAL`} active={criticalCount > 0} color="red" />
          <Pill icon={<Brain className="h-3.5 w-3.5" />} label={`${activeAgents}/${totalAgents} AGENTS`} active color="purple" />
          <Pill icon={<Zap className="h-3.5 w-3.5" />} label={`${avgConfidence}% CONF`} active color="cyan" />
        </div>
      </div>
    </section>
  );
}

function Pill({ icon, label, active, color }: { icon: React.ReactNode; label: string; active: boolean; color: string }) {
  const colors: Record<string, string> = {
    green: 'border-green-500/40 bg-green-500/10 text-green-300',
    cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    red: 'border-red-500/40 bg-red-500/10 text-red-300',
    purple: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
  };

  return (
    <div className={cn(
      'flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-wide transition-all',
      active ? colors[color] : 'border-slate-700/50 bg-slate-800/40 text-gray-500',
    )}>
      {active && <span className={cn('h-1.5 w-1.5 rounded-full animate-pulse', color === 'red' ? 'bg-red-400' : color === 'green' ? 'bg-green-400' : color === 'purple' ? 'bg-purple-400' : 'bg-cyan-400')} />}
      {icon}
      {label}
    </div>
  );
}
