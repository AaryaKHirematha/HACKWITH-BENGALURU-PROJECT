/**
 * Global Modals Container
 * Houses all application modal overlays (Simulation Config, AI Analysis, Threat Assignment, Event Detail).
 */

import { useAppStore } from '@/store';
import { useSimulationStore } from '@/simulation';
import { useAgentOrchestrationStore } from '@/agents';
import { Modal, Button, Badge, Input } from '@/components/ui';
import { EventDetailModal } from '@/components/threat/EventDetailModal';
import { toastSuccess } from '@/components/ui/toast';
import { Brain, Sliders, UserCheck } from 'lucide-react';

export function ModalsContainer() {
  const { activeModalId, closeModal } = useAppStore();
  const { selectedEvent, selectEvent, setConfig } = useSimulationStore();
  const { agents } = useAgentOrchestrationStore();

  const handleSimConfigSave = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const totalEvents = Number(fd.get('totalEvents') ?? 10000);
    const insiderPct = Number(fd.get('insiderPct') ?? 0.15);
    const corrPct = Number(fd.get('corrPct') ?? 0.25);

    setConfig({
      totalEvents,
      insiderThreatPercentage: insiderPct,
      correlatedEventPercentage: corrPct,
    });
    closeModal();
    toastSuccess({ title: 'Config Updated', description: 'Simulation engine parameters successfully applied.' });
  };

  const handleAssignThreat = (agentId: string) => {
    closeModal();
    toastSuccess({ title: 'Threat Assigned', description: `Dispatched incident workflow to agent ${agentId}.` });
  };

  return (
    <>
      {/* 1. EVENT DETAIL MODAL */}
      <EventDetailModal
        event={selectedEvent}
        open={Boolean(selectedEvent)}
        onClose={() => selectEvent(null)}
      />

      {/* 2. SIMULATION CONFIG MODAL */}
      <Modal
        open={activeModalId === 'sim-config'}
        onClose={closeModal}
        title="Simulation Engine Configuration"
        description="Adjust synthetic telemetry generation parameters and threat distribution thresholds."
        size="lg"
      >
        <form onSubmit={handleSimConfigSave} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-400 font-mono mb-1 block">Total Simulated Events</label>
              <Input type="number" name="totalEvents" defaultValue="10000" min="500" max="50000" required />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-400 font-mono mb-1 block">Insider Threat Ratio (0-1)</label>
              <Input type="number" name="insiderPct" defaultValue="0.15" step="0.05" min="0" max="0.5" required />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-400 font-mono mb-1 block">Correlation Mesh Density (0-1)</label>
              <Input type="number" name="corrPct" defaultValue="0.25" step="0.05" min="0" max="0.8" required />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-400 font-mono mb-1 block">Threat Dispersion Matrix</label>
              <select name="matrix" className="w-full rounded-lg bg-slate-900 border border-slate-700 p-2.5 text-sm text-white">
                <option value="balanced">Balanced Enterprise Baseline</option>
                <option value="apt">Advanced Persistent Threat (APT Focus)</option>
                <option value="ransomware">Ransomware Blast Radius</option>
                <option value="insider">High-Risk Malicious Insider</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 p-4 bg-slate-950/60 flex items-center gap-3">
            <Sliders className="h-5 w-5 text-cyan-400 flex-shrink-0" />
            <p className="text-xs text-gray-400 leading-relaxed font-mono">
              Applying changes dynamically re-indexes the event generator. Correlated kill chains and agent task allocations will immediately adapt.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="ghost" onClick={closeModal} type="button">Cancel</Button>
            <Button variant="primary" type="submit">Apply Parameters</Button>
          </div>
        </form>
      </Modal>

      {/* 3. AI ANALYSIS DEEP MODAL */}
      <Modal
        open={activeModalId === 'ai-analysis'}
        onClose={closeModal}
        title="Deep AI Neural Reasoning Matrix"
        description="Comprehensive real-time analysis of active threats, neural pathways, and token efficiency."
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <span className="text-gray-500 text-[10px] uppercase tracking-wider">Active Analysis Threads</span>
              <p className="text-2xl font-bold text-cyan-400 mt-1">12 Concurrent</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <span className="text-gray-500 text-[10px] uppercase tracking-wider">Neural Accuracy SLA</span>
              <p className="text-2xl font-bold text-green-400 mt-1">99.42%</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <span className="text-gray-500 text-[10px] uppercase tracking-wider">Token Economy Ratio</span>
              <p className="text-2xl font-bold text-purple-400 mt-1">3.4x Compressed</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-2">
              <Brain className="h-4 w-4" />
              Multi-Model Tier Allocation
            </div>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/50">
                <span>Tier 1 (Fast Classification / Triage)</span>
                <Badge variant="primary" size="sm">68.2% Request Load</Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/50">
                <span>Tier 2 (Frontier Anomaly Reasoning)</span>
                <Badge variant="warning" size="sm">31.8% Request Load</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-mono">Real-Time Threat Vector Mapping</p>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-gray-400 space-y-1">
              <p><span className="text-cyan-400">[00:23:14]</span> Sentinel → Signal anomaly identified at perimeter checkpoint.</p>
              <p><span className="text-cyan-400">[00:23:16]</span> Nexus → Cross-correlating with 3 prior impossible travel logs.</p>
              <p><span className="text-purple-400">[00:23:18]</span> CascadeFlow → Escalating to Frontier Reasoner due to high blast radius risk.</p>
              <p><span className="text-green-400">[00:23:19]</span> Arbiter → False-positive assessment confirmed at &lt;0.04% probability.</p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <Button variant="primary" onClick={closeModal}>Close Matrix</Button>
          </div>
        </div>
      </Modal>

      {/* 4. THREAT ASSIGNMENT MODAL */}
      <Modal
        open={activeModalId === 'assign-threat'}
        onClose={closeModal}
        title="Dispatch Threat Workflow"
        description="Assign active incident containment and forensic deep-dive tasks to specific autonomous AI agents or human operators."
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-mono">Available Autonomous Agents</p>
          <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
            {agents.map((ag) => (
              <button
                key={ag.id}
                onClick={() => handleAssignThreat(ag.name)}
                className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 flex items-center justify-between hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{ag.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-white">{ag.name}</p>
                    <p className="text-[10px] text-gray-400 capitalize">{ag.role.replace(/_/g, ' ')}</p>
                  </div>
                </div>
                <Badge variant="secondary" size="sm">Dispatch →</Badge>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-mono mb-2">Human SOC Operators</p>
            <button
              onClick={() => handleAssignThreat('SOC Shift Lead (Sarah Chen)')}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3 flex items-center justify-between hover:border-purple-500/50 hover:bg-purple-500/10 transition-all text-left"
            >
              <div className="flex items-center gap-3 text-sm font-bold text-white">
                <UserCheck className="h-5 w-5 text-purple-400" />
                SOC Shift Lead (Sarah Chen)
              </div>
              <Badge variant="info" size="sm">Escalate →</Badge>
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="ghost" onClick={closeModal}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
