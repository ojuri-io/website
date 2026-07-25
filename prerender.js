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

for (const route of PAGE_PATHS) {
  const html = render(route);
  const { title, description, extras } = headParts(route);

  const page = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description"[^>]*\/?>/,
      `<meta name="description" content="${description}" />`,
    )
    .replace('<!--app-head-->', extras)
    .replace('<!--app-html-->', html);

  const file = outPath(route);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page);
  console.log(`prerendered ${route} → ${file.replace(dist + '/', 'dist/')}`);
}

rmSync(join(dist, 'server'), { recursive: true, force: true });
