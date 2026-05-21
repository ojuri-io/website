import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import clsx from 'clsx';

export interface CodeTab {
  id: string;
  label: string;
  content: string;
}

interface CodeBlockProps {
  tabs: CodeTab[];
  className?: string;
  /** Whether the shell-style blinking caret appears at the end of tab 'shell'. */
  caretTabId?: string;
}

/**
 * Dark code block with tabbed contents and a copy button.
 * Used in the Quickstart section.
 */
export function CodeBlock({ tabs, className, caretTabId }: CodeBlockProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const [copied, setCopied] = useState(false);

  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];
  if (!active) return null;

  const copy = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(active.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className={clsx('rounded-md border border-stone-300 overflow-hidden', className)}>
      <div className="flex items-center justify-between bg-stone-200 border-b border-stone-300 px-4 h-10">
        <div className="flex items-center gap-1" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={t.id === active.id}
              aria-controls={`code-panel-${t.id}`}
              id={`code-tab-${t.id}`}
              onClick={() => setActiveId(t.id)}
              className={clsx(
                'h-7 px-3 font-mono text-[12px] whitespace-nowrap rounded-sm transition-colors',
                t.id === active.id
                  ? 'text-stone-900 bg-stone-100'
                  : 'text-stone-600 hover:text-stone-900',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={copy}
          className="group inline-flex items-center gap-1.5 h-7 px-2.5 font-mono text-[11px] text-stone-600 hover:text-stone-900 rounded-sm transition-colors"
          aria-label={copied ? 'Copied to clipboard' : 'Copy code'}
        >
          {copied ? <Check size={14} strokeWidth={1.5} /> : <Copy size={14} strokeWidth={1.5} />}
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre
        role="tabpanel"
        id={`code-panel-${active.id}`}
        aria-labelledby={`code-tab-${active.id}`}
        className="bg-stone-900 text-stone-100 font-mono text-[13.5px] leading-[22px] m-0 p-6 overflow-x-auto"
      >
        <code>{active.content}</code>
        {active.id === caretTabId && <span className="caret text-stone-100">&nbsp;</span>}
      </pre>
    </div>
  );
}
