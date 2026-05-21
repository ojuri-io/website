import { Container } from './ui/Container';
import { Eyebrow } from './ui/Eyebrow';

/**
 * "See it operating" — the page's only ink (inverse) band.
 * The cream dashboard screenshot floats brightly against the dark
 * surface and becomes the visual moment of the page.
 */
export function SeeItOperating() {
  return (
    <section className="bg-stone-900">
      <Container className="py-20 sm:py-28">
        <Eyebrow tone="subtle" className="mb-4">Sentinel</Eyebrow>
        <h2 className="font-display font-semibold text-stone-100 text-[28px] sm:text-[34px] leading-[1.15] tracking-tightest max-w-[18ch]">
          See it operating.
        </h2>
        <p className="mt-6 text-[17px] sm:text-[18px] leading-[1.55] text-stone-400 max-w-measure">
          The Sentinel operator surface. Same brand language. Built with the same restraint.
        </p>

        <figure className="m-0 mt-12 sm:mt-14">
          <div className="border border-stone-700 rounded-lg overflow-hidden">
            <img
              src="/assets/dashboard-home.png"
              alt="Sentinel dashboard home. Left sidebar groups Detection (Live decisions, Transactions, Review queue 75, Investigations), Insights (Audit log, Models, Metrics, Reports, System health), Config (Rules, Features, Settings, Integrations), and Access (Users, Roles). The main panel shows a Source Serif 4 greeting “Hello, Ayodeji”, a Things to do card listing 4 declined transactions awaiting review and 4 new FIA investigation reports, the Champion model card (fraud_model v1.1, threshold 0.65, F1 0.966, AUC 0.984, p50 1.0 ms, p95 15.0 ms), Today’s decisions (4,434 total — 4,403 accept, 31 decline, 0 review), and a Recent declines list with rule-tagged transactions."
              loading="lazy"
              className="block w-full h-auto"
            />
          </div>
          <figcaption className="mt-5 text-[14px] text-stone-400">
            Dashboard home — open source, MIT-licensed. The frontend runs separately via{' '}
            <span className="font-mono text-[13px] text-stone-300">npm run dev</span> against
            the agents you booted in{' '}
            <span className="font-mono text-[13px] text-stone-300">docker compose</span>.
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
