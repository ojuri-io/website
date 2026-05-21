# ojuri-website

Marketing site for **[Ojuri](https://github.com/ojuri-io/ojuri)** — open source,
self-hosted, multi-agent fraud detection. MIT-licensed. Launching June 7 2026.

Live at [ojuri.io](https://ojuri.io).

## Tech

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** with custom design tokens (Stone scale, Source Serif 4 /
  Inter / JetBrains Mono, brand spacing / radii)
- **Lucide React** icons
- No state-management library, no routing library, no CMS, no analytics.
  All copy is inline in components.

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
```

## Build

```bash
npm run build        # outputs to dist/
npm run preview      # serve the build locally on 4173
```

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
  data/             # architectureComponents.ts (the 10 panel objects)
  styles/           # tokens.css (CSS custom properties) + globals.css
  utils/            # renderInlineMono.tsx — parses `backtick` syntax
  App.tsx           # Assembles all sections
  main.tsx          # Root mount

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
