import toast from 'react-hot-toast';

/** Shared notifications API for pages and non-React code (query client, interceptors). */
export const notify = {
  // Same message → same id, so a burst of identical errors shows a single toast.
  error: (message: string) =>
    toast.error(message, {
      id: message,
      // Toast-level ariaProps win over Toaster options, so errors get role=alert here.
      ariaProps: { role: 'alert', 'aria-live': 'assertive' },
    }),
  success: (message: string) => toast.success(message),
};
