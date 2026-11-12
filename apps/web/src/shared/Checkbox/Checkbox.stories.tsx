import type { Meta, StoryObj } from '@storybook/react-vite';

import Checkbox from './Checkbox';

const meta = {
  title: 'Shared/UI/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  args: { 'aria-label': 'Select recipe' },
  argTypes: {
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    xstyle: { control: false },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
export const Checked = { args: { defaultChecked: true } } satisfies Story;
export const Disabled = { args: { disabled: true } } satisfies Story;
export const CheckedDisabled = {
  args: { defaultChecked: true, disabled: true },
} satisfies Story;
