import { Container } from '../components/ui/Container';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Button } from '../components/ui/Button';
import { PageShell } from '../components/PageShell';
import { docsPages } from '../data/docsPages';

export function NotFound() {
  return (
    <PageShell>
      <section>
        <Container className="py-16 sm:py-24 max-w-[820px]">
          <Eyebrow className="mb-4">404</Eyebrow>
          <h1 className="font-display font-semibold text-stone-900 text-[32px] sm:text-[44px] leading-[1.1] tracking-tightest">
            That page isn’t here.
          </h1>
          <p className="mt-5 text-[17px] leading-[27px] text-stone-700">
            The link may be out of date, or the page may have moved. Everything
            on the site is one hop from here.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/">Back to the landing page</Button>
            <Button href="/compare/" variant="ghost">Ojuri vs. SaaS</Button>
          </div>

          <nav className="mt-16 border-t border-stone-300 pt-8">
            <Eyebrow className="mb-4">Agent docs</Eyebrow>
            <ul className="flex flex-col gap-2">
              {docsPages.map((p) => (
                <li key={p.slug}>
                  <a
                    href={`/docs/${p.slug}/`}
                    className="inline-flex items-center gap-2 text-[15px] text-stone-700 hover:text-stone-900 no-underline"
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
      </section>
    </PageShell>
  );
}
