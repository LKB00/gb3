// Privacy-friendly visitor stats with GoatCounter (free, no cookies, no personal data).
// OFF unless the site is built with VITE_GOATCOUNTER_CODE set (your GoatCounter site code), for example:
//   VITE_GOATCOUNTER_CODE=mysite npm run build      (stats at https://mysite.goatcounter.com)
// See README → "Visitor stats".
const CODE = import.meta.env.VITE_GOATCOUNTER_CODE;

let latest = '';
let last = '';
const countLatest = () => {
  if (!latest || latest === last || !window.goatcounter?.count) return;
  last = latest;
  try {
    window.goatcounter.count({ path: latest });
  } catch {
    /* ignore */
  }
};

// Called by the router on every page change (App.jsx). Path only, no ?query: challenge links carry seeds, not visitors.
export function trackPage(path) {
  if (!CODE) return;
  latest = path;
  countLatest();
}

export function startTracking() {
  if (!CODE || typeof document === 'undefined') return;
  // The site uses #/ routes, so GoatCounter's automatic count is off and page changes are counted by trackPage.
  window.goatcounter = { no_onload: true, endpoint: `https://${CODE}.goatcounter.com/count` };
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.onload = countLatest;
  document.head.appendChild(s);
}

// A finished game, e.g. track('Game finished', { game: 'speed', score: 12 }). Shows as an event in GoatCounter.
export function track(event, props) {
  if (!CODE) return;
  const name = [event, props?.game].filter(Boolean).join(': ');
  try {
    window.goatcounter?.count?.({ path: name.toLowerCase().replace(/\s+/g, '-'), title: name, event: true });
  } catch {
    /* ignore */
  }
}
