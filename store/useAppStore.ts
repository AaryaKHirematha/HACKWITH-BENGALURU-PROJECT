/**
 * Application Store
 * Global UI state management using Zustand
 */

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { AppState } from './types';

const initialState = {
  sidebarExpanded: true,
  sidebarWidth: 260,
  theme: 'cyberpunk' as const,
  commandPaletteOpen: false,
  notificationsPanelOpen: false,
  settingsPanelOpen: false,
  activeModalId: null as string | null,
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        toggleSidebar: () => 
          set((state) => ({ 
            sidebarExpanded: !state.sidebarExpanded,
            sidebarWidth: state.sidebarExpanded ? 64 : 260
          })),

        setSidebarExpanded: (expanded: boolean) => 
          set({ 
            sidebarExpanded: expanded,
            sidebarWidth: expanded ? 260 : 64
          }),

        toggleCommandPalette: () => 
          set((state) => ({ 
            commandPaletteOpen: !state.commandPaletteOpen 
          })),

        toggleNotificationsPanel: () => 
          set((state) => ({ 
            notificationsPanelOpen: !state.notificationsPanelOpen 
          })),

        toggleSettingsPanel: () => 
          set((state) => ({ 
            settingsPanelOpen: !state.settingsPanelOpen 
          })),

        openModal: (modalId: string) => 
          set({ activeModalId: modalId }),

        closeModal: () => 
          set({ activeModalId: null }),

        setTheme: (theme) => 
          set({ theme }),
      }),
      {
        name: 'aegis-app-store',
        partialize: (state) => ({
          sidebarExpanded: state.sidebarExpanded,
          theme: state.theme,
        }),
      }
    ),
    { name: 'AppStore' }
  )
);
