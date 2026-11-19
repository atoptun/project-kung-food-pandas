import type { CurrentUserProfileResponse, UserPublicProfileResponse } from '@repo/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import { fn } from 'storybook/test';

import Container from '@/components/shared/container/container';
import { clientEnv } from '@/env';

import ProfileInfo from './profile-info';

const publicProfile = {
  user: { id: 'olivia', name: 'Olivia Brooks', email: 'olivia@example.com', avatar: null },
  recipesCount: 12,
  followersCount: 48,
} satisfies UserPublicProfileResponse;

const ownProfile = {
  ...publicProfile,
  user: { id: 'victoria', name: 'Victoria Moore', email: 'victoria@example.com', avatar: null },
  favoritesCount: 5,
  followingCount: 15,
} satisfies CurrentUserProfileResponse;

const meta = {
  title: 'Profile/ProfileInfo',
  component: ProfileInfo,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <Container>
        <div style={{ maxWidth: 394, marginInline: 'auto' }}>
          <Story />
        </div>
      </Container>
    ),
  ],
  args: {
    profile: ownProfile,
    isOwn: true,
    follows: {
      getStatus: () => false,
      isPending: () => false,
      toggle: fn(),
      isError: false,
      isFetching: false,
      retry: fn(),
    },
  },
} satisfies Meta<typeof ProfileInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OwnProfile: Story = {
  parameters: {
    msw: {
      handlers: [
        http.patch(`${clientEnv.VITE_API_URL}/users/me/avatar`, () =>
          HttpResponse.json(ownProfile),
        ),
      ],
    },
  },
};

export const OtherProfile: Story = { args: { profile: publicProfile, isOwn: false } };
