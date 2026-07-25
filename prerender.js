import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');

const template = readFileSync(join(dist, 'index.html'), 'utf-8');
const { render, headParts, PAGE_PATHS } = await import(
  pathToFileURL(join(dist, 'server', 'entry-server.js')).href
);

const outPath = (route) =>
  route === '/' ? join(dist, 'index.html') : join(dist, route, 'index.html');

// The preloader lives in index.html but should only run on the landing page.
// On '/', keep it and drop the marker comments; elsewhere, strip it entirely.
const PRELOADER_BLOCKS = [
  ['<!--preloader-head-start-->', '<!--preloader-head-end-->'],
  ['<!--preloader-body-start-->', '<!--preloader-body-end-->'],
];

function applyPreloader(pageHtml, route) {
  for (const [open, close] of PRELOADER_BLOCKS) {
    if (route === '/') {
      pageHtml = pageHtml.split(open).join('').split(close).join('');
      continue;
    }
    const start = pageHtml.indexOf(open);
    const end = pageHtml.indexOf(close);
    if (start !== -1 && end !== -1) {
      pageHtml = pageHtml.slice(0, start) + pageHtml.slice(end + close.length);
    }
  }
  return pageHtml;
}

for (const route of PAGE_PATHS) {
  const html = render(route);
  const { title, description, extras } = headParts(route);

  let page = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description"[^>]*\/?>/,
      `<meta name="description" content="${description}" />`,
    )
    .replace('<!--app-head-->', extras)
    .replace('<!--app-html-->', html);
  page = applyPreloader(page, route);

  const file = outPath(route);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page);
  console.log(`prerendered ${route} → ${file.replace(dist + '/', 'dist/')}`);
}

rmSync(join(dist, 'server'), { recursive: true, force: true });
