// Privacy-friendly visitor stats with GoatCounter (free, no cookies, no personal data).
// Stats are at https://lkb.goatcounter.com. The site code is not secret; set VITE_GOATCOUNTER_CODE at build time to use another one.
// GoatCounter ignores localhost, so local tests and `npm run dev` are not counted. See README → "Visitor stats".
const CODE = import.meta.env.VITE_GOATCOUNTER_CODE || 'lkb';

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
