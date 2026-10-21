// Privacy-friendly visitor stats with GoatCounter (free, no cookies, no personal data).
// Stats are at https://lkb.goatcounter.com. The site code is not secret; set VITE_GOATCOUNTER_CODE at build time to use another one.
// GoatCounter ignores localhost, so local tests and `npm run dev` are not counted. See README → "Visitor stats".
export const CODE = import.meta.env.VITE_GOATCOUNTER_CODE || 'lkb';

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

// Which game a page is, from its #/ route, for "Game started".
// Names match the games' own "Game finished" names where they can (build and story finishes add the brief/story id).
function gameFromRoute(hash) {
  const [path, query = ''] = hash.replace(/^#/, '').split('?');
  const parts = path.split('/').filter(Boolean);
  if (!parts.length) return 'this-or-that-classic'; // the quick game on Home
  if (parts[0] === 'patterns') return 'fix-it';
  if (parts[0] !== 'play' || !parts[1]) return null;
  if (parts[1] === 'this-or-that') return new URLSearchParams(query).get('mode') === 'hard' ? 'this-or-that-hard' : 'this-or-that-classic';
  return parts[1]; // daily, speed, power, build, story, spot-the-flaw
}

// The first answer in a game, once per game per visit: "Game started: speed".
// Next to "Game finished" it shows how many people who start a game also finish it.
const started = new Set();
export function trackStart() {
  if (!CODE || typeof window === 'undefined') return;
  const game = gameFromRoute(window.location.hash);
  if (!game || started.has(game)) return;
  started.add(game);
  try {
    const seen = JSON.parse(sessionStorage.getItem('gb3-started') || '[]');
    if (Array.isArray(seen) && seen.includes(game)) return;
    sessionStorage.setItem('gb3-started', JSON.stringify([...(Array.isArray(seen) ? seen : []), game]));
  } catch {
    /* no storage: the Set above still counts it once per page load */
  }
  track('Game started', { game });
}
