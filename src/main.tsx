import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/globals.css';

declare global {
  interface Window { ojuriPreloaderDone?: () => void; }
}

// Flip the body class so entrance transitions can run.
// Done in a microtask so the initial DOM is committed first.
queueMicrotask(() => {
  document.body.classList.add('is-loaded');
  window.ojuriPreloaderDone?.();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
