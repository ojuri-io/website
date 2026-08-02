import { useCallback, useEffect, useState } from 'react';
import type { ComponentId } from '../../data/architectureComponents';
import { findComponent } from '../../data/architectureComponents';
import { ArchitectureDiagram } from '../ArchitectureDiagram';
import { ComponentPanel } from '../ComponentPanel';
import { Marker } from './primitives';

/** Section 05 — the interactive Kafka topology, presented as a cream lit panel. */
export function ArchitectureSection() {
  const [selected, setSelected] = useState<ComponentId | null>(null);
  const isOpen = selected !== null;

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

  return (
    <section id="architecture" className="scroll-mt-20 border-b border-stone-800">
      <div className="max-w-[1080px] mx-auto px-6 sm:px-10 py-24">
        <Marker n="05">Architecture</Marker>
        <h2 className="mt-7 font-display font-semibold text-stone-50 text-[clamp(28px,3.2vw,36px)] leading-[1.14] tracking-tightest max-w-[22ch]">
          Four agents, decoupled by Kafka.
        </h2>
        <p className="mt-5 max-w-measure text-[16.5px] leading-[27px] text-stone-400">
          Exactly one service sits on the authorization path. The other three
          consume events asynchronously, so pattern analysis, retraining, and LLM
          investigation can lag, restart, or fail without touching a live payment.
        </p>
        <p className="mt-4 font-mono text-[12.5px] text-stone-600">
          Click any component for its role, scope, and tech specifics.
        </p>

        <div className="mt-12 bg-stone-100 text-stone-900 rounded-lg border border-stone-700 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row items-start">
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
              <ComponentPanel component={findComponent(selected)} isOpen={isOpen} onClose={close} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
