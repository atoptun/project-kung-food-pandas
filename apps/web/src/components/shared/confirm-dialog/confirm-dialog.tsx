import * as stylex from '@stylexjs/stylex';
import { type ReactNode, useId } from 'react';

import Button from '@/components/shared/button/button';
import Modal from '@/components/shared/modal/modal';
import Typography from '@/components/shared/typography/typography';

import { styles } from './confirm-dialog.stylex';

export type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'default' | 'danger';
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'default',
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();

  return (
    <Modal isOpen={isOpen} onClose={onCancel} aria-labelledby={titleId}>
      <Typography
        as="h2"
        id={titleId}
        variant="h2"
        align="center"
        weight="extraBold"
        uppercase
        xstyle={styles.titleTight}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          as="p"
          variant="main"
          color="darkGray"
          align="center"
          xstyle={styles.description}
        >
          {description}
        </Typography>
      )}

      <div {...stylex.props(styles.actions)}>
        <Button
          fullWidth
          xstyle={confirmVariant === 'danger' ? styles.dangerButton : styles.confirmButton}
          disabled={isConfirming}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
        <Button variant="outline" fullWidth disabled={isConfirming} onClick={onCancel}>
          {cancelText}
        </Button>
      </div>
    </Modal>
  );
}
