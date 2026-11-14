import type { Meta, StoryObj } from '@storybook/react-vite';
import * as stylex from '@stylexjs/stylex';

import Input from './input';

const demoStyles = stylex.create({
  stack: { display: 'grid', gap: 24, width: '100%' },
});

const meta = {
  title: 'Shared/UI/input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  args: { 'aria-label': 'input text' },
  argTypes: {
    variant: { control: 'select', options: ['outline', 'underline'] },
    xstyle: { control: false },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Outline = {
  args: {
    variant: 'outline',
    placeholder: 'input text',
  },
} satisfies Story;

export const Underline = {
  args: {
    ...Outline.args,
    variant: 'underline',
  },
} satisfies Story;

export const PasswordType = {
  args: {
    ...Outline.args,
    type: 'password',
  },
} satisfies Story;

export const Mobile = {
  name: 'Mobile / 375px',
  globals: { viewport: { value: 'mobile', isRotated: false } },
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => (
    <div {...stylex.props(demoStyles.stack)}>
      <Input {...Outline.args} aria-label="Outline input" />
      <Input {...Underline.args} aria-label="Underline input" />
      <Input {...PasswordType.args} aria-label="Password input" />
    </div>
  ),
} satisfies Story;
