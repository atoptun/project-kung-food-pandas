import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import UserCard from './user-card';

const followAction = { isFollowing: false, isPending: false, onToggle: fn() };

const meta = {
  title: 'Users/UserCard',
  component: UserCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 846 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    entry: {
      user: { id: 'user-1', name: 'Victoria', avatar: null },
      recipesCount: 12,
      topRecipes: Array.from({ length: 4 }, (_, i) => ({
        id: `recipe-${i}`,
        title: 'Bakewell tart',
        thumb: 'https://ftp.goit.study/img/so-yummy/preview/Bakewell%20tart.jpg',
      })),
    },
    followAction,
  },
} satisfies Meta<typeof UserCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Follower: Story = {};
export const Following: Story = { args: { followAction: { ...followAction, isFollowing: true } } };
export const Pending: Story = { args: { followAction: { ...followAction, isPending: true } } };
export const CurrentUser: Story = { args: { followAction: undefined } };
