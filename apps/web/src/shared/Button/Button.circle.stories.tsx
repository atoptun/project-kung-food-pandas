import type { Meta, StoryObj } from '@storybook/react-vite';

import Icon from '@/shared/Icon/Icon';

import Button from './Button';

const meta = {
  title: 'Shared/UI/Button',
  component: Button.Circle,
  parameters: {
    layout: 'centered',
  },
  args: {
    'aria-label': 'Add to favorites',
    children: <Icon name="heart" />,
  },
  argTypes: {
    children: { control: false },
    xstyle: { control: false },
    'aria-label': { control: 'text' },
    disabled: { control: 'boolean' },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
    },
  },
} satisfies Meta<typeof Button.Circle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Circle = {} satisfies Story;

export const CircleDisabled = {
  args: { disabled: true },
} satisfies Story;

export const CircleMobile = {
  name: 'Circle Button Mobile / 320px',
  globals: {
    viewport: { value: 'mobileSmall', isRotated: false },
  },
} satisfies Story;
