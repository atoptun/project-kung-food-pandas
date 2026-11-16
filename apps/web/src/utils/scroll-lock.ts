let lockCount = 0;
let initialOverflow = '';

/**
 * Locks page scroll and returns the matching unlock function.
 * Ref-counted: nested dialogs (mobile menu → logout modal) keep the page locked
 * until the last one closes, and the original `overflow` is restored only then.
 */
export function lockBodyScroll(): () => void {
  if (lockCount === 0) {
    initialOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  lockCount += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    lockCount -= 1;
    if (lockCount === 0) {
      document.body.style.overflow = initialOverflow;
    }
  };
}
