import type { Meta, StoryObj } from '@storybook/react-vite';

import heartIcon from '@/assets/icons/heart.svg';

import Icon from './Icon';

const meta = {
  title: 'Shared/UI/Icon',
  component: Icon,
  parameters: { layout: 'centered' },
  args: { src: heartIcon },
  argTypes: {
    src: { control: false },
    size: { control: { type: 'number', min: 1, max: 128, step: 1 } },
    xstyle: { control: false },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = { args: { size: 24 } } satisfies Story;

export const Mobile = {
  name: 'Mobile / 375px',
  globals: { viewport: { value: 'mobile', isRotated: false } },
} satisfies Story;
