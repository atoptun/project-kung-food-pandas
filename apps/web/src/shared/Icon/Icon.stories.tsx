import type { Meta, StoryObj } from '@storybook/react-vite';

import Icon from './Icon';

const meta = {
  title: 'Shared/UI/Icon',
  component: Icon,
  parameters: { layout: 'centered' },
  args: { name: 'heart' },
  argTypes: {
    name: {
      control: 'select',
      options: [
        'arrow-up-right',
        'check',
        'chevron-down',
        'chevron-up',
        'cross',
        'eye-off',
        'eye-on',
        'facebook',
        'heart',
        'instagram',
        'minus',
        'plus',
        'trash',
        'upload-photo',
        'youtube',
      ],
    },
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
