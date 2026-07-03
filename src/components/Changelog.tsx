import { Container } from './ui/Container';
import { Eyebrow } from './ui/Eyebrow';
import { RELEASES } from '../data/changelog';
import { useReveal } from '../utils/useReveal';

// Latest first: roadmap on top, then current release, then history
// descending. Data stays chronological so adding a release is an append.
const ORDERED = [...RELEASES].reverse();

/**
 * Release timeline — a vertical editorial changelog showing the arc from
 * launch to now. On-brand: Stone-only, serif heads, mono version tags,
 * hierarchy from weight and spacing rather than colour.
 */
export function Changelog() {
  const register = useReveal<HTMLLIElement>();
  return (
    <section id="changelog" className="border-b border-stone-300/70 scroll-mt-8">
      <Container className="py-20 sm:py-28">
        <Eyebrow className="mb-4">Changelog</Eyebrow>
        <h2 className="font-display font-semibold text-stone-900 text-[28px] sm:text-[34px] leading-[1.15] tracking-tightest max-w-[26ch]">
          From launch to a closed learning loop.
        </h2>
        <p className="mt-4 text-[17px] sm:text-[18px] leading-[1.55] text-stone-700 max-w-measure">
          Where we started, what has shipped, and where we are headed — every
          release tagged and reproducible.
        </p>

        <ol className="mt-12 sm:mt-16">
          {ORDERED.map((r, i) => {
            const last = i === ORDERED.length - 1;
            return (
              <li
                key={r.version}
                ref={register}
                style={{ transitionDelay: `${Math.min(i, 3) * 90}ms` }}
                className="reveal relative pl-8 sm:pl-10"
              >
                {/* rail */}
                {!last && (
                  <span
                    aria-hidden
                    className="absolute left-[5px] sm:left-[7px] top-2 bottom-0 w-px bg-stone-300"
                  />
                )}
                {/* node */}
                <span
                  aria-hidden
                  className={
                    'absolute left-0 top-[6px] h-3 w-3 rounded-pill border-2 ' +
                    (r.current
                      ? 'border-stone-900 bg-stone-900'
                      : r.upcoming
                        ? 'border-stone-400 bg-stone-100'
                        : 'border-stone-500 bg-stone-100')
                  }
                />

                <div className={last ? 'pb-0' : 'pb-14 sm:pb-16'}>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="font-mono text-[14px] font-medium text-stone-900">
                      {r.version}
                    </span>
                    <Eyebrow variant="mono" tone="subtle">
                      {r.date}
                    </Eyebrow>
                    {r.current && (
                      <span className="text-[10px] uppercase tracking-label font-medium text-stone-100 bg-stone-800 rounded-pill px-2 py-0.5">
                        Current
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 font-display font-semibold text-stone-900 text-[22px] sm:text-[24px] leading-[1.25] tracking-tightest">
                    {r.title}
                  </h3>
                  <p className="mt-3 text-[16px] sm:text-[17px] leading-[1.55] text-stone-700 max-w-measure">
                    {r.summary}
                  </p>

                  <ul className="mt-5 space-y-2.5 max-w-measure">
                    {r.highlights.map((h) => (
                      <li key={h} className="flex gap-3 text-[15px] sm:text-[16px] leading-[1.5] text-stone-700">
                        <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-pill bg-stone-400" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  {r.metric && (
                    <p className="mt-5 border-l-2 border-stone-300 pl-4 text-[15px] sm:text-[16px] leading-[1.55] text-stone-800 max-w-measure">
                      {r.metric}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-4">
          <a
            href="https://github.com/ojuri-io/ojuri/blob/main/CHANGELOG.md"
            className="nav-link inline-flex items-center gap-1.5 text-[15px] text-stone-700 no-underline"
            data-umami-event="changelog-full"
          >
            Full changelog on GitHub →
          </a>
        </div>
      </Container>
    </section>
  );
}
