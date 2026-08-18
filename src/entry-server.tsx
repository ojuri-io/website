import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { matchRoute } from './routes';

export { PAGE_PATHS, SITE, headParts } from './seo/pages';

export function render(url: string): string {
  return renderToString(<StrictMode>{matchRoute(url)}</StrictMode>);
}
