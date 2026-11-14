import type { Meta, StoryObj } from '@storybook/react-vite';
import * as stylex from '@stylexjs/stylex';

import { CategoryImage } from './category-image';

const demoStyles = stylex.create({
  mobileContainer: {
    width: '100%',
    maxWidth: 343,
    paddingInline: 16,
    boxSizing: 'border-box',
  },
  desktopNarrow: {
    width: '100%',
    maxWidth: 325,
  },
  desktopWide: {
    width: '100%',
    maxWidth: 590,
  },
  fluidContainer: {
    width: '100%',
    minWidth: 280,
    maxWidth: '100%',
  },
  grid: {
    display: 'flex',
    gap: 20,
    flexWrap: 'wrap',
    maxWidth: 950,
  },
});

const DEMO_IMAGE_URL =
  'https://res.cloudinary.com/lyycri5k/image/upload/kfp/categories/Desserts.jpg';

const meta = {
  title: 'Features/Categories/CategoryImage',
  component: CategoryImage,
  parameters: {
    layout: 'centered',
  },
  args: {
    src: DEMO_IMAGE_URL,
    alt: 'Dessert',
  },
  argTypes: {
    src: {
      control: 'text',
      description: 'Cloudinary original link',
    },
    alt: {
      control: 'text',
      description: 'Alt',
    },
    xstyle: {
      control: false,
    },
  },
} satisfies Meta<typeof CategoryImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div {...stylex.props(demoStyles.desktopNarrow)}>
      <CategoryImage {...args} />
    </div>
  ),
};

export const WideCard: Story = {
  render: (args) => (
    <div {...stylex.props(demoStyles.desktopWide)}>
      <CategoryImage {...args} />
    </div>
  ),
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
  render: (args) => (
    <div {...stylex.props(demoStyles.mobileContainer)}>
      <CategoryImage {...args} />
    </div>
  ),
};

export const CategoryGridDemo: Story = {
  render: () => (
    <div {...stylex.props(demoStyles.grid)}>
      <div {...stylex.props(demoStyles.desktopNarrow)}>
        <CategoryImage src={DEMO_IMAGE_URL} alt="Seafood" />
      </div>
      <div {...stylex.props(demoStyles.desktopWide)}>
        <CategoryImage src={DEMO_IMAGE_URL} alt="Vegan" />
      </div>
    </div>
  ),
};
