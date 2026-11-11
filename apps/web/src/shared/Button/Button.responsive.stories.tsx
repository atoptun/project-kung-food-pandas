import type { Meta, StoryObj } from '@storybook/react-vite';
import { composeStories } from '@storybook/react-vite';

import * as circleStories from './Button.circle.stories';
import * as buttonStories from './Button.stories';

const { Default: DefaultButton } = composeStories(buttonStories);
const { Circle: DefaultCircle } = composeStories(circleStories);

const meta = {
  title: 'Shared/UI/Button/responsive',
  parameters: { layout: 'centered' },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <DefaultButton />
      <DefaultCircle />
    </div>
  ),
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const MobileSmall = {
  name: 'Small Mobile / 320px',
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
