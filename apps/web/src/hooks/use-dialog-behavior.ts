import { type RefObject, useEffect, useRef } from 'react';

import { lockBodyScroll } from '@/utils/scroll-lock';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusable(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

/**
 * Modal dialog behaviour for a mounted container:
 * page scroll lock, initial focus, Tab focus trap, Escape to close
 * and focus return to the previously focused element on unmount.
 */
export function useDialogBehavior(
  containerRef: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const unlockScroll = lockBodyScroll();

    const container = containerRef.current;
    if (container) {
      (getFocusable(container)[0] ?? container).focus();
    }

    return () => {
      unlockScroll();
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [containerRef]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const container = containerRef.current;
      if (!container) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusable(container);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) {
        event.preventDefault();
        container.focus();
        return;
      }

      const active = document.activeElement;
      if (event.shiftKey && (active === first || !container.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !container.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [containerRef]);
}
