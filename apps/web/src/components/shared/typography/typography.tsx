import * as stylex from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import { typography, weights } from '@/styles/typography.stylex';

import { styles } from './typography.stylex';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'main'
  | 'mainBold'
  | 'button'
  | 'caption'
  | 'captionBold'
  | 'categories';

export type TypographyElement =
  'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label' | 'div' | 'blockquote';

export type TypographyColor = 'black' | 'darkGray' | 'gray' | 'lightGray' | 'white';

export type TypographyWeight = 'medium' | 'bold' | 'extraBold';

export type TypographyAlign = 'left' | 'center' | 'right';

const defaultElementMap: Record<TypographyVariant, TypographyElement> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  main: 'p',
  mainBold: 'p',
  button: 'span',
  caption: 'span',
  captionBold: 'span',
  categories: 'span',
};

const colorStyleMap: Record<TypographyColor, stylex.StyleXStyles> = {
  black: styles.colorBlack,
  darkGray: styles.colorDarkGray,
  gray: styles.colorGray,
  lightGray: styles.colorLightGray,
  white: styles.colorWhite,
};

const alignStyleMap: Record<TypographyAlign, stylex.StyleXStyles> = {
  left: styles.alignLeft,
  center: styles.alignCenter,
  right: styles.alignRight,
};

const weightStyleMap: Record<TypographyWeight, stylex.StyleXStyles> = {
  medium: weights.medium,
  bold: weights.bold,
  extraBold: weights.extraBold,
};

export type TypographyProps<T extends TypographyElement = 'p'> = {
  as?: T;
  variant?: TypographyVariant;
  color?: TypographyColor;
  weight?: TypographyWeight;
  align?: TypographyAlign;
  uppercase?: boolean;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
} & Omit<ComponentPropsWithoutRef<T>, 'color' | 'className' | 'style'>;

export function Typography<T extends TypographyElement = 'p'>({
  as,
  variant = 'main',
  color,
  weight,
  align,
  uppercase,
  children,
  xstyle,
  ...restProps
}: TypographyProps<T>) {
  const Component = (as ?? defaultElementMap[variant] ?? 'p') as ElementType;

  return (
    <Component
      {...restProps}
      {...stylex.props(
        styles.base,
        typography[variant],
        color && colorStyleMap[color],
        weight && weightStyleMap[weight],
        align && alignStyleMap[align],
        uppercase && styles.uppercase,
        xstyle,
      )}
    >
      {children}
    </Component>
  );
}

export default Typography;
