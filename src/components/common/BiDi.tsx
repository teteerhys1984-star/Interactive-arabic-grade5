import React from 'react';

export interface BiDiProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  /** Force isolation tag */
  as?: 'span' | 'bdi' | 'code' | 'div';
  /** Direction override if needed */
  dir?: 'ltr' | 'rtl' | 'auto';
  className?: string;
}

/**
 * Ensures strict bidirectional isolation for Latin, numbers, codes, dates, and mixed tokens
 * inside our Arabic primary interface.
 */
export const BiDi: React.FC<BiDiProps> = ({
  children,
  as: Component = 'bdi',
  dir = 'auto',
  className = '',
  ...props
}) => {
  return (
    <Component
      dir={dir}
      className={`bidi-isolated ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export const LatinText: React.FC<React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }> = ({
  children,
  className = '',
  ...props
}) => (
  <span dir="ltr" className={`latin-isolated ${className}`} {...props}>
    {children}
  </span>
);

export const ArabicNumber: React.FC<{ value: number | string; className?: string }> = ({
  value,
  className = '',
}) => {
  return (
    <span className={`ar-number ${className}`} dir="ltr">
      {value}
    </span>
  );
};
