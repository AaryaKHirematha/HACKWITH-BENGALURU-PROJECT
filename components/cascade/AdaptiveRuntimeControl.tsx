/**
 * Adaptive Runtime Control
 * Runtime policy controls for confidence thresholds and escalation rules.
 */

import { BrainCircuit, Gauge, Pause, Play, RotateCcw, ShieldAlert } from 'lucide-react';
import { Badge, Button, Card, CardHeader, CardTitle } from '@/components/ui';
import { useCascadeStore } from '@/cascade';

export function AdaptiveRuntimeControl() {
  const { policy, updatePolicy, isRunning, toggleRuntime, resetRuntime } = useCascadeStore();

  return (
    <Card glow="purple">
      <CardHeader>
        <CardTitle>
          <BrainCircuit className="h-5 w-5 text-purple-400" />
          Adaptive Runtime Control
        </CardTitle>
        <Badge variant={isRunning ? 'success' : 'warning'} size="sm">
          {isRunning ? 'Autonomous' : 'Paused'}
        </Badge>
      </CardHeader>

      <div className="space-y-5">
        <PolicySlider
          icon={<Gauge className="h-4 w-4" />}
          label="Tier 1 confidence threshold"
          value={policy.tier1ConfidenceThreshold}
          min={55}
          max={92}
          onChange={(value) => updatePolicy({ tier1ConfidenceThreshold: value })}
        />
        <PolicySlider
          icon={<ShieldAlert className="h-4 w-4" />}
          label="Anomaly escalation threshold"
          value={policy.anomalyEscalationThreshold}
          min={45}
          max={95}
          onChange={(value) => updatePolicy({ anomalyEscalationThreshold: value })}
        />
        <PolicySlider
          icon={<Gauge className="h-4 w-4" />}
          label="Latency budget"
          value={policy.latencyBudgetMs}
          min={500}
          max={2600}
          suffix="ms"
          onChange={(value) => updatePolicy({ latencyBudgetMs: value })}
        />

        <div className="flex gap-2 pt-1">
          <Button variant={isRunning ? 'danger' : 'primary'} onClick={toggleRuntime} className="flex-1">
            {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isRunning ? 'Pause runtime' : 'Resume runtime'}
          </Button>
          <Button variant="ghost" onClick={resetRuntime}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function PolicySlider({
  icon,
  label,
  value,
  min,
  max,
  suffix = '%',
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-gray-300">
          <span className="text-cyan-400">{icon}</span>
          {label}
        </span>
        <span className="font-mono text-white">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-cyan-500"
      />
    </div>
  );
}