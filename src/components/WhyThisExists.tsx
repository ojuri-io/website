import type { ReactNode } from 'react';
import { Container } from './ui/Container';
import { Eyebrow } from './ui/Eyebrow';

interface Item {
  head: string;
  body: ReactNode;
}

const items: Item[] = [
  {
    head: 'Self-hosted, residency-friendly by construction.',
    body: 'Ojuri runs in your VPC, on your hardware, against your databases. Transaction data does not leave your boundary — not for scoring, not for training, not for investigation. Strict residency regimes (GDPR, NDPR, CBN) stay tractable without a separate compliance project.',
  },
  {
    head: 'Every decision is traceable.',
    body: 'Verdict, model_version, threshold, feature snapshot, reason codes with contributions, audit_id, timestamp — every decision RDA emits lands in the audit table. Lineage works backwards from a single verdict to the exact feature values the model saw at inference time. Nothing is opaque after the fact.',
  },
  {
    head: 'Reviewer overrides close the label loop.',
    body: (
      <>
        In Sentinel, an analyst can override any verdict. The override writes back to{' '}
        <span className="font-mono text-[15px]">groundTruthFraud</span>, so the next training
        run learns from the analyst&apos;s judgement — and the model does not learn from its
        own past decisions. The longer you run it, the better it judges your traffic.
      </>
    ),
  },
  {
    head: 'No vendor on the authorization path.',
    body: 'Open source under MIT. No SaaS dependency, no per-call fees, no rate limits, no vendor outage that takes your authorization offline. The agents you boot are the agents you run; the model registry is your model registry.',
  },
];

/** Differentiators — value-framed, four cards in 2-column grid. */
export function WhyThisExists() {
  return (
    <section className="border-b border-stone-300/70">
      <Container className="py-20 sm:py-28">
        <Eyebrow className="mb-4">Why this exists</Eyebrow>
        <h2 className="font-display font-semibold text-stone-900 text-[28px] sm:text-[34px] leading-[1.15] tracking-tightest max-w-[24ch]">
          The decisions you ship are auditable, not opaque.
        </h2>
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 sm:gap-y-16">
          {items.map((it) => (
            <div key={it.head} className="max-w-measure">
              <h3 className="font-display font-semibold text-stone-900 text-[22px] sm:text-[24px] leading-[1.25] tracking-tightest">
                {it.head}
              </h3>
              <p className="mt-4 text-[17px] sm:text-[18px] leading-[1.55] text-stone-700">
                {it.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
