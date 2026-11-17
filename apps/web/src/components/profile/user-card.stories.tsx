import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import UserCard from './user-card';

const meta = {
  title: 'Profile/UserCard',
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
    user: {
      id: 'user-1',
      name: 'Victoria',
      avatar: null,
      recipes: Array.from({ length: 4 }, (_, i) => ({
        id: `recipe-${i}`,
        title: 'Bakewell tart',
        thumb: 'https://ftp.goit.study/img/so-yummy/preview/Bakewell%20tart.jpg',
        preview: null,
        time: 40,
      })),
    },
    isSelf: false,
    isFollowing: false,
    isPending: false,
    onToggle: fn(),
  },
} satisfies Meta<typeof UserCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Follower: Story = {};
export const Following: Story = { args: { isFollowing: true } };
export const Pending: Story = { args: { isPending: true } };
export const CurrentUser: Story = { args: { isSelf: true } };
