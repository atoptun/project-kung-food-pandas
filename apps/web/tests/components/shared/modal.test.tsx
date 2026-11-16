import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import Modal from '@/components/shared/modal/modal';

function renderModal(onClose = vi.fn()) {
  render(
    <Modal isOpen onClose={onClose} aria-labelledby="modal-title">
      <h2 id="modal-title">Test modal</h2>
      <button type="button">First action</button>
      <button type="button">Last action</button>
    </Modal>,
  );
  return { onClose, dialog: screen.getByRole('dialog', { name: 'Test modal' }) };
}

function ModalWithTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open modal
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} aria-label="Triggered modal">
        <button type="button">Inside</button>
      </Modal>
    </>
  );
}

describe('Modal', () => {
  it('renders arbitrary content in an accessible modal dialog', () => {
    const { dialog } = renderModal();

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('button', { name: 'First action' })).toBeInTheDocument();
  });

  it('renders nothing when closed', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} aria-label="Closed modal">
        <p>Hidden content</p>
      </Modal>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('closes on Escape', () => {
    const { onClose } = renderModal();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on the close button', () => {
    const { onClose } = renderModal();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on backdrop click but not on content click', () => {
    const { onClose, dialog } = renderModal();

    fireEvent.click(dialog);
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('locks page scroll while open and restores it after close', () => {
    document.body.style.overflow = 'auto';
    const { unmount } = render(
      <Modal isOpen onClose={vi.fn()} aria-label="Scroll modal">
        <p>Content</p>
      </Modal>,
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('auto');
  });

  it('keeps the page locked until the last of nested dialogs closes', () => {
    document.body.style.overflow = 'auto';
    const outer = render(
      <Modal isOpen onClose={vi.fn()} aria-label="Outer modal">
        <p>Outer</p>
      </Modal>,
    );
    const inner = render(
      <Modal isOpen onClose={vi.fn()} aria-label="Inner modal">
        <p>Inner</p>
      </Modal>,
    );

    inner.unmount();
    expect(document.body.style.overflow).toBe('hidden');

    outer.unmount();
    expect(document.body.style.overflow).toBe('auto');
  });

  it('moves focus inside and traps Tab navigation', () => {
    renderModal();

    const close = screen.getByRole('button', { name: 'Close' });
    const last = screen.getByRole('button', { name: 'Last action' });

    expect(close).toHaveFocus();

    last.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(close).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(last).toHaveFocus();
  });

  it('returns focus to the trigger after closing', () => {
    render(<ModalWithTrigger />);

    const trigger = screen.getByRole('button', { name: 'Open modal' });
    trigger.focus();
    fireEvent.click(trigger);

    expect(screen.getByRole('dialog', { name: 'Triggered modal' })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
