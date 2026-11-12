import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

import Select from './Select';

const meta = {
  title: 'Shared/UI/Select',
  component: Select,
  parameters: { layout: 'centered' },
  args: {
    'aria-label': 'Category',
    placeholder: 'Select a category',
    value: '',
    options: [
      { value: 'beef', label: 'Beef' },
      { value: 'breakfast', label: 'Breakfast' },
      { value: 'desserts', label: 'Desserts' },
      { value: 'pasta', label: 'Pasta' },
      { value: 'seafood', label: 'Seafood' },
      { value: 'starter', label: 'Starter', disabled: true },
    ],
    onValueChange: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <Select
        {...args}
        onValueChange={(value) => {
          args.onValueChange(value);
          updateArgs({ value });
        }}
      />
    );
  },
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    options: { control: 'object' },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Selected = {
  args: { value: 'seafood' },
} satisfies Story;

export const Disabled = {
  args: { disabled: true },
} satisfies Story;

export const Mobile = {
  name: 'Mobile / 320px',
  globals: { viewport: { value: 'mobileSmall', isRotated: false } },
  parameters: {
    layout: 'padded',
  },
} satisfies Story;
