/**
 * IoC Database Page
 * Searchable, enriched repository of Indicators of Compromise.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Search, ShieldAlert, Filter, Copy, RefreshCw, CheckCircle2, Globe, FileCode, Mail } from 'lucide-react';
import { Badge, Button, Input } from '@/components/ui';
import { useSimulationStore } from '@/simulation';
import { cn } from '@/utils/cn';
import { toastSuccess } from '@/components/ui/toast';
import type { ThreatEvent } from '@/simulation/types';

interface ExtractedIOC {
  id: string;
  type: 'ip' | 'domain' | 'hash' | 'email';
  value: string;
  confidence: number;
  threatLevel: string;
  sourceEventId: string;
  firstSeen: Date;
  status: 'active' | 'quarantined' | 'false_positive';
}

function extractIOCsFromEvents(events: ThreatEvent[]): ExtractedIOC[] {
  const iocs: ExtractedIOC[] = [];
  const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
  const hashRegex = /\b[a-f0-9]{32,64}\b/gi;
  const domainRegex = /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,6}\b/gi;
  const emailRegex = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi;

  const seen = new Set<string>();

  for (const ev of events) {
    const text = `${ev.title} ${ev.description} ${ev.aiSummary} ${(ev.tags ?? []).join(' ')}`;
    
    // IPs
    const ips = text.match(ipRegex) ?? [];
    for (const ip of ips) {
      if (!seen.has(ip) && !ip.startsWith('10.')) {
        seen.add(ip);
        iocs.push({
          id: `ioc-${seen.size}`,
          type: 'ip',
          value: ip,
          confidence: ev.confidenceScore,
          threatLevel: ev.threatLevel,
          sourceEventId: ev.eventId,
          firstSeen: new Date(ev.timestamp),
          status: ev.threatLevel === 'critical' || ev.threatLevel === 'high' ? 'active' : 'quarantined',
        });
      }
    }

    // Hashes
    const hashes = text.match(hashRegex) ?? [];
    for (const hash of hashes) {
      if (!seen.has(hash) && hash.length >= 32) {
        seen.add(hash);
        iocs.push({
          id: `ioc-${seen.size}`,
          type: 'hash',
          value: hash,
          confidence: Math.min(ev.confidenceScore + 10, 99),
          threatLevel: ev.threatLevel,
          sourceEventId: ev.eventId,
          firstSeen: new Date(ev.timestamp),
          status: 'active',
        });
      }
    }

    // Domains
    const domains = text.match(domainRegex) ?? [];
    for (const domain of domains) {
      if (!seen.has(domain) && domain.includes('-') && domain.length > 8) {
        seen.add(domain);
        iocs.push({
          id: `ioc-${seen.size}`,
          type: 'domain',
          value: domain,
          confidence: ev.confidenceScore,
          threatLevel: ev.threatLevel,
          sourceEventId: ev.eventId,
          firstSeen: new Date(ev.timestamp),
          status: 'active',
        });
      }
    }

    // Emails
    const emails = text.match(emailRegex) ?? [];
    for (const email of emails) {
      if (!seen.has(email) && !email.includes('aegis')) {
        seen.add(email);
        iocs.push({
          id: `ioc-${seen.size}`,
          type: 'email',
          value: email,
          confidence: Math.max(ev.confidenceScore - 15, 50),
          threatLevel: ev.threatLevel,
          sourceEventId: ev.eventId,
          firstSeen: new Date(ev.timestamp),
          status: 'quarantined',
        });
      }
    }
  }

  return iocs;
}

export function IocDatabase() {
  const { events } = useSimulationStore();
  const allIOCs = useMemo(() => extractIOCsFromEvents(events), [events]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [enrichingId, setEnrichingId] = useState<string | null>(null);

  const filteredIOCs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return allIOCs.filter((ioc) => {
      const matchesQ = !q || ioc.value.toLowerCase().includes(q) || ioc.sourceEventId.toLowerCase().includes(q);
      const matchesType = filterType === 'all' || ioc.type === filterType;
      return matchesQ && matchesType;
    });
  }, [allIOCs, searchQuery, filterType]);

  const handleEnrich = (id: string) => {
    setEnrichingId(id);
    setTimeout(() => {
      setEnrichingId(null);
      toastSuccess({ title: 'IOC Enriched', description: 'Cross-node reputation and WHOIS intelligence successfully attached.' });
    }, 800);
  };

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
    toastSuccess({ title: 'Indicator Copied', description: `${val} copied to clipboard.` });
  };

  const typeIcons = {
    ip: <Globe className="h-4 w-4 text-cyan-400" />,
    domain: <Globe className="h-4 w-4 text-purple-400" />,
    hash: <FileCode className="h-4 w-4 text-amber-400" />,
    email: <Mail className="h-4 w-4 text-rose-400" />,
  };

  return (
    <div className="space-y-6">
      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950/60 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_30%,rgba(6,182,212,0.15),transparent_35%),radial-gradient(circle_at_90%_70%,rgba(168,85,247,0.1),transparent_35%)]" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="cyber" size="sm">FORENSIC REPOSITORY</Badge>
              <Badge variant="success" size="sm">Live SIEM Sync</Badge>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Indicators of Compromise (IoC) Database</h1>
            <p className="mt-1 text-sm text-gray-400 max-w-2xl">
              Centralized repository of active malicious artifacts extracted from real-time simulation streams. Enrich indicators, inspect confidence vectors, and enforce zero-trust network quarantine.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl">
            <Database className="h-4 w-4 text-cyan-400 flex-shrink-0" />
            <span>Total Cataloged IOCs: <span className="text-white font-bold">{allIOCs.length.toLocaleString()}</span></span>
          </div>
        </div>
      </section>

      {/* ── SEARCH & FILTERS ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
        <div className="w-full sm:w-80">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search indicator or source EVT..."
            leftIcon={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 font-mono text-xs">
          <span className="text-gray-500 uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0">
            <Filter className="h-3.5 w-3.5" /> Type:
          </span>
          {(['all', 'ip', 'domain', 'hash', 'email'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={cn(
                'px-3 py-1.5 rounded-lg border transition-all uppercase flex-shrink-0 font-bold',
                filterType === t ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-slate-900 border-slate-800 text-gray-400 hover:border-slate-700',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── IOC TABLE ── */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-900 text-gray-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Artifact Type &amp; Value</th>
                <th className="p-4">Confidence</th>
                <th className="p-4">Source EVT</th>
                <th className="p-4">First Observed</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-gray-300">
              <AnimatePresence initial={false}>
                {filteredIOCs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-500 font-mono">
                      <ShieldAlert className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                      No indicators match the specified search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredIOCs.map((ioc) => (
                    <motion.tr
                      key={ioc.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-900/40 transition-colors group"
                    >
                      <td className="p-4 font-bold text-white flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex-shrink-0">
                          {typeIcons[ioc.type]}
                        </div>
                        <span className="truncate max-w-xs md:max-w-md">{ioc.value}</span>
                        <button
                          onClick={() => handleCopy(ioc.value)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-white flex-shrink-0"
                          title="Copy to clipboard"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </td>
                      <td className="p-4 font-bold">
                        <span className={cn(ioc.confidence >= 80 ? 'text-purple-400' : 'text-cyan-400')}>
                          {ioc.confidence}%
                        </span>
                      </td>
                      <td className="p-4 text-cyan-400 font-bold hover:underline cursor-pointer">
                        <a href="/reports">{ioc.sourceEventId}</a>
                      </td>
                      <td className="p-4 text-gray-400">
                        {ioc.firstSeen.toLocaleTimeString()}
                      </td>
                      <td className="p-4">
                        <Badge variant={ioc.status === 'active' ? 'danger' : 'warning'} size="sm">
                          {ioc.status === 'active' ? 'ACTIVE THREAT' : 'QUARANTINED'}
                        </Badge>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEnrich(ioc.id)}
                          disabled={enrichingId === ioc.id}
                        >
                          <RefreshCw className={cn('h-3.5 w-3.5 mr-1.5', enrichingId === ioc.id && 'animate-spin')} />
                          {enrichingId === ioc.id ? 'Enriching...' : 'Enrich IOC'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toastSuccess({ title: 'Quarantine Applied', description: `Enforced network perimeter block for ${ioc.value}.` })}
                          className="text-green-400 hover:bg-green-500/10"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Quarantine
                        </Button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
