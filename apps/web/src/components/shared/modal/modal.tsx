import * as stylex from '@stylexjs/stylex';
import { type ReactNode, useRef } from 'react';
import { createPortal } from 'react-dom';

import Icon from '@/components/shared/icon/icon';
import { useDialogBehavior } from '@/hooks/use-dialog-behavior';

import { styles } from './modal.stylex';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  xstyle?: stylex.StyleXStyles;
} & (
  | { 'aria-labelledby': string; 'aria-label'?: never }
  | { 'aria-label': string; 'aria-labelledby'?: never }
);

function ModalContent({ onClose, children, xstyle, ...ariaProps }: Omit<ModalProps, 'isOpen'>) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useDialogBehavior(dialogRef, onClose);

  return (
    <div
      {...stylex.props(styles.backdrop)}
      data-testid="modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        {...ariaProps}
        {...stylex.props(styles.dialog, xstyle)}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <button type="button" {...stylex.props(styles.close)} aria-label="Close" onClick={onClose}>
          <Icon name="cross" size={24} />
        </button>
        {children}
      </div>
    </div>
  );
}

/**
 * Shared modal: arbitrary content, backdrop/close button/Escape to close,
 * page scroll lock, focus trap and focus return to the trigger.
 */
function Modal({ isOpen, ...props }: ModalProps) {
  if (!isOpen) return null;

  return createPortal(<ModalContent {...props} />, document.body);
}

export default Modal;
