import type { Meta, StoryObj } from '@storybook/react-vite';
import * as stylex from '@stylexjs/stylex';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

import Pagination from './pagination';

const demoStyles = stylex.create({
  mobilePreview: { paddingBlock: 8 },
});

const meta = {
  title: 'Shared/UI/Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
  argTypes: {
    page: { control: { type: 'number', min: 1, step: 1 } },
    totalPages: { control: { type: 'number', min: 0, step: 1 } },
    onPageChange: { control: false },
  },
  args: {
    page: 1,
    totalPages: 3,
    onPageChange: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    return (
      <Pagination
        {...args}
        onPageChange={(page) => {
          args.onPageChange(page);
          updateArgs({ page });
        }}
      />
    );
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const MiddlePage = {
  args: { page: 6, totalPages: 12 },
} satisfies Story;

export const LastPage = {
  args: { page: 12, totalPages: 12 },
} satisfies Story;

export const SinglePage = {
  args: { totalPages: 1 },
} satisfies Story;

export const NoPages = {
  args: { totalPages: 0 },
} satisfies Story;

export const ManyPages = {
  args: { page: 1, totalPages: 12 },
  parameters: { layout: 'padded' },
} satisfies Story;

export const ManyPagesMobile = {
  name: 'Many pages / Mobile 320px',
  args: { page: 6, totalPages: 12 },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div {...stylex.props(demoStyles.mobilePreview)}>
        <Story />
      </div>
    ),
  ],
  globals: { viewport: { value: 'mobileSmall', isRotated: false } },
} satisfies Story;
