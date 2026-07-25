import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Button } from '../components/ui/Button';
import { PageShell } from '../components/PageShell';
import { docsPages, findDocPage } from '../data/docsPages';
import { findComponent } from '../data/architectureComponents';
import { renderInlineMono } from '../utils/renderInlineMono';

interface DocPageProps {
  slug: string;
}

export function DocPage({ slug }: DocPageProps) {
  const doc = findDocPage(slug);
  if (!doc) return null;

  const component = findComponent(doc.agentId);
  const others = docsPages.filter((p) => p.slug !== doc.slug);

  return (
    <PageShell>
      <article className="border-b border-stone-300/70">
        <Container className="py-16 sm:py-24 max-w-[760px]">
          <a
            href="/#architecture"
            className="inline-flex items-center gap-1.5 text-[13px] text-stone-500 hover:text-stone-900 no-underline"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Architecture
          </a>

          <Eyebrow variant="mono" className="mt-8 mb-4">{doc.eyebrow}</Eyebrow>
          <h1 className="font-display font-semibold text-stone-900 text-[32px] sm:text-[40px] leading-[1.12] tracking-tightest">
            {doc.h1}
          </h1>
          <p className="mt-5 text-[17px] leading-[27px] text-stone-700">
            {renderInlineMono(doc.lede)}
          </p>

          {doc.sections.map((section) => (
            <section key={section.heading} className="mt-12">
              <h2 className="font-display font-semibold text-stone-900 text-[22px] sm:text-[26px] leading-[1.2] tracking-tightest">
                {section.heading}
              </h2>
              {section.body.map((p, i) => (
                <p key={i} className="mt-4 text-[15.5px] leading-[26px] text-stone-700">
                  {renderInlineMono(p)}
                </p>
              ))}
            </section>
          ))}

          {component && (
            <section className="mt-14">
              <Eyebrow className="mb-4">At a glance</Eyebrow>
              <ul className="space-y-2.5 border-t border-stone-300 pt-6">
                {component.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[14px_1fr] gap-3 text-[14px] leading-[22px] text-stone-700"
                  >
                    <span
                      className="mt-[10px] inline-block w-[6px] h-[1px] bg-stone-400 self-start"
                      aria-hidden="true"
                    />
                    <span>{renderInlineMono(b)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-14 flex flex-wrap gap-3">
            <Button
              href="https://github.com/ojuri-io/ojuri"
              data-umami-event={`doc-${doc.slug}-github`}
            >
              View the source
              <ArrowUpRight size={16} strokeWidth={1.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
            <Button href="/compare" variant="ghost">Ojuri vs. SaaS</Button>
          </div>

          <nav className="mt-16 border-t border-stone-300 pt-8">
            <Eyebrow className="mb-4">Other agents</Eyebrow>
            <ul className="flex flex-col gap-2">
              {others.map((p) => (
                <li key={p.slug}>
                  <a
                    href={`/docs/${p.slug}`}
                    className="inline-flex items-center gap-2 text-[15px] text-stone-700 hover:text-stone-900 no-underline group"
                  >
                    <span className="font-mono text-[12px] text-stone-500 uppercase tracking-label">
                      {p.slug}
                    </span>
                    {p.eyebrow.split('·')[1]?.trim()}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </article>
    </PageShell>
  );
}
