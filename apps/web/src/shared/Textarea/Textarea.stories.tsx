import type { Meta, StoryObj } from '@storybook/react-vite';
import * as stylex from '@stylexjs/stylex';
import { useArgs } from 'storybook/preview-api';

import Textarea from './Textarea';

const demoStyles = stylex.create({
  container: { width: '100%', maxWidth: 400 },
});

const meta = {
  title: 'Shared/UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'padded',
  },
  args: { value: '', 'aria-label': 'Dish description' },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <div {...stylex.props(demoStyles.container)}>
        <Textarea
          {...args}
          onChange={(event) => {
            args.onChange?.(event);
            updateArgs({ value: event.currentTarget.value });
          }}
        />
      </div>
    );
  },
  argTypes: {
    xstyle: { control: false },
    placeholder: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    placeholder: 'Input text',
  },
} satisfies Story;

export const CustomMaxLength = {
  args: {
    ...Default.args,
    maxLength: 200,
  },
} satisfies Story;

export const WithText = {
  args: {
    ...Default.args,
    value: 'some super long test... \n'.repeat(20),
  },
} satisfies Story;

export const Mobile = {
  name: 'Mobile / 375px',
  args: { ...WithText.args },
  globals: { viewport: { value: 'mobile', isRotated: false } },
} satisfies Story;
