import { docsPages } from '../data/docsPages';

export const SITE = 'https://ojuri.io';

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  jsonLd?: Record<string, unknown>;
}

const softwareApplicationLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Ojuri',
  alternateName: 'Ojuri Fraud Detection',
  url: `${SITE}/`,
  description:
    'Open-source, self-hosted, multi-agent fraud detection platform for fintech, payments, and e-commerce. In-process ONNX-served XGBoost scoring — p99 ≈ 6ms server-side in the project reference benchmark.',
  applicationCategory: 'SecurityApplication',
  applicationSubCategory: 'Fraud Detection',
  operatingSystem: 'Linux, macOS, Windows',
  license: 'https://opensource.org/licenses/MIT',
  codeRepository: 'https://github.com/ojuri-io/ojuri',
  downloadUrl: 'https://github.com/ojuri-io/ojuri',
  isAccessibleForFree: true,
  featureList: [
    'In-process ONNX-served XGBoost scoring (p99 ≈ 6ms server-side, reference benchmark)',
    'Multi-agent architecture: RDA (detection), PAA (pattern analysis), MLA (learning), FIA (investigation), Sentinel (dashboard)',
    'Drift-aware retraining on F1 and PSI signals with shadow/active promotion gates',
    'Self-hosted LLM investigation reports (Phi-3-mini), never on the authorization path',
    'Single-command Docker Compose deployment',
  ],
  offers: {
    '@type': 'Offer',
    price: '0.00',
    priceCurrency: 'USD',
  },
};

const techArticleLd = (path: string, title: string, description: string): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: title,
  description,
  url: `${SITE}${path}`,
  isPartOf: { '@type': 'WebSite', name: 'Ojuri', url: `${SITE}/` },
  about: { '@type': 'SoftwareApplication', name: 'Ojuri' },
});

const home: PageMeta = {
  path: '/',
  title: 'Ojuri — Fraud detection. Open source and self-hosted.',
  description:
    'Self-hosted, multi-agent fraud detection. ONNX-served XGBoost at p99 ≈ 6ms server-side. MIT licensed.',
  jsonLd: softwareApplicationLd,
};

const compare: PageMeta = {
  path: '/compare',
  title: 'Ojuri vs. SaaS fraud detection — open source, self-hosted alternative',
  description:
    'How Ojuri compares to hosted SaaS fraud APIs: in-process ONNX scoring at ~6ms, full data sovereignty, closed-loop retraining, and zero per-call fees under an MIT license.',
  jsonLd: techArticleLd(
    '/compare',
    'Ojuri vs. traditional SaaS fraud detection engines',
    'An open-source, self-hosted alternative to hosted SaaS fraud APIs.',
  ),
};

const docs: PageMeta[] = docsPages.map((p) => ({
  path: `/docs/${p.slug}`,
  title: `${p.h1} — Ojuri ${p.eyebrow.split('·')[1]?.trim() ?? ''}`.trim(),
  description: p.lede,
  jsonLd: techArticleLd(`/docs/${p.slug}`, p.h1, p.lede),
}));

export const PAGES: PageMeta[] = [home, compare, ...docs];

export const PAGE_PATHS: string[] = PAGES.map((p) => p.path);

const findPage = (path: string): PageMeta => PAGES.find((p) => p.path === path) ?? home;

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export interface HeadParts {
  title: string;
  description: string;
  extras: string;
}

export function headParts(path: string): HeadParts {
  const p = findPage(path);
  const url = `${SITE}${p.path === '/' ? '/' : p.path}`;
  const extras = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${esc(p.title)}" />`,
    `<meta property="og:description" content="${esc(p.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta name="twitter:title" content="${esc(p.title)}" />`,
    `<meta name="twitter:description" content="${esc(p.description)}" />`,
  ];
  if (p.jsonLd) {
    extras.push(`<script type="application/ld+json">${JSON.stringify(p.jsonLd)}</script>`);
  }
  return { title: esc(p.title), description: esc(p.description), extras: extras.join('\n    ') };
}
