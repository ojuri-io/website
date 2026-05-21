import type { ReactNode } from 'react';
import clsx from 'clsx';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav';
}

/** Brand container — max-w 1180px with horizontal gutter. */
export function Container({ children, className, as: Tag = 'div' }: ContainerProps) {
  return (
    <Tag className={clsx('max-w-container mx-auto px-6 sm:px-8', className)}>
      {children}
    </Tag>
  );
}
