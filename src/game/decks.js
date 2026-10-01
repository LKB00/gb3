import { patterns } from '../data/patterns';
import { visuals } from '../data/visuals';
import { subtle } from '../data/subtle';

// Rounds for This or That. Every round has the same shape, whatever its source:
// { key, pattern, brief, good: { blocks, caption }, bad: { blocks, caption }, goodFirst, hard }
export function classicRound(id, goodFirst) {
  const v = visuals[id];
  return {
    key: `c:${id}`,
    pattern: id,
    brief: v.lab.goal,
    good: v.compare.good,
    bad: v.compare.bad,
    goodFirst,
    hard: false,
  };
}

export function hardRound(s, goodFirst) {
  return {
    key: `h:${s.id}`,
    pattern: s.pattern,
    brief: s.brief,
    good: { blocks: s.good, caption: s.goodCaption },
    bad: { blocks: s.bad, caption: s.badCaption },
    goodFirst,
    hard: true,
  };
}

function shuffle(list, rng) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function makeDeck(mode = 'classic', n = 10, rng = Math.random) {
  const classic = () => shuffle(patterns.map((p) => p.id), rng).map((id) => classicRound(id, rng() < 0.5));
  const hard = () => shuffle(subtle, rng).map((s) => hardRound(s, rng() < 0.5));
  if (mode === 'hard') return hard().slice(0, n);
  return classic().slice(0, n);
}

// ---- Daily challenge: the same 5 rounds for everyone on the same day ----
const EPOCH = Date.UTC(2026, 9, 1); // Daily #1 = 1 Oct 2026

export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function dailyNumber(key = todayKey()) {
  const [y, m, d] = key.split('-').map(Number);
  return Math.floor((Date.UTC(y, m - 1, d) - EPOCH) / 86400000) + 1;
}

// Small seeded random number generator (mulberry32), seeded from the date.
function seeded(key) {
  let h = 2166136261;
  for (const ch of key) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function dailyDeck(key = todayKey()) {
  const rng = seeded(`ai-patterns:${key}`);
  const easy = makeDeck('classic', 3, rng);
  const hard = makeDeck('hard', 2, rng);
  return [easy[0], easy[1], hard[0], easy[2], hard[1]];
}
