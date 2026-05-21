import { Container } from './ui/Container';
import { Eyebrow } from './ui/Eyebrow';

const items: Array<[string, string, string]> = [
  [
    '01',
    'ONNX-served XGBoost on the hot path.',
    'RDA — a single Fastify service. PRE rules, feature lookup in Redis, ONNX inference at p99 ≈ 49µs, per-segment thresholds, POST rules, audit row, Kafka event. Reason codes attached to every verdict.',
  ],
  [
    '02',
    'Graph and velocity analysis, off the hot path.',
    'PAA consumes transactions.completed keyed by sender and updates the Redis features that feed RDA’s next prediction. Surfaces emerging rings and shared-device clusters — not single bad cards.',
  ],
  [
    '03',
    'LLM investigations on a separate Kafka path.',
    'Every DECLINE is republished to transactions.blocked, which only FIA consumes. A self-hosted Phi-3-mini-4k-instruct writes a structured report — verdict, recommended action, key indicators, narrative — at LLM latency, never on the authorization path.',
  ],
  [
    '04',
    'A model lifecycle with teeth.',
    'MLA runs CANDIDATE → SHADOW → ACTIVE → RETIRED. F1 and PSI drift triggers. SMOTE-balanced XGBoost retraining. McNemar’s chi-squared with continuity correction before promotion. A replay CLI that runs candidates against the live audit log.',
  ],
];

/** "What it is" — four numbered items in a 4/8 column layout. */
export function WhatItIs() {
  return (
    <section className="border-b border-stone-300/70">
      <Container className="py-20 sm:py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          <div className="md:col-span-4">
            <Eyebrow className="mb-4">What it is</Eyebrow>
            <h2 className="font-display font-semibold text-stone-900 text-[28px] sm:text-[34px] leading-[1.15] tracking-tightest">
              Every component is a different mode of seeing.
            </h2>
          </div>
          <div className="md:col-span-8">
            <ol className="divide-y divide-stone-300/70">
              {items.map(([num, head, body]) => (
                <li
                  key={num}
                  className="group py-6 grid grid-cols-[44px_1fr] gap-6 first:pt-0 cursor-default"
                >
                  <span className="num-anim font-mono text-[12px] text-stone-500 mt-1">
                    {num}
                  </span>
                  <div>
                    <div className="font-display font-semibold text-stone-900 text-[20px] leading-[1.35] tracking-tightest">
                      {head}
                    </div>
                    <p className="mt-2 text-[16px] leading-[26px] text-stone-700 max-w-measure">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
