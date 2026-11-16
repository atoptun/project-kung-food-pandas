import { create } from 'zustand';

export type NotificationType = 'error' | 'success';

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
}

interface NotificationsState {
  notifications: Notification[];
  push: (type: NotificationType, message: string) => void;
  dismiss: (id: number) => void;
}

const AUTO_DISMISS_MS = 5000;

let nextId = 1;

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],

  push: (type, message) => {
    const id = nextId++;
    set({ notifications: [...get().notifications, { id, type, message }] });
    setTimeout(() => get().dismiss(id), AUTO_DISMISS_MS);
  },

  dismiss: (id) => {
    set({ notifications: get().notifications.filter((item) => item.id !== id) });
  },
}));

/** Shared notifications API for pages and non-React code (query client, interceptors). */
export const notify = {
  error: (message: string) => useNotificationsStore.getState().push('error', message),
  success: (message: string) => useNotificationsStore.getState().push('success', message),
};
