import type { ReactNode, AnchorHTMLAttributes } from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'ghost' | 'outline-on-dark';
type Size = 'md' | 'lg';

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}

const base =
  'group inline-flex items-center gap-2 rounded-sm font-medium no-underline transition-colors whitespace-nowrap';

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-[14px]',
  lg: 'h-12 px-6 text-[15px]',
};

const variants: Record<Variant, string> = {
  primary:
    'bg-stone-900 text-stone-100 hover:bg-stone-700',
  ghost:
    'text-stone-900 hover:bg-stone-200',
  'outline-on-dark':
    'text-stone-100 border border-stone-700 hover:border-stone-500 hover:bg-stone-800',
};

/** Anchor styled as a button. Used for all primary calls-to-action. */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: ButtonLinkProps) {
  return (
    <a className={clsx(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </a>
  );
}
