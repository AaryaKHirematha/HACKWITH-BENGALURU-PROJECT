/**
 * SOC Team & Audit Log Page
 * Real-time monitoring of security operators, agent assistants, and operator audit trail.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShieldCheck, UserCheck, Activity, Search, Filter, Bot, Key, ExternalLink } from 'lucide-react';
import { Badge, Button, Input } from '@/components/ui';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store';
import { corporateUsers } from '@/simulation/data/realisticData';

const auditLogs = [
  { id: 'log-1', op: 'Sarah Chen (SOC Lead)', action: 'Escalated EVT-1029 to Investigation Agent (Tracker)', ts: new Date(Date.now() - 180000), status: 'success', ip: '10.0.4.15' },
  { id: 'log-2', op: 'John Smith (Security Analyst)', action: 'Pinned IOC hash e3b0c442... to threat intelligence gateway', ts: new Date(Date.now() - 450000), status: 'success', ip: '10.0.4.82' },
  { id: 'log-3', op: 'Mike Rodriguez (System Admin)', action: 'Updated CascadeFlow runtime latency budget threshold to 1300ms', ts: new Date(Date.now() - 1200000), status: 'success', ip: '10.0.12.9' },
  { id: 'log-4', op: 'Autonomous Sentinel (AI Agent)', action: 'Ingested AlienVault OTX stream update (54 new indicators)', ts: new Date(Date.now() - 2400000), status: 'success', ip: 'internal-cluster-mesh' },
  { id: 'log-5', op: 'David Jones (CFO)', action: 'Reviewed executive forensic summary for Operation Shadow Vault', ts: new Date(Date.now() - 3600000), status: 'success', ip: '10.0.2.44' },
];

export function Team() {
  const [filterDept, setFilterDept] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();

  const filteredUsers = corporateUsers.filter((u) => {
    const matchesDept = filterDept === 'all' || u.department.toLowerCase().includes(filterDept);
    const matchesQ = !searchQuery || u.username.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesQ;
  });

  return (
    <div className="space-y-6">
      {/* ── YOUR PROFILE CARD ── */}
      {user && (
        <section className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-slate-950/60 to-purple-500/10 p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_50%,rgba(6,182,212,0.12),transparent_40%)]" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-2xl font-extrabold text-white shadow-lg shadow-cyan-500/30 flex-shrink-0">
              {user.avatarInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="neon" size="sm">YOUR ACCOUNT</Badge>
                <Badge variant="success" size="sm">Active Session</Badge>
              </div>
              <h2 className="text-2xl font-extrabold text-white">{user.username}</h2>
              <p className="mt-1 text-sm text-gray-400 font-mono">{user.email}</p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Clearance Level {user.clearanceLevel}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300">
                  <UserCheck className="h-3.5 w-3.5" />
                  {user.role}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
                  <Key className="h-3.5 w-3.5" />
                  {user.department}
                </span>
                {user.isPrivileged && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300">
                    <Bot className="h-3.5 w-3.5" />
                    Privileged Access
                  </span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 self-start">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-center min-w-32">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">User ID</p>
                <p className="text-sm font-mono text-cyan-300 font-bold">{user.userId}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-slate-950/60 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.15),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_35%)]" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="neon" size="sm">OPERATIONS DECK</Badge>
              <Badge variant="success" size="sm">Zero Trust Verified</Badge>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Security Operations Roster</h1>
            <p className="mt-1 text-sm text-gray-400 max-w-2xl">
              Real-time directory of active SOC analysts, clearance levels, and autonomous AI copilot assistants assigned across active investigation threads.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono">
              <span className="text-gray-400">Total Operators: </span>
              <span className="text-purple-400 font-bold">{corporateUsers.length} Active</span>
            </div>
            <Button variant="primary">
              <Users className="h-4 w-4 mr-2" />
              Manage Roles
            </Button>
          </div>
        </div>
      </section>

      {/* ── SEARCH & FILTER ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/60 border border-slate-800 p-4 rounded-2xl font-mono text-xs">
        <div className="w-full sm:w-80">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search username or email..."
            leftIcon={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          <span className="text-gray-500 uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0 font-mono">
            <Filter className="h-3.5 w-3.5" /> Department:
          </span>
          {(['all', 'it security', 'finance', 'engineering', 'executive'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setFilterDept(d)}
              className={cn(
                'px-3 py-1.5 rounded-lg border transition-all uppercase flex-shrink-0 font-bold',
                filterDept === d ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'bg-slate-900 border-slate-800 text-gray-400 hover:border-slate-700',
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* ── TEAM ROSTER CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence initial={false}>
          {filteredUsers.map((u, idx) => (
            <motion.div
              key={u.userId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.04, 0.4) }}
              className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950/60 p-5 flex flex-col justify-between hover:border-purple-500/40 transition-all shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/40 flex items-center justify-center font-bold text-lg text-white flex-shrink-0">
                      {u.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                        {u.username}
                        <ShieldCheck className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                      </h3>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                  <Badge variant={(u as { accountStatus?: string }).accountStatus === 'suspicious' ? 'warning' : 'success'} size="sm">
                    {(u as { accountStatus?: string }).accountStatus ?? 'active'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-2.5 text-center">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-0.5 flex items-center justify-center gap-1">
                      <Key className="h-3 w-3 text-amber-400" /> Clearance
                    </span>
                    <span className="text-amber-300 font-bold text-sm">Level {u.clearanceLevel}</span>
                  </div>
                  <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-2.5 text-center">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-0.5 flex items-center justify-center gap-1">
                      <UserCheck className="h-3 w-3 text-cyan-400" /> Department
                    </span>
                    <span className="text-white font-bold text-xs truncate block">{u.department}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3.5 space-y-1.5 font-mono text-xs">
                  <div className="flex items-center gap-2 text-purple-400 font-bold">
                    <Bot className="h-4 w-4 flex-shrink-0 text-cyan-400 animate-pulse" />
                    <span>AI Copilot Pairing:</span>
                  </div>
                  <p className="text-gray-300 text-[11px] leading-relaxed">
                    {u.role === 'SOC Lead' ? 'Assigned to Sentinel & Nexus for real-time investigation synthesis.' : 'Assigned to Tracker for deep forensic timeline construction.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-mono text-gray-500">
                <span>ID: {u.userId}</span>
                <span className="text-cyan-400 hover:underline cursor-pointer flex items-center gap-1">
                  Audit logs <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── RECENT OPERATOR AUDIT TRAIL ── */}
      <div className="space-y-4 pt-6">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white font-mono">Recent Operator Audit Trail</h2>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 overflow-hidden shadow-xl">
          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-gray-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Operator / System Agent</th>
                  <th className="p-4">Action Taken</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Origin IP</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-gray-300">
                {auditLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-cyan-400" />
                      {l.op}
                    </td>
                    <td className="p-4 text-gray-200">{l.action}</td>
                    <td className="p-4 text-gray-400">{l.ts.toLocaleTimeString()}</td>
                    <td className="p-4 text-purple-400">{l.ip}</td>
                    <td className="p-4 text-right">
                      <Badge variant="success" size="sm">{l.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
