import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ==========================================
// INTERFACES & TYPES
// ==========================================
export type Role = 'Admin' | 'Pelapor' | 'Staf' | 'Teknisi';

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  status: string;
  lastLogin: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: number;
}

// ==========================================
// ZUSTAND STORE
// ==========================================
interface AppState {
  // States
  currentUser: User | null;
  theme: 'dark' | 'light';
  notifications: Notification[];
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  toggleTheme: () => void;
  
  // Notification Actions
  addNotification: (message: string, type?: Notification['type']) => void;
  removeNotification: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      theme: 'dark',
      notifications: [],

      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      login: (user) => set({ currentUser: user }),

      logout: () => set({ currentUser: null }),

      addNotification: (message, type = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        const newNotification: Notification = {
          id,
          message,
          type,
          timestamp: Date.now(),
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 5),
        }));

        // Auto remove after 5 seconds
        setTimeout(() => {
          get().removeNotification(id);
        }, 5000);
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },
    }),
    {
      name: 'helpdesk-dart-storage-v3',
      partialize: (state) => ({ 
        currentUser: state.currentUser, 
        theme: state.theme 
      }),
    }
  )
);
