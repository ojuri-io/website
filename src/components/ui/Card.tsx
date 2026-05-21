import type { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  alt?: boolean;
}

/**
 * Default brand card: surface background, 1px stone-300 border,
 * radius-md, no shadow. `alt` switches to the surface-alt fill.
 */
export function Card({ children, className, alt = false }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-md border border-stone-300',
        alt ? 'bg-stone-200' : 'bg-stone-100',
        className,
      )}
    >
      {children}
    </div>
  );
}
