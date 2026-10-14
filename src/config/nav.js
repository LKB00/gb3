// The site's places, in one file. The top bar, the phone bottom bar and the
// Explore tabs all read from here, so a new page is added in one spot.

// Explore tabs, in order. `short` is the label on phones, where all tabs sit in a small grid.
export const EXPLORE_TABS = [
  { to: '/autonomy', label: 'Autonomy ladder', short: 'Autonomy' },
  { to: '/teardowns', label: 'Teardowns' },
  { to: '/anti-patterns', label: 'Dark patterns' },
  { to: '/principles', label: 'Principles' },
  { to: '/glossary', label: 'Glossary' },
  { to: '/learn', label: 'Deep dives' },
];
// Where the "Explore" link in the top bar and bottom bar goes.
export const EXPLORE_HOME = '/teardowns';

export const isPlay = (path) => path.startsWith('/play') || path.startsWith('/practice');
export const isCards = (path) => path.startsWith('/patterns');
export const isExplore = (path) => EXPLORE_TABS.some((t) => path.startsWith(t.to));

// Phone back button: the parent page and its name. Only these pages have child pages,
// so an unknown deep path (a 404) gets no Back button that would lead to another 404.
const PARENT_NAMES = { '/play': 'Play', '/play/story': 'Stories', '/patterns': 'Cards', '/learn': 'Deep dives', '/teardowns': 'Teardowns' };
export function parentOf(path) {
  const parts = path.split('/').filter(Boolean);
  if (parts.length < 2) return null;
  const to = '/' + parts.slice(0, -1).join('/');
  return PARENT_NAMES[to] ? { to, name: PARENT_NAMES[to] } : null;
}

// "Back" goes where you came from. `from` is the page this history entry was opened from
// (App.jsx keeps track: its path, search and browser-tab title).
// - Came from the parent page: same label, but the button steps back in history,
//   so that page comes back at the same scroll spot.
// - Came from another page in the app (a teardown, the glossary, a game): name that page and step back to it.
// - Opened from a shared link or after a reload: the parent page, as a normal link.
const SITE = ' · Good Bot, Bad Bot';
const MAX_LABEL = 22;
function shortLabel(text) {
  if (text.length <= MAX_LABEL) return text;
  const cut = text.slice(0, MAX_LABEL - 1);
  const space = cut.lastIndexOf(' ');
  return (space > 8 ? cut.slice(0, space) : cut).replace(/[\s,.:·-]+$/, '') + '…';
}
function pageName(from) {
  if (from.path === '/') return 'Home';
  if (!from.title?.endsWith(SITE)) return null;
  const name = from.title.slice(0, -SITE.length).trim();
  return name && name !== 'Page not found' ? name : null;
}
export function backOf(path, from) {
  const parent = parentOf(path);
  if (!parent) return null;
  if (from && from.path !== path) {
    if (from.path === parent.to) return { ...parent, to: parent.to + (from.search || ''), history: true };
    const name = pageName(from);
    if (name) return { to: from.path + (from.search || ''), name: shortLabel(name), full: name, history: true };
  }
  return parent;
}
