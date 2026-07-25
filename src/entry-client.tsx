import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { matchRoute } from './routes';
import './styles/globals.css';

declare global {
  interface Window { ojuriPreloaderDone?: () => void; }
}

queueMicrotask(() => {
  document.body.classList.add('is-loaded');
  window.ojuriPreloaderDone?.();
});

const container = document.getElementById('root')!;
const tree = <StrictMode>{matchRoute(window.location.pathname)}</StrictMode>;

// Prerendered pages ship real markup to hydrate; dev serves an empty root.
if (container.childElementCount > 0) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
