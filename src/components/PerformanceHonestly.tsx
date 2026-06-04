import { Container } from './ui/Container';
import { Eyebrow } from './ui/Eyebrow';

/** Performance disclosure — orientation numbers, honest framing. */
export function PerformanceHonestly() {
  return (
    <section className="border-b border-stone-300/70">
      <Container className="py-20 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-baseline">
          <div className="md:col-span-4">
            <Eyebrow>Performance, honestly</Eyebrow>
          </div>
          <div className="md:col-span-8">
            <p className="font-display text-stone-900 text-[22px] sm:text-[24px] leading-[1.4] max-w-measure">
              The numbers in this page —{' '}
              <span className="font-mono text-[18px] sm:text-[20px]">p99 ≈ 6ms</span>{' '}
              server-side,{' '}
              <span className="font-mono text-[18px] sm:text-[20px]">≈49µs</span>{' '}
              at the model — are reference values measured on a single Apple Silicon developer
              workstation. They are <em>not</em> SLA targets. Re-measure on your own hardware,
              with your own feature shape, before relying on them.
            </p>
            <p className="mt-6 text-[14px] leading-[22px] text-stone-600 max-w-measure">
              Failure mode is graceful. Circuit breakers around Redis and ONNX keep the path
              degrading instead of failing — predictions still succeed against default features
              when Redis is down. PAA, MLA, and FIA can each be unavailable without affecting
              authorization.
            </p>
            <p className="mt-4 text-[14px] leading-[22px] text-stone-600 max-w-measure">
              See{' '}
              <a
                href="https://github.com/ojuri-io/ojuri/blob/main/ARCHITECTURE.md"
                className="underline decoration-stone-300 hover:decoration-stone-900"
              >
                ARCHITECTURE.md
              </a>{' '}
              for the load-test method and the per-feature performance breakdown.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
