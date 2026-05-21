import type { ReactNode } from 'react';
import clsx from 'clsx';

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  variant?: 'sans' | 'mono';
  tone?: 'muted' | 'subtle';
}

/**
 * Small uppercase label, +0.05em letter-spacing.
 * Used above section headlines and on detail-panel tags.
 */
export function Eyebrow({
  children,
  className,
  variant = 'sans',
  tone = 'muted',
}: EyebrowProps) {
  return (
    <div
      className={clsx(
        'text-[11px] uppercase tracking-label font-medium',
        variant === 'mono' && 'font-mono',
        tone === 'muted'  && 'text-stone-500',
        tone === 'subtle' && 'text-stone-400',
        className,
      )}
    >
      {children}
    </div>
  );
}
