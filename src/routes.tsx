import type { ReactElement } from 'react';
import { App } from './App';
import { Compare } from './pages/Compare';
import { DocPage } from './pages/DocPage';
import { NotFound } from './pages/NotFound';
import { findDocPage } from './data/docsPages';

export function matchRoute(pathname: string): ReactElement {
  const path =
    pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  if (path === '/compare') return <Compare />;
  if (path === '/404') return <NotFound />;

  if (path.startsWith('/docs/')) {
    const slug = path.slice('/docs/'.length);
    if (findDocPage(slug)) return <DocPage slug={slug} />;
  }

  return <App />;
}
