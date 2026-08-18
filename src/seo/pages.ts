import { docsPages } from '../data/docsPages';

export const SITE = 'https://ojuri.io';

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  jsonLd: Record<string, unknown>[];
  noindex?: boolean;
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

const organizationLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Ojuri',
  url: `${SITE}/`,
  logo: `${SITE}/apple-touch-icon.png`,
  sameAs: ['https://github.com/ojuri-io'],
};

const breadcrumbLd = (name: string, path: string): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
    { '@type': 'ListItem', position: 2, name, item: `${SITE}${path}` },
  ],
});

const agentName = (eyebrow: string): string => eyebrow.split('·')[1]?.trim() ?? 'Ojuri';

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
  jsonLd: [softwareApplicationLd, organizationLd],
};

const compare: PageMeta = {
  path: '/compare/',
  title: 'Ojuri vs. SaaS fraud detection — open-source alternative',
  description:
    'How Ojuri compares to hosted SaaS fraud APIs: in-process ONNX scoring at ~6ms, full data sovereignty, and no per-call fees under an MIT license.',
  jsonLd: [
    techArticleLd(
      '/compare/',
      'Ojuri vs. traditional SaaS fraud detection engines',
      'An open-source, self-hosted alternative to hosted SaaS fraud APIs.',
    ),
    breadcrumbLd('Ojuri vs. SaaS', '/compare/'),
  ],
};

// Paths carry a trailing slash: GitHub Pages 301s /docs/rda to /docs/rda/, so
// canonicals and the sitemap must name the URL that actually serves a 200.
const docs: PageMeta[] = docsPages.map((p) => ({
  path: `/docs/${p.slug}/`,
  title: p.seoTitle,
  description: p.seoDescription,
  jsonLd: [
    techArticleLd(`/docs/${p.slug}/`, p.h1, p.lede),
    breadcrumbLd(agentName(p.eyebrow), `/docs/${p.slug}/`),
  ],
}));

// Served by GitHub Pages for any unknown path, so it must never be indexed
// and never appears in the sitemap.
const notFound: PageMeta = {
  path: '/404',
  title: 'Page not found — Ojuri',
  description:
    'That page isn’t here. Browse the agent docs or head back to the landing page.',
  jsonLd: [],
  noindex: true,
};

export const NOT_FOUND_PATH = notFound.path;

export const PAGES: PageMeta[] = [home, compare, ...docs];

export const PAGE_PATHS: string[] = PAGES.map((p) => p.path);

const findPage = (path: string): PageMeta =>
  [...PAGES, notFound].find((p) => p.path === path) ?? home;

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export interface HeadParts {
  title: string;
  description: string;
  extras: string;
}

export function headParts(path: string): HeadParts {
  const p = findPage(path);
  const url = `${SITE}${p.path}`;
  const indexing = p.noindex
    ? ['<meta name="robots" content="noindex" />']
    : [`<link rel="canonical" href="${url}" />`, `<meta property="og:url" content="${url}" />`];
  const extras = [
    ...indexing,
    `<meta property="og:title" content="${esc(p.title)}" />`,
    `<meta property="og:description" content="${esc(p.description)}" />`,
    `<meta name="twitter:title" content="${esc(p.title)}" />`,
    `<meta name="twitter:description" content="${esc(p.description)}" />`,
    ...p.jsonLd.map((ld) => `<script type="application/ld+json">${JSON.stringify(ld)}</script>`),
  ];
  return { title: esc(p.title), description: esc(p.description), extras: extras.join('\n    ') };
}
