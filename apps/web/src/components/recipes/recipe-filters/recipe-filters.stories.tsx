import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { RecipeFilters, type RecipeFiltersProps } from './recipe-filters';

function StatefulRecipeFilters(props: RecipeFiltersProps) {
  const [ingredientId, setIngredientId] = useState(props.ingredientId);
  const [areaId, setAreaId] = useState(props.areaId);

  return (
    <div style={{ width: '100%', maxWidth: 704, padding: 16, margin: '0 auto' }}>
      <RecipeFilters
        {...props}
        ingredientId={ingredientId}
        areaId={areaId}
        onIngredientChange={(id) => {
          setIngredientId(id);
          props.onIngredientChange?.(id);
        }}
        onAreaChange={(id) => {
          setAreaId(id);
          props.onAreaChange?.(id);
        }}
      />
    </div>
  );
}

const meta = {
  title: 'Recipes/RecipeFilters',
  component: RecipeFilters,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    ingredientId: '',
    areaId: '',
    onIngredientChange: fn(),
    onAreaChange: fn(),
  },
  render: (args) => <StatefulRecipeFilters {...args} />,
} satisfies Meta<typeof RecipeFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default (Empty filters)',
  args: {
    ingredientId: '',
    areaId: '',
  },
};

export const SelectedFilters: Story = {
  name: 'With Pre-selected Values',
  args: {
    ingredientId: '640c2dd963a319ea671e367e', // Butter
    areaId: '6462a6f04c3d0ddd28897fa1', // British
  },
};

export const MobileContainer: Story = {
  name: 'Mobile Container (343px)',
  render: (args) => (
    <div style={{ width: 343, margin: '0 auto' }}>
      <StatefulRecipeFilters {...args} />
    </div>
  ),
};

export const DesktopSidebarContainer: Story = {
  name: 'Desktop Sidebar Container (330px)',
  render: (args) => (
    <div style={{ width: 330, margin: '0 auto' }}>
      <StatefulRecipeFilters {...args} />
    </div>
  ),
};
