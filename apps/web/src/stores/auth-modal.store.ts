import { create } from 'zustand';

export type AuthModalView = 'sign-in' | 'sign-up' | 'logout';

interface AuthModalState {
  view: AuthModalView | null;
  openSignIn: () => void;
  openSignUp: () => void;
  openLogout: () => void;
  close: () => void;
}

/**
 * Single source of truth for the shared auth dialog (rendered once in Layout).
 * Pages open it with `useAuthModalStore((s) => s.openSignIn)` instead of rendering their own.
 */
export const useAuthModalStore = create<AuthModalState>((set) => ({
  view: null,
  openSignIn: () => set({ view: 'sign-in' }),
  openSignUp: () => set({ view: 'sign-up' }),
  openLogout: () => set({ view: 'logout' }),
  close: () => set({ view: null }),
}));
