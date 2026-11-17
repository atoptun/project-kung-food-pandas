import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { AreaSelect, type AreaSelectProps } from './area-select';

function StatefulAreaSelect(props: AreaSelectProps) {
  const [value, setValue] = useState(props.value);

  return (
    <div style={{ width: '100%', maxWidth: 343, minWidth: 200 }}>
      <AreaSelect
        {...props}
        value={value}
        onValueChange={(id, area) => {
          setValue(id);
          props.onValueChange?.(id, area);
        }}
      />
    </div>
  );
}

const meta = {
  title: 'Dictionaries/AreaSelect',
  component: AreaSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    value: '',
    onValueChange: fn(),
  },
  render: (args) => <StatefulAreaSelect {...args} />,
} satisfies Meta<typeof AreaSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FilterMode: Story = {
  name: 'Filter Mode (with "All areas")',
  args: {
    value: '',
    includeAllOption: true,
    allOptionLabel: 'All areas',
    placeholder: 'Select area',
  },
};

export const FormMode: Story = {
  name: 'Form Mode (required selection, no "All")',
  args: {
    value: '6462a6f04c3d0ddd28897f9b', // Ukrainian
    includeAllOption: false,
    placeholder: 'Select area',
  },
};

export const Disabled: Story = {
  args: {
    value: '6462a6f04c3d0ddd28897f9b',
    disabled: true,
  },
};
