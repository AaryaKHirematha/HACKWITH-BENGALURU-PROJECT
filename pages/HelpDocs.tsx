/**
 * Help & Docs Page
 * Cyberpunk enterprise documentation, interactive API playground, and architecture references.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, BookOpen, Terminal, Command, Send, Sparkles, Copy } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge, Button } from '@/components/ui';
import { toastSuccess } from '@/components/ui/toast';
import { cn } from '@/utils/cn';

const faqList = [
  { q: 'How does CascadeFlow optimize token costs in real time?', a: 'CascadeFlow evaluates incoming telemetry signals against confidence thresholds. If a cheap Tier 1 model (e.g. OCR or fast classification) achieves sufficient confidence (>74%), the request bypasses expensive Frontier models, yielding up to 60-80% cost savings.' },
  { q: 'What is Hindsight Memory Intelligence?', a: 'Hindsight Memory is an evolving force-directed graph repository where autonomous agents store extracted artifacts, behavioral observations, and attack chain patterns. As new threats arrive, agents query this memory mesh to instantly correlate historical context.' },
  { q: 'Can I assign a threat event to a human SOC analyst?', a: 'Yes. On any incident card or within the Threat Correlation Workbench, clicking "Assign" allows you to dispatch containment tasks directly to human shift leads or specialized autonomous agents (e.g. Sentinel, Nexus, Tracker).' },
  { q: 'How does the Phase 7 Forensic Reasoning Engine predict attack steps?', a: 'The forensic engine cross-correlates multi-source telemetry (physical badge logs, CCTV alerts, network intrusions) against heuristic pattern signatures (e.g. physical-to-digital pivot) to calculate future attack probabilities and suggest proactive containment.' },
];

const apiEndpoints = [
  { method: 'GET', url: '/api/v1/threats', desc: 'Retrieve real-time synthetic simulation telemetry and filtered incident streams.' },
  { method: 'POST', url: '/api/v1/cascade/route', desc: 'Ingest raw threat signals and execute adaptive multi-tier model routing.' },
  { method: 'GET', url: '/api/v1/agents/mesh', desc: 'Query active runtime status across all six specialized autonomous agents.' },
  { method: 'POST', url: '/api/v1/forensics/correlate', desc: 'Trigger deep forensic heuristic correlation and suspect timeline generation.' },
];

export function HelpDocs() {
  const [activeTab, setActiveTab] = useState<'docs' | 'api' | 'faq' | 'keys'>('docs');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState(apiEndpoints[0].url);

  const handleTestApi = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setApiResponse(JSON.stringify({
        status: 200,
        message: 'AEGIS Enterprise Mesh Endpoint OK',
        timestamp: new Date().toISOString(),
        executionSlaMs: 14.2,
        activeClusterNodes: 6,
        data: { payloadStatus: 'Ingested and indexed into Hindsight Memory.' },
      }, null, 2));
      toastSuccess({ title: 'API Response Received', description: `200 OK from ${selectedEndpoint}.` });
    }, 700);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    toastSuccess({ title: 'Code Copied', description: 'Snippet copied to clipboard.' });
  };

  return (
    <div className="space-y-6 font-mono">
      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-slate-950/60 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.15),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_35%)]" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="neon" size="sm">KNOWLEDGE BASE</Badge>
              <Badge variant="info" size="sm">v5.2.0 Spec</Badge>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">Platform Documentation &amp; API Reference</h1>
            <p className="mt-1 text-sm text-gray-400 max-w-2xl font-sans">
              Complete architectural specification, interactive REST API testing harness, and operational guidelines for the AEGIS Autonomous Threat Copilot.
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl">
            <BookOpen className="h-4 w-4 text-purple-400" />
            <span>Spec Index: <span className="text-white font-bold">100% Complete</span></span>
          </div>
        </div>
      </section>

      {/* ── NAVIGATION TABS ── */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
        {(['docs', 'api', 'faq', 'keys'] as const).map((t) => {
          const labels: Record<string, string> = { docs: 'Architecture Manual', api: 'Interactive API Testbed', faq: 'Knowledge Base FAQ', keys: 'Keyboard Shortcuts' };
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={cn(
                'px-4 py-2 rounded-xl border transition-all uppercase tracking-wider font-bold flex-shrink-0',
                activeTab === t ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-lg shadow-purple-500/5' : 'bg-slate-900/60 border-slate-800 text-gray-400 hover:border-slate-700',
              )}
            >
              {labels[t]}
            </button>
          );
        })}
      </div>

      {/* ── TAB CONTENT ── */}
      <AnimatePresence mode="wait">
        {activeTab === 'docs' && (
          <motion.div key="docs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <Card glow="purple">
              <CardHeader>
                <CardTitle><Sparkles className="h-5 w-5 text-purple-400" />System Architecture &amp; Data Flow</CardTitle>
              </CardHeader>
              <div className="space-y-4 text-xs text-gray-300 font-mono leading-relaxed">
                <p>
                  The AEGIS platform is built on an asynchronous, multi-tiered intelligence routing engine designed to operate autonomously within enterprise SOC environments.
                </p>
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-4">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4 text-center md:text-left">
                    <div className="flex-1 p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-cyan-400 font-bold block mb-1">1. Ingest Telemetry</span>
                      <span className="text-[11px] text-gray-400">SIEM streams, physical access logs, CCTV alarms</span>
                    </div>
                    <span className="text-gray-500 font-bold">→</span>
                    <div className="flex-1 p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                      <span className="text-purple-400 font-bold block mb-1">2. CascadeFlow Routing</span>
                      <span className="text-[11px] text-gray-400">Adaptive model selection based on latency &amp; tokens</span>
                    </div>
                    <span className="text-gray-500 font-bold">→</span>
                    <div className="flex-1 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                      <span className="text-green-400 font-bold block mb-1">3. Multi-Agent Mesh</span>
                      <span className="text-[11px] text-gray-400">Sentinel, Nexus, Arbiter, Tracker, Auditor, Chronicler</span>
                    </div>
                  </div>
                  <div className="text-center pt-2">
                    <span className="text-amber-400 font-bold block mb-1">4. Hindsight Memory &amp; Forensic Output</span>
                    <span className="text-gray-400">Persistent threat pattern correlation and suspect timeline synthesis</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'api' && (
          <motion.div key="api" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
            <Card glow="cyan">
              <CardHeader>
                <CardTitle><Terminal className="h-5 w-5 text-cyan-400" />Interactive API Testbed</CardTitle>
              </CardHeader>
              <form onSubmit={handleTestApi} className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-mono mb-2 block">Select Enterprise Endpoint</label>
                  <select
                    value={selectedEndpoint}
                    onChange={(e) => setSelectedEndpoint(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 p-3 text-white font-mono text-xs"
                  >
                    {apiEndpoints.map((ep) => (
                      <option key={ep.url} value={ep.url}>{ep.method} {ep.url}</option>
                    ))}
                  </select>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-gray-400 space-y-1">
                  <span className="text-gray-500 text-[10px] uppercase tracking-wider block mb-1">Endpoint Specification</span>
                  <p className="text-white font-bold">{apiEndpoints.find((e) => e.url === selectedEndpoint)?.desc}</p>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-mono mb-2 block">Request Payload (JSON Optional)</label>
                  <textarea
                    rows={4}
                    defaultValue={JSON.stringify({ clientNode: "soc-california-west", compressionLevel: "high" }, null, 2)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-cyan-300 font-mono text-xs"
                  />
                </div>

                <Button variant="primary" type="submit" className="w-full" loading={isTesting}>
                  <Send className="h-4 w-4 mr-2" />
                  Execute REST API Request
                </Button>
              </form>
            </Card>

            <Card className="flex flex-col h-full min-h-[380px]" noPadding>
              <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <span className="text-xs text-white font-bold flex items-center gap-2 font-mono">
                  <Terminal className="h-4 w-4 text-green-400" /> API JSON Response Output
                </span>
                {apiResponse && (
                  <Button variant="ghost" size="sm" onClick={() => handleCopyCode(apiResponse)}>
                    <Copy className="h-3 w-3 mr-1" /> Copy Output
                  </Button>
                )}
              </div>
              <div className="flex-1 p-4 bg-slate-950 font-mono text-xs overflow-y-auto max-h-[380px]">
                {!apiResponse ? (
                  <div className="h-full flex items-center justify-center text-gray-600">// Execute a request on the left to inspect raw output.</div>
                ) : (
                  <pre className="text-green-400 leading-relaxed overflow-x-auto">{apiResponse}</pre>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'faq' && (
          <motion.div key="faq" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4 font-mono">
            {faqList.map((f, idx) => (
              <Card key={idx} className="hover:border-purple-500/40 transition-colors">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-white">{f.q}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {activeTab === 'keys' && (
          <motion.div key="keys" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
            <Card glow="cyan">
              <CardHeader>
                <CardTitle><Command className="h-5 w-5 text-cyan-400" />Global Keyboard Shortcuts</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {[
                  { k: ['Cmd', 'K'], label: 'Open Command Global Search' },
                  { k: ['Esc'], label: 'Close Active Modal / Drawer' },
                  { k: ['Alt', 'N'], label: 'Toggle Notifications Panel' },
                  { k: ['Alt', 'S'], label: 'Toggle Quick Settings Panel' },
                  { k: ['Shift', 'R'], label: 'Refresh Telemetry Streams' },
                  { k: ['Shift', 'A'], label: 'Open Threat Assignment Hub' },
                ].map(({ k, label }) => (
                  <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 flex items-center justify-between">
                    <span className="text-gray-300 font-semibold">{label}</span>
                    <div className="flex items-center gap-1">
                      {k.map((key) => (
                        <kbd key={key} className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300 text-[10px] font-bold">
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
