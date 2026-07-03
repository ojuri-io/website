import { useEffect, useRef } from 'react';

/**
 * Scroll-triggered reveal. Returns a `register` ref-callback; attach it to
 * each element that should fade up as it scrolls into view. Each element
 * is revealed once (then unobserved). Falls back to immediately visible
 * when IntersectionObserver is unavailable.
 *
 * Pair with the `.reveal` / `.reveal.is-visible` classes in globals.css.
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const els = useRef<T[]>([]);

  const register = (el: T | null) => {
    if (el && !els.current.includes(el)) els.current.push(el);
  };

  useEffect(() => {
    const nodes = els.current;
    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );
    nodes.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return register;
}
