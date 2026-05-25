/**
 * ReplayControlDeck
 * Controls for autoplay, scrubbing, speed, and replay mode.
 */

import { Pause, Play, SkipBack, SkipForward, RotateCcw, Gauge } from 'lucide-react';
import { Badge, Button, Card, CardHeader, CardTitle } from '@/components/ui';
import type { DemoSequence } from '@/demo';

export function ReplayControlDeck({
  sequence,
  currentBeatIndex,
  isAutoplay,
  playbackSpeedMs,
  isReplayMode,
  narrationMode,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onJump,
  onSpeedChange,
  onToggleReplay,
  onNarrationMode,
  onReset,
}: {
  sequence: DemoSequence | null;
  currentBeatIndex: number;
  isAutoplay: boolean;
  playbackSpeedMs: number;
  isReplayMode: boolean;
  narrationMode: 'guided' | 'autonomous';
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onJump: (index: number) => void;
  onSpeedChange: (ms: number) => void;
  onToggleReplay: () => void;
  onNarrationMode: (mode: 'guided' | 'autonomous') => void;
  onReset: () => void;
}) {
  const total = sequence?.beats.length ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle><Gauge className="h-5 w-5 text-cyan-400" />Replay Control Deck</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Badge variant={isAutoplay ? 'success' : 'warning'} size="sm">{isAutoplay ? 'autoplay' : 'paused'}</Badge>
          <Badge variant="secondary" size="sm">{playbackSpeedMs}ms / beat</Badge>
          <Badge variant="primary" size="sm">{narrationMode}</Badge>
        </div>
      </CardHeader>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button variant={isAutoplay ? 'danger' : 'primary'} onClick={isAutoplay ? onPause : onPlay}>
            {isAutoplay ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isAutoplay ? 'Pause' : 'Autoplay'}
          </Button>
          <Button variant="ghost" onClick={onPrevious}><SkipBack className="h-4 w-4" /></Button>
          <Button variant="ghost" onClick={onNext}><SkipForward className="h-4 w-4" /></Button>
          <Button variant="ghost" onClick={onReset}><RotateCcw className="h-4 w-4" /></Button>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-[11px] text-gray-500">
            <span>Investigation replay scrubber</span>
            <span className="font-mono text-white">{Math.min(currentBeatIndex + 1, Math.max(total, 1))}/{Math.max(total, 1)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(total - 1, 0)}
            step={1}
            value={currentBeatIndex}
            onChange={(event) => onJump(Number(event.target.value))}
            className="w-full accent-cyan-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-700/40 bg-slate-950/40 p-3">
            <p className="mb-2 text-[10px] uppercase tracking-wider text-gray-500">Playback speed</p>
            <div className="flex gap-2">
              {[2400, 3600, 5200].map((speed) => (
                <button
                  key={speed}
                  onClick={() => onSpeedChange(speed)}
                  className={`rounded-lg px-3 py-1.5 text-[11px] border ${playbackSpeedMs === speed ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300' : 'border-slate-700/40 bg-slate-900/60 text-gray-400'}`}
                >
                  {speed}ms
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-700/40 bg-slate-950/40 p-3">
            <p className="mb-2 text-[10px] uppercase tracking-wider text-gray-500">Narration mode</p>
            <div className="flex gap-2">
              {(['autonomous', 'guided'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onNarrationMode(mode)}
                  className={`rounded-lg px-3 py-1.5 text-[11px] border ${narrationMode === mode ? 'border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300' : 'border-slate-700/40 bg-slate-900/60 text-gray-400'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onToggleReplay}
          className={`w-full rounded-xl border px-4 py-2 text-sm transition-all ${isReplayMode ? 'border-green-500/35 bg-green-500/10 text-green-300' : 'border-slate-700/40 bg-slate-950/40 text-gray-400'}`}
        >
          Replay loop {isReplayMode ? 'enabled' : 'disabled'}
        </button>
      </div>
    </Card>
  );
}
