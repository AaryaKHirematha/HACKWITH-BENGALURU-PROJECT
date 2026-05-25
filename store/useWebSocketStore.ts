/**
 * WebSocket Store
 * Real-time WebSocket connection state management
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { WebSocketStoreState } from './types';

export const useWebSocketStore = create<WebSocketStoreState>()(
  devtools(
    (set) => ({
      connected: false,
      reconnecting: false,
      lastConnected: null,
      messageCount: 0,

      setConnected: (connected: boolean) => 
        set({ 
          connected,
          lastConnected: connected ? new Date() : undefined,
          reconnecting: false 
        }),

      setReconnecting: (reconnecting: boolean) => 
        set({ reconnecting }),

      incrementMessageCount: () => 
        set((state) => ({ 
          messageCount: state.messageCount + 1 
        })),

      reset: () => 
        set({
          connected: false,
          reconnecting: false,
          lastConnected: undefined,
          messageCount: 0,
        }),
    }),
    { name: 'WebSocketStore' }
  )
);
