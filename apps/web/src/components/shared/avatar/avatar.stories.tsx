import type { Meta, StoryObj } from '@storybook/react-vite';
import * as stylex from '@stylexjs/stylex';

import Avatar from './avatar';

// Local demo image: no external image service is needed to view the stories.
const demoImage = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="240" height="240" fill="#E8E8E8"/><circle cx="120" cy="88" r="44" fill="#1A1A1A"/><ellipse cx="120" cy="218" rx="88" ry="74" fill="#1A1A1A"/></svg>',
)}`;

const demoStyles = stylex.create({
  sizes: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 24,
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
});

const meta = {
  title: 'Shared/UI/avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    xstyle: { control: false },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
  },
  args: {
    src: demoImage,
    alt: 'Demo user avatar',
    size: 'md',
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const WithoutImage = {
  args: { src: null },
} satisfies Story;

export const BrokenImage = {
  args: { src: 'data:image/png;base64,invalid' },
} satisfies Story;

export const AllSizes = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div {...stylex.props(demoStyles.sizes)}>
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} {...stylex.props(demoStyles.item)}>
          <Avatar {...args} size={size} />
          <span>{size}</span>
        </div>
      ))}
    </div>
  ),
} satisfies Story;

export const Mobile = {
  ...AllSizes,
  name: 'Mobile / 375px',
  globals: { viewport: { value: 'mobile', isRotated: false } },
} satisfies Story;

export const Tablet = {
  ...AllSizes,
  name: 'Tablet / 768px',
  globals: { viewport: { value: 'tablet', isRotated: false } },
} satisfies Story;

export const Desktop = {
  ...AllSizes,
  name: 'Desktop / 1440px',
  globals: { viewport: { value: 'desktop', isRotated: false } },
} satisfies Story;
