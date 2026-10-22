import { categories, getPattern, patterns } from '../data/patterns';
import { subtle } from '../data/subtle';
import { weekKey } from '../lib/dates';
import { shuffle } from '../lib/random';
import { classicRound, hardRound } from './decks';
import { addThemeAnswer } from '../progress';

// Theme weeks: each ISO week one pattern group is in the spotlight ("Agents week"), the same for everyone.
// This or That leans to it (a few of its rounds mixed into a normal run), and THEME_GOAL right answers
// in that group during the week earn the week's badge (listed on Me).
export const THEME_GOAL = 10;
const LEAN = 3; // rounds of the theme group in a normal run

export function themeOfWeek(key) {
  const n = Number(key.slice(0, 4)) * 53 + Number(key.slice(6));
  return categories[n % categories.length];
}
export function themeWeek(d = new Date()) {
  const key = weekKey(d);
  return { key, group: themeOfWeek(key) };
}

const inGroup = (round, group) => getPattern(round.pattern)?.category === group.id;

// Swap a few rounds of a fresh Classic or Hard run for this week's group.
// Never used for the Daily or a boss: those decks are fixed.
export function leanDeck(deck, mode, rng = Math.random) {
  if (mode !== 'classic' && mode !== 'hard') return deck;
  const { group } = themeWeek();
  const have = new Set(deck.map((r) => r.key));
  const pool =
    mode === 'hard'
      ? subtle.filter((s) => getPattern(s.pattern)?.category === group.id).map((s) => hardRound(s, rng() < 0.5))
      : patterns.filter((p) => p.category === group.id).map((p) => classicRound(p.id, rng() < 0.5));
  const extra = shuffle(pool.filter((r) => !have.has(r.key)), rng);
  let need = Math.max(0, LEAN - deck.filter((r) => inGroup(r, group)).length);
  const out = [...deck];
  for (let i = out.length - 1; i >= 0 && need > 0 && extra.length; i--) {
    if (inGroup(out[i], group)) continue;
    out[i] = extra.shift();
    need--;
  }
  return shuffle(out, rng);
}

// A right answer: counted if it's in this week's group. The answer that reaches the goal pops a toast.
export function countThemeAnswer(round) {
  const { key, group } = themeWeek();
  if (!inGroup(round, group)) return;
  if (addThemeAnswer(key) === THEME_GOAL) {
    window.dispatchEvent(new CustomEvent('gb3-toast', { detail: { id: `theme-${key}`, name: `${group.name} week done!`, text: 'Week badge earned. See it on Me.' } }));
  }
}
