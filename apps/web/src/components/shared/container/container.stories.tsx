import type { Meta, StoryObj } from '@storybook/react-vite';
import * as stylex from '@stylexjs/stylex';

import { colors } from '@/styles/tokens.stylex';

import Container from './container';

const demoStyles = stylex.create({
  container: {
    backgroundColor: colors.border,
    paddingBlock: 24,
  },
  content: {
    backgroundColor: colors.white,
    minHeight: 160,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    paddingBlock: 24,
  },
});

const meta = {
  title: 'Shared/UI/container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    children: { control: false },
    xstyle: { control: false },
  },
  args: {
    xstyle: demoStyles.container,
    children: (
      <div {...stylex.props(demoStyles.content)}>
        <h2>Container content</h2>
        <p>Explore recipes and find inspiration for your next meal.</p>
      </div>
    ),
  },
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const MobileSmall = {
  name: 'Mobile / 320px',
  globals: {
    viewport: { value: 'mobileSmall', isRotated: false },
  },
} satisfies Story;

export const Mobile = {
  name: 'Mobile / 375px',
  globals: {
    viewport: { value: 'mobile', isRotated: false },
  },
} satisfies Story;

export const Tablet = {
  name: 'Tablet / 768px',
  globals: {
    viewport: { value: 'tablet', isRotated: false },
  },
} satisfies Story;

export const Desktop = {
  name: 'Desktop / 1440px',
  globals: {
    viewport: { value: 'desktop', isRotated: false },
  },
} satisfies Story;
