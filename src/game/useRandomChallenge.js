import { useNavigate } from 'react-router-dom';
import { patterns } from '../data/patterns';
import { usePassed, useStars } from '../progress';

// What a collector should play next.
// A collected card counts at least 1 star (same rule as XP).
const starsOf = (id, passed, stars) => stars[id] || (passed.includes(id) ? 1 : 0);
export const isMissing = (id, passed) => !passed.includes(id);
export const needsStars = (id, passed, stars) => passed.includes(id) && starsOf(id, passed, stars) < 3;

// The next card to play after `fromId`, in list order (wrapping round):
// first a card not collected yet, else a card under 3 stars, else null (all done).
export function nextTarget(fromId, passed, stars) {
  const i = patterns.findIndex((p) => p.id === fromId);
  const order = [...patterns.slice(i + 1), ...patterns.slice(0, Math.max(0, i))];
  const missing = order.find((p) => isMissing(p.id, passed));
  if (missing) return { pattern: missing, kind: 'missing' };
  const low = order.find((p) => needsStars(p.id, passed, stars));
  return low ? { pattern: low, kind: 'stars' } : null;
}

// Picks a card you haven't collected yet, then one under 3 stars, then any card.
// `kind` says which, so buttons can say what they do.
export function useRandomChallenge() {
  const passed = usePassed();
  const stars = useStars();
  const navigate = useNavigate();
  const left = patterns.filter((p) => isMissing(p.id, passed));
  const low = patterns.filter((p) => needsStars(p.id, passed, stars));
  const pool = left.length ? left : low.length ? low : patterns;
  const play = () => navigate(`/patterns/${pool[Math.floor(Math.random() * pool.length)].id}`);
  play.kind = left.length ? 'missing' : low.length ? 'stars' : 'any';
  return play;
}
