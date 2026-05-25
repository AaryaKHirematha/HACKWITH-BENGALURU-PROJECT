/**
 * useDemoStore
 * Playback state for the Phase 8 cinematic demo experience.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DemoSequence } from '../types';

interface DemoState {
  sequence: DemoSequence | null;
  currentBeatIndex: number;
  isAutoplay: boolean;
  playbackSpeedMs: number;
  isReplayMode: boolean;
  narrationMode: 'guided' | 'autonomous';
  loadSequence: (sequence: DemoSequence) => void;
  play: () => void;
  pause: () => void;
  toggleAutoplay: () => void;
  nextBeat: () => void;
  previousBeat: () => void;
  jumpToBeat: (index: number) => void;
  setPlaybackSpeed: (ms: number) => void;
  toggleReplayMode: () => void;
  setNarrationMode: (mode: 'guided' | 'autonomous') => void;
  resetDemo: () => void;
}

export const useDemoStore = create<DemoState>()(
  devtools(
    (set, get) => ({
      sequence: null,
      currentBeatIndex: 0,
      isAutoplay: true,
      playbackSpeedMs: 3600,
      isReplayMode: true,
      narrationMode: 'autonomous',

      loadSequence: (sequence) => set({ sequence, currentBeatIndex: 0 }),
      play: () => set({ isAutoplay: true }),
      pause: () => set({ isAutoplay: false }),
      toggleAutoplay: () => set((state) => ({ isAutoplay: !state.isAutoplay })),
      nextBeat: () => {
        const { sequence, currentBeatIndex, isReplayMode } = get();
        if (!sequence) return;
        const lastIndex = sequence.beats.length - 1;
        if (currentBeatIndex >= lastIndex) {
          set({ currentBeatIndex: isReplayMode ? 0 : lastIndex, isAutoplay: isReplayMode });
          return;
        }
        set({ currentBeatIndex: currentBeatIndex + 1 });
      },
      previousBeat: () => set((state) => ({ currentBeatIndex: Math.max(0, state.currentBeatIndex - 1) })),
      jumpToBeat: (index) => {
        const { sequence } = get();
        if (!sequence) return;
        set({ currentBeatIndex: Math.max(0, Math.min(sequence.beats.length - 1, index)) });
      },
      setPlaybackSpeed: (ms) => set({ playbackSpeedMs: ms }),
      toggleReplayMode: () => set((state) => ({ isReplayMode: !state.isReplayMode })),
      setNarrationMode: (mode) => set({ narrationMode: mode }),
      resetDemo: () => set({ currentBeatIndex: 0, isAutoplay: true, isReplayMode: true, narrationMode: 'autonomous' }),
    }),
    { name: 'DemoStore' },
  ),
);
