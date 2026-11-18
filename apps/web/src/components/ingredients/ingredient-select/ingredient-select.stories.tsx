import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { IngredientSelect, type IngredientSelectProps } from './ingredient-select';

function StatefulIngredientSelect(props: IngredientSelectProps) {
  const [value, setValue] = useState(props.value);

  return (
    <div style={{ width: 343, maxWidth: '100%' }}>
      <IngredientSelect
        {...props}
        value={value}
        onValueChange={(id, ingredient) => {
          setValue(id);
          props.onValueChange?.(id, ingredient);
        }}
      />
    </div>
  );
}

const meta = {
  title: 'Dictionaries/IngredientSelect',
  component: IngredientSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    value: '',
    onValueChange: fn(),
    visibleItemsCount: 7,
  },
  render: (args) => <StatefulIngredientSelect {...args} />,
} satisfies Meta<typeof IngredientSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FilterMode: Story = {
  name: 'Filter Mode (with "All ingredients")',
  args: {
    value: '',
    includeAllOption: true,
    allOptionLabel: 'All ingredients',
    placeholder: 'Select ingredient',
  },
};

export const FormMode: Story = {
  name: 'Form Mode (for adding ingredient, no "All")',
  args: {
    value: '640c2dd963a319ea671e382c', // Pears
    includeAllOption: false,
    placeholder: 'Select ingredient',
  },
};

export const Disabled: Story = {
  args: {
    value: '640c2dd963a319ea671e382c',
    disabled: true,
  },
};
