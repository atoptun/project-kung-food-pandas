import type { Meta, StoryObj } from '@storybook/react-vite';

import { Typography } from './typography';

const meta = {
  title: 'Shared/UI/Typography',
  component: Typography,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    children: 'Quick brown fox jumps over the lazy dog',
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Typography variant="h1">Heading 1 (h1)</Typography>
      <Typography variant="h2">Heading 2 (h2)</Typography>
      <Typography variant="h3">Heading 3 (h3)</Typography>
      <Typography variant="h4">Heading 4 (h4)</Typography>
      <Typography variant="main">Main text (main body regular)</Typography>
      <Typography variant="mainBold">Main text bold (mainBold)</Typography>
      <Typography variant="button">Button label typography (button)</Typography>
      <Typography variant="caption">Caption text (caption)</Typography>
      <Typography variant="captionBold">Caption text bold (captionBold)</Typography>
      <Typography variant="categories">Categories title typography</Typography>
    </div>
  ),
};

export const ColorsAndWeights: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Typography variant="h3" color="black" weight="extraBold">
        Black Extra Bold
      </Typography>
      <Typography variant="main" color="darkGray">
        Dark Gray description text
      </Typography>
      <Typography variant="caption" color="gray" uppercase>
        Gray uppercase caption
      </Typography>
    </div>
  ),
};

export const CustomElementSemantic: Story = {
  render: () => (
    <div>
      <Typography variant="h2" as="h1" align="center">
        Rendered as H1 element with H2 styles, centered
      </Typography>
    </div>
  ),
};
