// Privacy-friendly visitor stats with Plausible (no cookies, no personal data).
// OFF unless the site is built with VITE_PLAUSIBLE_DOMAIN set, for example:
//   VITE_PLAUSIBLE_DOMAIN=lkb00.github.io npm run build
// See README → "Visitor stats".
const DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN;

export function startTracking() {
  if (!DOMAIN || typeof document === 'undefined') return;
  window.plausible =
    window.plausible ||
    function (...args) {
      (window.plausible.q = window.plausible.q || []).push(args);
    };
  const s = document.createElement('script');
  s.defer = true;
  s.dataset.domain = DOMAIN;
  s.src = 'https://plausible.io/js/script.hash.js'; // hash mode, because the site uses #/ routes
  document.head.appendChild(s);
}

// A finished game, e.g. track('Game finished', { game: 'speed', score: 12 })
export function track(event, props) {
  if (!DOMAIN) return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    /* ignore */
  }
}
