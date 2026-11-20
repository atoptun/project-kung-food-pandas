import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import FollowButton from './follow-button';

const meta = {
  title: 'Users/FollowButton',
  component: FollowButton,
  tags: ['autodocs'],
  args: { isFollowing: false, isPending: false, onToggle: fn() },
} satisfies Meta<typeof FollowButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotFollowing: Story = {};
export const Following: Story = { args: { isFollowing: true, variant: 'compact' } };
export const Pending: Story = { args: { isFollowing: true, isPending: true, variant: 'compact' } };
