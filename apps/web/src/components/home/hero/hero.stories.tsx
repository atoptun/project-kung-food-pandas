import type { Meta, StoryObj } from '@storybook/react-vite';

import Hero from './hero';

const meta: Meta<typeof Hero> = {
  title: 'Home/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof Hero>;

export const Default: Story = {};
