import type { Meta, StoryObj } from '@storybook/react-vite';

import { Section } from './section';

const meta = {
  title: 'Shared/UI/Section',
  component: Section,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    'aria-label': 'Sample Section',
    withContainer: true,
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Section {...args}>
      <div style={{ backgroundColor: '#eeeeee', padding: 24, textAlign: 'center' }}>
        <h2>Section content inside Container</h2>
        <p>This content has responsive vertical padding (32px / 50px / 60px).</p>
      </div>
    </Section>
  ),
};

export const WithoutContainer: Story = {
  args: {
    withContainer: false,
  },
  render: (args) => (
    <Section {...args}>
      <div style={{ backgroundColor: '#d9d9d9', padding: 24, textAlign: 'center' }}>
        <h2>Full-width Section content (without Container)</h2>
      </div>
    </Section>
  ),
};
