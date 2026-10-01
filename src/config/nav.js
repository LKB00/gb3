// The site's places, in one file. The top bar, the phone bottom bar and the
// Explore tabs all read from here, so a new page is added in one spot.

// Explore tabs, in order.
export const EXPLORE_TABS = [
  { to: '/autonomy', label: 'Autonomy ladder' },
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

// Phone back button: the name of the parent page (anything else just says "Back").
const PARENT_NAMES = { '/play': 'Play', '/play/story': 'Stories', '/patterns': 'Cards', '/learn': 'Deep dives', '/teardowns': 'Teardowns' };
export function parentOf(path) {
  const parts = path.split('/').filter(Boolean);
  if (parts.length < 2) return null;
  const to = '/' + parts.slice(0, -1).join('/');
  return { to, name: PARENT_NAMES[to] || 'Back' };
}
