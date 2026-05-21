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
          Desktop (lg+): diagram on the left, panel slides in on the right
          via flex-basis 0% → 35%.
          Mobile/tablet (< lg): stack — diagram full-width on top, panel
          full-width below. The flex-basis animation would clip content
          inside a 35% column narrower than the panel's intrinsic width.
        */}
        <div className="mt-12 sm:mt-16 flex flex-col lg:flex-row items-start">
          <div className="w-full flex-1 min-w-0">
            <ArchitectureDiagram selected={selected} onToggle={toggle} />
          </div>

          <div
            aria-hidden={!isOpen}
            className={[
              'w-full mt-10 lg:mt-0',
              'lg:w-auto lg:overflow-hidden lg:flex-grow-0 lg:flex-shrink-0 lg:min-w-0',
              'lg:transition-[flex-basis] lg:duration-[460ms] lg:ease-[cubic-bezier(0.4,0,0.2,1)]',
              isOpen ? 'lg:basis-[35%]' : 'hidden lg:block lg:basis-0',
            ].join(' ')}
          >
            <ComponentPanel component={current} isOpen={isOpen} onClose={close} />
          </div>
        </div>
      </Container>
    </section>
  );
}
