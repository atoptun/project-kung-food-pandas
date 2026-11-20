import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

import Container from '@/components/shared/container/container';

import { OWN_PROFILE_TABS } from '../profile.constants';
import ProfileTabs from './profile-tabs';

const meta = {
  title: 'Profile/ProfileTabs',
  component: ProfileTabs,
  parameters: { layout: 'fullscreen' },
  args: { tabs: OWN_PROFILE_TABS, activeTab: 'recipes', onTabChange: fn(), children: null },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    const selected = args.tabs.find((tab) => tab.id === args.activeTab);

    return (
      <Container>
        <ProfileTabs
          {...args}
          onTabChange={(activeTab) => {
            args.onTabChange(activeTab);
            updateArgs({ activeTab });
          }}
        >
          <p>{selected?.label}</p>
        </ProfileTabs>
      </Container>
    );
  },
} satisfies Meta<typeof ProfileTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};
