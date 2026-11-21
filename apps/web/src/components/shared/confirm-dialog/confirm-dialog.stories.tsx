import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import Button from '@/components/shared/button/button';

import ConfirmDialog from './confirm-dialog';

const meta = {
  title: 'Shared/UI/confirm-dialog',
  component: ConfirmDialog,
  parameters: {
    layout: 'centered',
  },
  args: {
    onConfirm: () => {},
    onCancel: () => {},
  },
  argTypes: {
    isOpen: { control: 'boolean' },
    title: { control: 'text' },
    description: { control: 'text' },
    confirmText: { control: 'text' },
    cancelText: { control: 'text' },
    confirmVariant: {
      control: 'select',
      options: ['default', 'danger'],
    },
    isConfirming: { control: 'boolean' },
    onConfirm: { action: 'confirmed' },
    onCancel: { action: 'cancelled' },
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Confirm action',
    description: 'Are you sure you want to proceed with this action?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmVariant: 'default',
    isConfirming: false,
  },
};

export const DangerDelete: Story = {
  args: {
    isOpen: true,
    title: 'Delete recipe?',
    description: 'Are you sure you want to delete this recipe? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    confirmVariant: 'danger',
    isConfirming: false,
  },
};

export const LoadingState: Story = {
  args: {
    isOpen: true,
    title: 'Delete recipe?',
    description: 'Please wait while the recipe is being deleted...',
    confirmText: 'Deleting...',
    cancelText: 'Cancel',
    confirmVariant: 'danger',
    isConfirming: true,
  },
};

export const InteractiveDemo: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <Button onClick={() => setIsOpen(true)}>Open confirm dialog</Button>
        <ConfirmDialog
          {...args}
          isOpen={isOpen}
          onConfirm={() => {
            args.onConfirm?.();
            setIsOpen(false);
          }}
          onCancel={() => {
            args.onCancel?.();
            setIsOpen(false);
          }}
        />
      </div>
    );
  },
  args: {
    isOpen: false,
    title: 'Delete recipe?',
    description: 'Are you sure you want to delete this recipe? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    confirmVariant: 'danger',
    isConfirming: false,
  },
};
