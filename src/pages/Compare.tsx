import { ArrowUpRight } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Button } from '../components/ui/Button';
import { PageShell } from '../components/PageShell';
import { docsPages } from '../data/docsPages';

interface Advantage {
  eyebrow: string;
  heading: string;
  saas: string;
  ojuri: string;
}

const advantages: Advantage[] = [
  {
    eyebrow: 'Latency',
    heading: 'Scoring runs in your process, not across a network',
    saas: 'A hosted fraud API adds a network round-trip to every authorization, so scoring latency depends on a third party’s data center and your link to it.',
    ojuri:
      'Ojuri serves a compiled XGBoost model via ONNX Runtime inside the detection service — scoring is in-process, with no third-party hop. The project’s reference benchmark measures p99 ≈ 6ms server-side on a single developer workstation; these are reference values, not SLA targets, so re-measure on your own hardware.',
  },
  {
    eyebrow: 'Data sovereignty',
    heading: 'Payloads never leave your infrastructure',
    saas: 'Sending PII and transaction payloads to a third-party cloud means customer data leaves your network — a data-residency concern under regimes like NDPR, CBN, and GDPR.',
    ojuri:
      'Ojuri runs entirely inside your network boundary under an MIT license. Customer profiles, payloads, and risk metrics stay on your own servers.',
  },
  {
    eyebrow: 'Closed-loop ML',
    heading: 'Models retrain on real labels, not static rules',
    saas: 'Legacy rules drift out of date and drive false positives; updating models often means slow, manual pipeline work.',
    ojuri:
      'The Model Learning Agent watches F1 and PSI, retrains on reviewer ground-truth labels, and gates promotion behind statistical checks before anything reaches production.',
  },
];

const table: Array<[string, string, string]> = [
  ['Deployment', 'Third-party SaaS API', 'Self-hosted, single-command Docker Compose'],
  ['Per-transaction latency', 'External network round-trip per call', 'In-process · ≈6ms server-side (reference benchmark)'],
  ['Data residency', 'Payloads leave your network', 'Stays inside your boundary'],
  ['Pricing', 'Per-call API fees', 'Free — MIT licensed'],
  ['Model updates', 'Vendor-controlled, often manual', 'Drift-aware automated retraining'],
  ['Explainability', 'Often a black box', 'Reason codes + LLM investigation reports'],
];

export function Compare() {
  return (
    <PageShell>
      <section className="border-b border-stone-300/70">
        <Container className="py-16 sm:py-24 max-w-[820px]">
          <Eyebrow className="mb-4">Comparison</Eyebrow>
          <h1 className="font-display font-semibold text-stone-900 text-[32px] sm:text-[44px] leading-[1.1] tracking-tightest">
            Ojuri vs. traditional SaaS fraud detection
          </h1>
          <p className="mt-5 text-[17px] leading-[27px] text-stone-700">
            Scaling a fintech, payment gateway, or mobile-money platform usually means choosing between
            an expensive black-box SaaS vendor and months building a rules engine from scratch. Ojuri is
            a third option: an open-source, self-hosted, multi-agent fraud engine that runs inside your
            own infrastructure — no per-call fees, no data egress.
          </p>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full border-collapse text-[14px]">
              <thead>
                <tr className="border-b border-stone-300 text-left">
                  <th className="py-3 pr-4 font-medium text-stone-500 font-mono text-[11px] uppercase tracking-label"></th>
                  <th className="py-3 px-4 font-medium text-stone-500 font-mono text-[11px] uppercase tracking-label">SaaS fraud API</th>
                  <th className="py-3 pl-4 font-medium text-stone-900 font-mono text-[11px] uppercase tracking-label">Ojuri</th>
                </tr>
              </thead>
              <tbody>
                {table.map(([label, saas, ojuri]) => (
                  <tr key={label} className="border-b border-stone-200 align-top">
                    <td className="py-3 pr-4 text-stone-900 font-medium">{label}</td>
                    <td className="py-3 px-4 text-stone-600">{saas}</td>
                    <td className="py-3 pl-4 text-stone-900">{ojuri}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="border-b border-stone-300/70">
        <Container className="py-16 sm:py-20 max-w-[820px]">
          {advantages.map((a) => (
            <div key={a.eyebrow} className="mb-14 last:mb-0">
              <Eyebrow className="mb-3">{a.eyebrow}</Eyebrow>
              <h2 className="font-display font-semibold text-stone-900 text-[24px] sm:text-[28px] leading-[1.18] tracking-tightest max-w-[26ch]">
                {a.heading}
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <p className="text-[15px] leading-[24px] text-stone-600 border-l-2 border-stone-300 pl-4">
                  <span className="block font-mono text-[11px] uppercase tracking-label text-stone-400 mb-1">SaaS</span>
                  {a.saas}
                </p>
                <p className="text-[15px] leading-[24px] text-stone-800 border-l-2 border-stone-900 pl-4">
                  <span className="block font-mono text-[11px] uppercase tracking-label text-stone-500 mb-1">Ojuri</span>
                  {a.ojuri}
                </p>
              </div>
            </div>
          ))}
        </Container>
      </section>

      <section className="border-b border-stone-300/70">
        <Container className="py-16 sm:py-20 max-w-[820px]">
          <Eyebrow className="mb-4">The agents</Eyebrow>
          <h2 className="font-display font-semibold text-stone-900 text-[24px] sm:text-[28px] leading-[1.18] tracking-tightest">
            Four specialized agents, decoupled by Kafka
          </h2>
          <p className="mt-3 text-[15px] leading-[24px] text-stone-700">
            Unlike a monolithic scoring API, Ojuri splits fraud detection across independent agents so a
            failure in one never blocks a payment in another.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {docsPages.map((p) => (
              <li key={p.slug}>
                <a
                  href={`/docs/${p.slug}/`}
                  className="block border border-stone-300 rounded-md p-5 hover:border-stone-500 transition-colors no-underline group"
                >
                  <span className="font-mono text-[11px] uppercase tracking-label text-stone-500">
                    {p.slug}
                  </span>
                  <span className="mt-1 block text-[15px] text-stone-900 font-medium">
                    {p.eyebrow.split('·')[1]?.trim()}
                  </span>
                  <span className="mt-1 block text-[13.5px] leading-[20px] text-stone-600">
                    {p.h1}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-14 flex flex-wrap gap-3">
            <Button href="https://github.com/ojuri-io/ojuri" data-umami-event="compare-github">
              Explore the repository
              <ArrowUpRight size={16} strokeWidth={1.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
            <Button href="/#quickstart" variant="ghost">Quickstart</Button>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
