# ojuri-website

Marketing site for **[Ojuri](https://github.com/ojuri-io/ojuri)** — open source,
self-hosted, multi-agent fraud detection. MIT-licensed. Launching June 7 2026.

Live at [ojuri.io](https://ojuri.io).

## Tech

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** with custom design tokens (Stone scale, Source Serif 4 /
  Inter / JetBrains Mono, brand spacing / radii)
- **Lucide React** icons
- No state-management library, no router library, no CMS. All copy is inline
  in components.
- **Static prerendering (SSG).** Every route is rendered to real HTML at build
  time (`src/entry-server.tsx` → `prerender.js`) so search and AI crawlers get
  full content, not an empty `#root`. The client hydrates that markup
  (`src/entry-client.tsx`); cross-page navigation is plain `<a>` — no client
  router. Per-page `<title>`, description, canonical, and JSON-LD come from
  `src/seo/pages.ts`.

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
```

## Build

```bash
npm run build        # tsc → client build → SSR build → prerender to dist/
npm run preview      # serve the build locally on 4173
```

`npm run build` runs four steps: type-check, the client bundle, an SSR bundle
(`dist/server/`, deleted after use), then `prerender.js`, which writes one
static `index.html` per route (`/`, `/compare`, `/docs/{rda,paa,mla,fia}`).
Routes are declared in `src/seo/pages.ts`; add a page there and in
`src/routes.tsx` and it is prerendered automatically. Keep `public/sitemap.xml`
in sync.

## Deployment

This repo auto-deploys on push to `main` via GitHub Actions
(`.github/workflows/deploy.yml`).

The workflow builds the site and publishes `dist/` to GitHub Pages. The custom
domain `ojuri.io` is configured via `public/CNAME` and a DNS A/AAAA / CNAME
record pointing at GitHub Pages.

### One-time GitHub setup

1. Repository → Settings → Pages → Build and deployment → Source:
   **GitHub Actions**.
2. Custom domain: `ojuri.io` (the workflow will pick this up from `CNAME`).
3. DNS at the registrar: point `ojuri.io` and `www.ojuri.io` at
   GitHub Pages per [their docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Structure

```
public/             # Static files served at the root
  CNAME             # ojuri.io
  .nojekyll         # Disable Jekyll; required for Vite output
  robots.txt
  site.webmanifest
  assets/
    dashboard-home.png    ← Sentinel screenshot used in SeeItOperating

src/
  components/       # One file per page section + ui/ primitives
  pages/            # Compare.tsx, DocPage.tsx (the /compare + /docs/* routes)
  data/             # architectureComponents.ts, docsPages.ts
  seo/              # pages.ts — per-route title/description/canonical/JSON-LD
  styles/           # tokens.css (CSS custom properties) + globals.css
  utils/            # renderInlineMono.tsx — parses `backtick` syntax
  App.tsx           # Assembles the home page sections
  routes.tsx        # matchRoute(pathname) → the page element
  entry-client.tsx  # Hydrates prerendered markup (or client-renders in dev)
  entry-server.tsx  # renderToString for the prerender step

prerender.js        # Post-build: writes static HTML per route into dist/

.github/workflows/
  deploy.yml        # GitHub Pages deploy
```

## Brand

Ojuri's brand is intentionally restrained — monotone Stone palette, generous
typography, no decorative chrome. Specifics:

- Hierarchy comes from weight, size, and spacing — not color contrast.
- Borders, not shadows.
- Sharp corners by default; `rounded-lg` (8px) is the ceiling on rectangles.
- No emoji, no stock photography, no gradients on brand surfaces.
- The wordmark is **Ojuri.** with a thick fullstop (700 weight on the period).
- Inline mono is reserved for code (paths, schema names, env vars, Kafka topics).

## Assets to supply

The following binary assets are referenced by the build but not included in
this repo. Drop them in `public/` before deploying:

| Path                              | What                                          |
|---|---|
| `public/favicon.ico`              | 32×32 ICO                                     |
| `public/favicon-16x16.png`        | 16×16                                         |
| `public/favicon-32x32.png`        | 32×32                                         |
| `public/apple-touch-icon.png`     | 180×180                                       |
| `public/og-image.png`             | 1200×630 — use a dashboard hero crop          |
| `public/assets/dashboard-home.png` | Sentinel dashboard screenshot (~4112×2260)   |

The dashboard screenshot is already in this repo if you imported from the
design source.

## License

MIT — same as the main Ojuri project.
