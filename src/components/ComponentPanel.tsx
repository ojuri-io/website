import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { ArchitectureComponent } from '../data/architectureComponents';
import { renderInlineMono } from '../utils/renderInlineMono';

interface PanelProps {
  component: ArchitectureComponent | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Slide-out detail panel beside the architecture diagram.
 *
 * The opacity + translateX animation is offset from the parent's
 * flex-basis transition so the content lands after the column has
 * made room (opening) or fades before the column collapses (closing).
 *
 * Focus management: when the panel opens, focus moves to the close
 * button. When it closes, focus returns to wherever it was before.
 */
export function ComponentPanel({ component, isOpen, onClose }: PanelProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      // Defer focus so the panel's opacity transition can start before
      // the focus ring appears.
      const t = setTimeout(() => closeBtnRef.current?.focus(), 320);
      return () => clearTimeout(t);
    } else {
      lastFocusedRef.current?.focus?.();
    }
  }, [isOpen]);

  return (
    <div
      className="lg:sticky lg:top-12"
      style={{
        minWidth: '300px',
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateX(0)' : 'translateX(20px)',
        transition: isOpen
          ? 'opacity 280ms cubic-bezier(0.22, 0.61, 0.36, 1) 200ms, transform 280ms cubic-bezier(0.22, 0.61, 0.36, 1) 200ms'
          : 'opacity 180ms ease-out, transform 180ms ease-out',
        willChange: 'opacity, transform',
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
      role="region"
      aria-live="polite"
      aria-label="Component details"
    >
      <div className="relative border-l border-stone-300 pl-8 pr-6">
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close detail panel"
          className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-900 rounded-sm transition-colors"
        >
          <X size={14} strokeWidth={1.5} />
        </button>

        {component && (
          <div key={component.id}>
            <div className="text-[11px] uppercase tracking-label font-medium font-mono text-stone-500 mb-3">
              {component.tag}
            </div>
            <h3 className="font-display font-semibold text-stone-900 text-[24px] leading-[1.2] tracking-tightest pr-10">
              {component.name}
            </h3>
            <p className="mt-2 text-[15px] leading-[24px] text-stone-700">
              {component.role}
            </p>
            <ul className="mt-5 space-y-2">
              {component.bullets.map((b, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[14px_1fr] gap-3 text-[13.5px] leading-[21px] text-stone-700"
                >
                  <span
                    className="mt-[10px] inline-block w-[6px] h-[1px] bg-stone-400 self-start"
                    aria-hidden="true"
                  />
                  <span>{renderInlineMono(b)}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 text-[12px] text-stone-500 hover:text-stone-900 font-mono"
            >
              esc · close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
