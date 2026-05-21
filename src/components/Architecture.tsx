import { useEffect, useState, useCallback } from 'react';
import type { ComponentId } from '../data/architectureComponents';
import { findComponent } from '../data/architectureComponents';
import { Container } from './ui/Container';
import { Eyebrow } from './ui/Eyebrow';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { ComponentPanel } from './ComponentPanel';

/**
 * The architecture section. Renders the section header + a flex
 * layout (diagram on the left, slide-out panel on the right).
 *
 * State (selected component id) is owned here so the diagram and
 * the panel stay in sync.
 */
export function Architecture() {
  const [selected, setSelected] = useState<ComponentId | null>(null);
  const isOpen = selected !== null;

  // Escape dismisses the panel.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const toggle = useCallback((id: ComponentId) => {
    setSelected((s) => (s === id ? null : id));
  }, []);

  const close = useCallback(() => setSelected(null), []);

  const current = findComponent(selected);

  return (
    <section id="architecture" className="border-b border-stone-300/70 scroll-mt-8">
      <Container className="py-20 sm:py-28">
        <Eyebrow className="mb-4">Architecture</Eyebrow>
        <h2 className="font-display font-semibold text-stone-900 text-[28px] sm:text-[34px] leading-[1.15] tracking-tightest max-w-[22ch]">
          Four agents, decoupled by Kafka.
        </h2>
        <p className="mt-3 font-mono text-[13px] text-stone-500">
          Click any component for its role, scope, and tech specifics.
        </p>

        {/*
          Flex layout. Diagram on the left takes whatever the panel
          doesn't (`flex: 1`); panel's flex-basis transitions from 0%
          → 35% over 460ms. Width transition would conflict with
          flex-basis: auto on the panel; transitioning flex-basis
          directly is the smooth path.
        */}
        <div className="mt-12 sm:mt-16 flex items-start">
          <div className="flex-1 min-w-0">
            <ArchitectureDiagram selected={selected} onToggle={toggle} />
          </div>

          <div
            style={{
              flexGrow: 0,
              flexShrink: 0,
              flexBasis: isOpen ? '35%' : '0%',
              minWidth: 0,
              overflow: 'hidden',
              transition: 'flex-basis 460ms cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'flex-basis',
            }}
            aria-hidden={!isOpen}
          >
            <ComponentPanel component={current} isOpen={isOpen} onClose={close} />
          </div>
        </div>
      </Container>
    </section>
  );
}
