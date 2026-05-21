import type { ReactNode } from 'react';

/**
 * Parses inline backtick syntax → React nodes.
 *
 *   renderInlineMono('Run via `docker compose`.')
 *   → ['Run via ', <code>docker compose</code>, '.']
 */
export function renderInlineMono(text: string): ReactNode[] {
  const parts = text.split('`');
  return parts.map((part, i) =>
    i % 2 === 1
      ? (
          <code key={i} className="font-mono text-[12.5px]">
            {part}
          </code>
        )
      : (
          <span key={i}>{part}</span>
        ),
  );
}
