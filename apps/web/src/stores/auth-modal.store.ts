import { create } from 'zustand';

export type AuthModalView = 'sign-in' | 'sign-up' | 'logout';

/** Router location state that asks the destination page to open the auth dialog. */
export type AuthModalRedirectState = {
  authModal?: AuthModalView;
  from?: string;
};

export type SuccessCallback = () => void;

interface AuthModalState {
  view: AuthModalView | null;
  redirectTo: string | null;
  open: (view: AuthModalView, redirectTo?: string | null) => void;
  onSuccess: SuccessCallback | null;
  openSignIn: (onSuccess?: unknown) => void;
  openSignUp: (onSuccess?: unknown) => void;
  openLogout: () => void;
  close: () => void;
}

/**
 * Single source of truth for the shared auth dialog (rendered once in Layout).
 * Pages open it with `useAuthModalStore((s) => s.openSignIn)` instead of rendering their own.
 */
export const useAuthModalStore = create<AuthModalState>((set) => ({
  view: null,
  redirectTo: null,
  open: (view, redirectTo = null) => set({ view, redirectTo }),
  onSuccess: null,
  openSignIn: (onSuccess: unknown) =>
    set({
      view: 'sign-in',
      onSuccess: typeof onSuccess === 'function' ? (onSuccess as SuccessCallback) : null,
    }),
  openSignUp: (onSuccess: unknown) =>
    set({
      view: 'sign-up',
      onSuccess: typeof onSuccess === 'function' ? (onSuccess as SuccessCallback) : null,
    }),
  openLogout: () => set({ view: 'logout', onSuccess: null, redirectTo: null }),
  close: () => set({ view: null, onSuccess: null, redirectTo: null }),
}));
