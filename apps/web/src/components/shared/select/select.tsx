import * as stylex from '@stylexjs/stylex';
import {
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type Ref,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import Icon from '@/components/shared/icon/icon';

import { styles } from './select.stylex';

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = Pick<
  ComponentPropsWithRef<'button'>,
  'id' | 'aria-invalid' | 'aria-describedby' | 'aria-labelledby' | 'aria-busy'
> & {
  ref?: Ref<HTMLButtonElement>;
  options: readonly SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  'aria-label': string;
  onBlur?: ComponentPropsWithRef<'div'>['onBlur'];
  xstyle?: stylex.StyleXStyles;
};

function Select({
  ref,
  placeholder,
  options,
  onValueChange,
  value,
  disabled,
  name,
  onBlur,
  xstyle,
  'aria-label': ariaLabel,
  ...accessibilityProps
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [popup, setPopup] = useState({ above: false, maxHeight: 320 });
  const open = isOpen && !disabled;

  useImperativeHandle(ref, () => buttonRef.current!, []);

  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    const selected = list?.querySelector<HTMLLIElement>(
      '[role="option"][aria-selected="true"]:not([aria-disabled="true"])',
    );
    const first = list?.querySelector<HTMLLIElement>('[role="option"]:not([aria-disabled="true"])');
    (selected ?? first ?? list)?.focus();
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    function placePopup() {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const below = window.innerHeight - rect.bottom;
      const above = rect.top;
      const opensAbove = below < 328 && above > below;
      setPopup({
        above: opensAbove,
        maxHeight: Math.max(0, Math.min(320, (opensAbove ? above : below) - 16)),
      });
    }
    placePopup();
    window.addEventListener('resize', placePopup);
    // Capture scrolls of any ancestor so the list stays inside the viewport.
    window.addEventListener('scroll', placePopup, true);
    return () => {
      window.removeEventListener('resize', placePopup);
      window.removeEventListener('scroll', placePopup, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => document.removeEventListener('pointerdown', handlePointerDown, true);
  }, [open]);

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
      ref={containerRef}
      {...stylex.props(styles.wrapper)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
          onBlur?.(event);
        }
      }}
    >
      <button
        {...accessibilityProps}
        {...stylex.props(styles.select, (Boolean(selectedLabel) || open) && styles.active, xstyle)}
        ref={buttonRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <span {...stylex.props(styles.label, !selectedLabel && styles.placeholder)}>
          {selectedLabel || placeholder}
        </span>

        <Icon xstyle={styles.icon} name={open ? 'chevron-up' : 'chevron-down'} />
      </button>

      {name && <input type="hidden" name={name} value={value} disabled={disabled} />}

      {open && (
        <ul
          {...stylex.props(styles.toggle, styles.popup(popup.maxHeight, popup.above))}
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          aria-labelledby={accessibilityProps['aria-labelledby']}
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
