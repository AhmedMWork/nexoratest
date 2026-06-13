// ============================================================
// NEXORA — Auth Store (Admin Authentication)
// ============================================================

import { create } from 'zustand';
import { onAuthChange, loginAdmin, logoutAdmin, getCurrentAdmin } from '@/firebase/auth';
import type { Admin } from '@/types';

interface AuthStore {
  user: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: Admin | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    const admin = await loginAdmin(email, password);
    set({ user: admin, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    await logoutAdmin();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

// Initialize auth state listener
let initialized = false;

export function initAuthListener() {
  if (initialized) return () => {};
  initialized = true;

  return onAuthChange(async (firebaseUser) => {
    const { setUser, setLoading } = useAuthStore.getState();

    if (!firebaseUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const admin = await getCurrentAdmin(firebaseUser);
      if (admin) {
        setUser(admin);
      } else {
        await logoutAdmin();
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  });
}
