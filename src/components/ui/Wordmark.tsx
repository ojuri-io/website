import clsx from 'clsx';

interface WordmarkProps {
  className?: string;
  /** Render as a different element. Default span. */
  as?: 'span' | 'div';
}

/**
 * The Ojuri wordmark. Source Serif 4 600 on the letters, 700 on
 * the fullstop — the thicker period reads as a deliberate logo
 * element rather than incidental punctuation.
 */
export function Wordmark({ className, as: Tag = 'span' }: WordmarkProps) {
  return (
    <Tag className={clsx('font-display font-semibold tracking-tightest', className)}>
      Ojuri<span className="font-bold">.</span>
    </Tag>
  );
}
