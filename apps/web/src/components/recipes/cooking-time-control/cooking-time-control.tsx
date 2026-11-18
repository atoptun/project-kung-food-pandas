import * as stylex from '@stylexjs/stylex';
import type { ComponentPropsWithRef } from 'react';

import Button from '@/components/shared/button/button';
import Icon from '@/components/shared/icon/icon';

import { styles } from './cooking-time-control.stylex';

type CookingTimeControlProps = Pick<
  ComponentPropsWithRef<'input'>,
  'id' | 'name' | 'onBlur' | 'aria-invalid' | 'aria-describedby'
> & {
  value: number | '';
  onValueChange: (value: number | '') => void;
};

function CookingTimeControl({ value, onValueChange, ...props }: CookingTimeControlProps) {
  return (
    <div {...stylex.props(styles.control)}>
      <Button
        shape="circle"
        variant="outline"
        xstyle={styles.step}
        aria-label="Decrease cooking time"
        disabled={value === ''}
        onClick={() => onValueChange(value === '' || value <= 5 ? '' : value - 5)}
      >
        <Icon name="minus" size={24} />
      </Button>
      <div {...stylex.props(styles.value)}>
        <input
          {...props}
          {...stylex.props(styles.input, value !== '' && styles.withUnit)}
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          required
          placeholder="10 min"
          value={value}
          onChange={(event) =>
            onValueChange(event.currentTarget.value === '' ? '' : event.currentTarget.valueAsNumber)
          }
        />
        {value !== '' && (
          <span aria-hidden="true" {...stylex.props(styles.unit)}>
            min
          </span>
        )}
      </div>
      <Button
        shape="circle"
        variant="outline"
        xstyle={styles.step}
        aria-label="Increase cooking time"
        onClick={() => onValueChange(value === '' ? 5 : value + 5)}
      >
        <Icon name="plus" size={24} />
      </Button>
    </div>
  );
}

export default CookingTimeControl;
