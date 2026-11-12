import * as stylex from '@stylexjs/stylex';
import {
  type ComponentPropsWithRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { styles } from './textarea.stylex';

type TextareaProps = Omit<
  ComponentPropsWithRef<'textarea'>,
  'className' | 'style' | 'value' | 'defaultValue'
> & {
  value?: string;
  defaultValue?: string;
  xstyle?: stylex.StyleXStyles;
  maxLength?: number;
};
function Textarea({
  xstyle,
  maxLength = 1000,
  value,
  defaultValue,
  onChange,
  ref,
  ...props
}: TextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [characterCount, setCharacterCount] = useState(defaultValue?.length ?? 0);
  const isControlled = value !== undefined;

  useImperativeHandle(ref, () => textareaRef.current!, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    const form = textarea?.form;
    if (isControlled || !form) return;
    let resetFrame: number | undefined;

    function handleReset(event: Event) {
      if (resetFrame !== undefined) cancelAnimationFrame(resetFrame);
      resetFrame = requestAnimationFrame(() => {
        if (!event.defaultPrevented && textarea) setCharacterCount(textarea.value.length);
      });
    }

    form.addEventListener('reset', handleReset);
    return () => {
      form.removeEventListener('reset', handleReset);
      if (resetFrame !== undefined) cancelAnimationFrame(resetFrame);
    };
  }, [isControlled, props.form]);

  return (
    <div {...stylex.props(styles.wrapper)}>
      <textarea
        {...props}
        ref={textareaRef}
        value={value}
        defaultValue={isControlled ? undefined : defaultValue}
        onChange={(event) => {
          if (!isControlled) setCharacterCount(event.currentTarget.value.length);
          onChange?.(event);
        }}
        maxLength={maxLength}
        {...stylex.props(stylex.defaultMarker(), styles.textarea, xstyle)}
      />

      <div {...stylex.props(styles.toggle)}>
        {isControlled ? value.length : characterCount}/
        <span {...stylex.props(styles.span)}>{maxLength}</span>
      </div>
    </div>
  );
}

export default Textarea;
