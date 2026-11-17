import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { CategorySelect, type CategorySelectProps } from './category-select';

function StatefulCategorySelect(props: CategorySelectProps) {
  const [value, setValue] = useState(props.value);

  return (
    <div style={{ width: 343, maxWidth: '100%' }}>
      <CategorySelect
        {...props}
        value={value}
        onValueChange={(id, category) => {
          setValue(id);
          props.onValueChange?.(id, category);
        }}
      />
    </div>
  );
}

const meta = {
  title: 'Dictionaries/CategorySelect',
  component: CategorySelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    value: '',
    onValueChange: fn(),
  },
  render: (args) => <StatefulCategorySelect {...args} />,
} satisfies Meta<typeof CategorySelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FilterMode: Story = {
  name: 'Filter Mode (with "All categories")',
  args: {
    value: '',
    includeAllOption: true,
    allOptionLabel: 'All categories',
    placeholder: 'Select category',
  },
};

export const FormMode: Story = {
  name: 'Form Mode (for recipe creation, no "All")',
  args: {
    value: '6462a6cd4c3d0ddd28897f8f', // Desserts
    includeAllOption: false,
    placeholder: 'Select category',
  },
};

export const Disabled: Story = {
  args: {
    value: '6462a6cd4c3d0ddd28897f8f',
    disabled: true,
  },
};
