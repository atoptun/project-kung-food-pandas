import * as stylex from '@stylexjs/stylex';
import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';

import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import chevronUpIcon from '@/assets/icons/chevron-up.svg';
import Icon from '@/shared/Icon/Icon';

import { styles } from './select.stylex';

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectProps = {
  options: readonly SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  'aria-label': string;
};

function Select({
  placeholder,
  options,
  onValueChange,
  value,
  disabled,
  name,
  'aria-label': ariaLabel,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const listId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const list = listRef.current;
    const selected = list?.querySelector<HTMLLIElement>(
      '[role="option"][aria-selected="true"]:not([aria-disabled="true"])',
    );
    const first = list?.querySelector<HTMLLIElement>('[role="option"]:not([aria-disabled="true"])');
    (selected ?? first ?? list)?.focus();
  }, [isOpen]);

  const selectedLabel = options.find((option) => option.value === value)?.label;

  function handleSelect(option: SelectOption) {
    if (disabled || option.disabled) return;

    onValueChange(option.value);
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  function handleListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key === 'Tab') {
      setIsOpen(false);
      buttonRef.current?.focus();
      return;
    }

    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLLIElement>(
        '[role="option"]:not([aria-disabled="true"])',
      ),
    );
    const index = items.findIndex((item) => item === document.activeElement);

    if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
      buttonRef.current?.focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const option = options.find((item) => item.value === items[index]?.dataset.value);
      if (option) handleSelect(option);
    } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowDown') next = Math.min(index + 1, items.length - 1);
      if (event.key === 'ArrowUp') next = Math.max(index - 1, 0);
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = items.length - 1;
      items[next]?.focus();
    }
  }

  return (
    <div
      {...stylex.props(styles.wrapper)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <button
        {...stylex.props(styles.select, (Boolean(selectedLabel) || isOpen) && styles.active)}
        ref={buttonRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <span {...stylex.props(!selectedLabel && styles.placeholder)}>
          {selectedLabel || placeholder}
        </span>

        <Icon xstyle={styles.icon} src={isOpen ? chevronUpIcon : chevronDownIcon} />
      </button>

      {name && <input type="hidden" name={name} value={value} disabled={disabled} />}

      {isOpen && (
        <ul
          {...stylex.props(styles.toggle)}
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
        >
          {options.map((option) => (
            <li
              {...stylex.props(styles.option)}
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
              tabIndex={-1}
              data-value={option.value}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Select;
