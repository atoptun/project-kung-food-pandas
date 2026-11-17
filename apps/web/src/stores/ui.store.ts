import { create } from 'zustand';

interface UIState {
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
}

// Page scroll lock is handled by the mobile menu dialog itself (useDialogBehavior).
export const useUIStore = create<UIState>((set, get) => ({
  isMobileMenuOpen: false,

  openMobileMenu: () => set({ isMobileMenuOpen: true }),

  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  toggleMobileMenu: () => set({ isMobileMenuOpen: !get().isMobileMenuOpen }),
}));
