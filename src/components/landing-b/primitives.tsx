import type { ReactNode } from 'react';
import clsx from 'clsx';

export const SECTIONS: Array<[string, string, string]> = [
  ['01', 'Overview', 'top'],
  ['02', 'Trade-off', 'tradeoff'],
  ['03', 'What it does', 'how'],
  ['04', 'Sentinel', 'sentinel'],
  ['05', 'Architecture', 'architecture'],
  ['06', 'Under the hood', 'under-the-hood'],
  ['07', 'Quickstart', 'quickstart'],
  ['08', 'Try it live', 'sandbox'],
  ['09', 'Why', 'why'],
  ['10', 'Changelog', 'changelog'],
];

export function Shell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('max-w-[1080px] mx-auto px-6 sm:px-10', className)}>{children}</div>;
}

/** Section label: a number, a rule, a word — the recurring unit of the page. */
export function Marker({
  n,
  children,
  tone = 'dark',
}: {
  n: string;
  children: ReactNode;
  tone?: 'dark' | 'light';
}) {
  return (
    <div className={clsx('flex items-center gap-4', tone === 'light' ? 'text-stone-500' : 'text-stone-400')}>
      <span className="font-mono text-[11px] tabular-nums">{n}</span>
      <span className={clsx('h-px w-8', tone === 'light' ? 'bg-stone-400' : 'bg-stone-600')} />
      <span className="text-[11px] uppercase tracking-label font-medium">{children}</span>
    </div>
  );
}
