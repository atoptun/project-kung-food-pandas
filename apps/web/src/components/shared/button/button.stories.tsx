import type { Meta, StoryObj } from '@storybook/react-vite';
import * as stylex from '@stylexjs/stylex';

import { colors } from '@/styles/tokens.stylex';

import Button from './button';

const demoStyles = stylex.create({
  darkSurface: { backgroundColor: colors.black, padding: 24, borderRadius: 16 },
  customWidth: { width: 240 },
});

const meta = {
  title: 'Shared/UI/button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: { control: 'select', options: ['solid', 'outline', 'inverse'] },
    fullWidth: { control: 'boolean' },
    xstyle: { control: false },
    children: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    children: 'Publish',
  },
} satisfies Story;

export const Disabled = {
  args: {
    children: 'Sign in',
    disabled: true,
  },
} satisfies Story;

export const Outline = {
  args: { children: 'Add recipe', variant: 'outline' },
} satisfies Story;

export const Inverse: Story = {
  args: { children: 'Add recipe', variant: 'inverse' },
  decorators: [
    (Story) => (
      <div {...stylex.props(demoStyles.darkSurface)}>
        <Story />
      </div>
    ),
  ],
};

export const FullWidth = {
  args: { children: 'Sign in', fullWidth: true },
  parameters: { layout: 'padded' },
} satisfies Story;

export const CustomWidth = {
  args: { children: 'Publish', xstyle: demoStyles.customWidth },
} satisfies Story;

export const ButtonMobile = {
  name: 'Button Mobile / 320px',
  args: { ...Default.args },
  globals: {
    viewport: { value: 'mobileSmall', isRotated: false },
  },
} satisfies Story;

export const CircleShape = {
  args: { variant: 'outline', shape: 'circle', children: '+' },
} satisfies Story;

export const CircleButtonMobile = {
  name: 'Button Mobile / 320px',
  args: { ...CircleShape.args },
  globals: {
    viewport: { value: 'mobileSmall', isRotated: false },
  },
} satisfies Story;
