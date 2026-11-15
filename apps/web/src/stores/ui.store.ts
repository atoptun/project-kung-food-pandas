import { create } from 'zustand';

interface UIState {
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  isMobileMenuOpen: false,

  openMobileMenu: () => {
    document.body.style.overflow = 'hidden';
    set({ isMobileMenuOpen: true });
  },

  closeMobileMenu: () => {
    document.body.style.overflow = '';
    set({ isMobileMenuOpen: false });
  },

  toggleMobileMenu: () => {
    if (get().isMobileMenuOpen) {
      get().closeMobileMenu();
    } else {
      get().openMobileMenu();
    }
  },
}));
