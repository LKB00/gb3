import { categories, patterns } from '../data/patterns';
import { ARCHETYPES } from './archetype';

// Your AI designer type grows in 3 ranks, inside the group you've collected most.
//   rank 0: no cards yet → "The Newcomer" (starter text)
//   rank 1: 1+ card in the group → "Rising Trust Keeper"
//   rank 2: half the group (at least 2 cards) → "The Trust Keeper"
//   rank 3: every card in the group, all with 3 stars (gold) → "Master Trust Keeper"
// Pure functions: pass in passed ids and the stars map, get plain data back.

const bare = (name) => name.replace(/^The /, '');
const withA = (word) => (/^[aeiou]/i.test(word) ? 'an ' : 'a ') + word;
const cards = (n, group) => `${n} more ${group} ${n === 1 ? 'card' : 'cards'}`;

function nameFor(base, rank) {
  if (rank === 1) return `Rising ${bare(base)}`;
  if (rank === 3) return `Master ${bare(base)}`;
  return base;
}

// Where one group stands: collected, gold (3 stars) and the rank it gives.
function groupStatus(id, passed, stars) {
  const list = patterns.filter((p) => p.category === id);
  const total = list.length;
  const got = list.filter((p) => passed.includes(p.id));
  const gold = got.filter((p) => (stars[p.id] || 0) >= 3).length;
  const half = Math.min(total, Math.max(2, Math.ceil(total / 2)));
  let rank = 0;
  if (total && gold === total) rank = 3;
  else if (got.length >= half) rank = 2;
  else if (got.length >= 1) rank = 1;
  // Same score as before (stars count), used to break ties between groups.
  const score = got.reduce((n, p) => n + Math.max(stars[p.id] || 1, 1), 0) / (total * 3 || 1);
  return { id, total, got: got.length, gold, half, rank, score };
}

// The plain hint for the next rank, or null at the top (or with no cards yet).
function nextHint(s, base, groupName) {
  if (s.rank === 1) return `Collect ${cards(s.half - s.got, groupName)} to become ${withA(bare(base))}.`;
  if (s.rank === 2) {
    const master = withA(`Master ${bare(base)}`);
    const left = s.total - s.got;
    if (left > 0) return `Collect ${cards(left, groupName)}, then get 3 stars on each to become ${master}.`;
    const dim = s.total - s.gold;
    return `Get 3 stars on ${dim} more ${groupName} ${dim === 1 ? 'card' : 'cards'} to become ${master}.`;
  }
  return null;
}

export function designerType({ passed = [], stars = {} } = {}) {
  const safePassed = Array.isArray(passed) ? passed : [];
  const safeStars = stars && typeof stars === 'object' ? stars : {};
  let best = null;
  for (const c of categories) {
    const s = groupStatus(c.id, safePassed, safeStars);
    if (!s.rank) continue;
    if (!best || s.rank > best.rank || (s.rank === best.rank && s.score > best.score)) best = { ...s, groupName: c.name };
  }
  if (!best) {
    const none = ARCHETYPES.none;
    return { name: none.name, line: none.line, rank: 0, group: null, next: null, sentence: null };
  }
  const base = ARCHETYPES[best.id];
  const name = nameFor(base.name, best.rank);
  return {
    name,
    line: base.line,
    rank: best.rank,
    group: best.id,
    next: nextHint(best, base.name, best.groupName),
    // For sentences like "You're a Rising Trust Keeper."
    sentence: withA(bare(name)),
  };
}
