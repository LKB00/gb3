import { dayKey } from './lib/dates';
import { CHANGE, readJSON, writeJSON, useStored } from './lib/storage';

export { dayKey };

// Everything a visitor earns, saved in their browser (see lib/storage.js).
// Keys in localStorage:
//   labs-passed  ['citations', …]        cards collected (Fix it)
//   hunts-done   ['chat', …]             Spot the flaw screens finished
//   lab-stars    { citations: 3, … }     best stars per card
//   game-stats   { bestStreak, speedBest, powerBest, builds: {id: stars}, stories: {id: trust} }
//   daily        { 'YYYY-MM-DD': [true, false, …] }   Daily challenge results
//   days         { 'YYYY-MM-DD': moves }              day streak and daily goal
// Adding a new game score: add a saveBest('myBest') line and a line in xpParts().

const read = (key) => readJSON(key, []);
const readObj = (key) => readJSON(key, {});
const useList = (key) => useStored(key, []);
const useObj = (key) => useStored(key, {});

function add(key, id) {
  const list = read(key);
  if (list.includes(id)) return;
  writeJSON(key, [...list, id]);
}

// Keep the best number only: game-stats[field] = max(old, value).
function saveBest(field, value) {
  const s = readObj('game-stats');
  if ((s[field] || 0) >= value) return;
  writeJSON('game-stats', { ...s, [field]: value });
}
// Same, per item: game-stats[field][id] = max(old, value).
function saveBestIn(field, id, value, current = (s) => s[field] || {}) {
  const s = readObj('game-stats');
  const map = { ...current(s) };
  if ((map[id] ?? -1) >= value) return;
  writeJSON('game-stats', { ...s, [field]: { ...map, [id]: value } });
}

export const markPassed = (id) => add('labs-passed', id);
export const usePassed = () => useList('labs-passed');

export const markHuntDone = (id) => add('hunts-done', id);
export const useHuntsDone = () => useList('hunts-done');

// ---- Stars, best scores, XP and levels ----
// Stars per challenge: 3 = no mistakes, 2 = one mistake, 1 = more. Only the best is kept.
export const saveStars = (id, stars) => {
  const all = readObj('lab-stars');
  if ((all[id] || 0) >= stars) return;
  writeJSON('lab-stars', { ...all, [id]: stars });
};
export const useStars = () => useObj('lab-stars');

export const saveStreak = (n) => saveBest('bestStreak', n);
export const useGameStats = () => useObj('game-stats');

export const LEVELS = [
  { xp: 0, name: 'Rookie' },
  { xp: 100, name: 'Prompt tinkerer' },
  { xp: 300, name: 'Pattern spotter' },
  { xp: 600, name: 'Interaction designer' },
  { xp: 1000, name: 'AI UX pro' },
  { xp: 1300, name: 'Legend' },
];
export const XP = { star: 10, hunt: 30, streak: 5, daily: 10, speed: 2, power: 2 };

// Build mode: best stars per brief, in game-stats.builds = { briefId: 1–3 }.
export const saveBuild = (id, stars) => saveBestIn('builds', id, stars);

// Stories: best trust per story, in game-stats.stories = { storyId: 0–100 }.
// (The first story used to save game-stats.storyBest; it still counts.)
export const saveStoryBest = (id, trust) => saveBestIn('stories', id, trust, storyBests);
export function storyBests(stats) {
  const out = { ...(stats.stories || {}) };
  if (stats.storyBest != null && out.tidy == null) out.tidy = stats.storyBest;
  return out;
}

// How much power?: best points out of 16.
export const savePower = (points) => saveBest('powerBest', points);

// Speed round: best points in 60 seconds.
export const saveSpeed = (points) => saveBest('speedBest', points);

// Daily challenge: { 'YYYY-MM-DD': [true, false, …] }. First result of the day counts.
export function saveDaily(key, results) {
  const all = readObj('daily');
  if (all[key]) return;
  writeJSON('daily', { ...all, [key]: results });
}
export const useDaily = () => useObj('daily');

// Days in a row with a Daily played, ending today (or yesterday, so it isn't lost before you play).
export function dailyStreak(daily, today = new Date()) {
  const d = new Date(today);
  if (!daily[dayKey(d)]) d.setDate(d.getDate() - 1);
  let n = 0;
  while (daily[dayKey(d)]) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

// Where XP comes from. One line per source; the total is the sum.
export function xpParts({ stars, hunts, stats, passed, daily }) {
  // A collected card always counts at least one star (older saves had no stars).
  const starTotal = passed.reduce((n, id) => n + Math.max(stars[id] || 1, 1), 0);
  const dailyRight = Object.values(daily).reduce((n, r) => n + r.filter(Boolean).length, 0);
  const sum = (obj, f) => Object.values(obj).reduce((n, v) => n + f(v), 0);
  return {
    starTotal,
    parts: {
      cards: starTotal * XP.star,
      hunts: hunts.length * XP.hunt,
      streak: (stats.bestStreak || 0) * XP.streak,
      daily: dailyRight * XP.daily,
      stories: sum(storyBests(stats), (t) => Math.round(Math.max(0, t) / 2)),
      builds: sum(stats.builds || {}, (st) => st * XP.star),
      speed: (stats.speedBest || 0) * XP.speed,
      power: (stats.powerBest || 0) * XP.power,
    },
  };
}

export function useXP() {
  const input = { stars: useStars(), hunts: useHuntsDone(), stats: useGameStats(), passed: usePassed(), daily: useDaily() };
  const { starTotal, parts } = xpParts(input);
  const xp = Object.values(parts).reduce((n, v) => n + v, 0);
  let i = LEVELS.length - 1;
  while (LEVELS[i].xp > xp) i--;
  const level = LEVELS[i];
  const nextLevel = LEVELS[i + 1];
  return { xp, starTotal, level, levelNum: i + 1, nextLevel, toNext: nextLevel ? nextLevel.xp - xp : 0 };
}

// ---- Days played, day streak and daily goal ----
// 'days' = { 'YYYY-MM-DD': number of moves that day }. A move is any answer in
// any game (a This or That pick, a Fix it step, a flaw found, a story choice).
export const DAILY_GOAL = 10;

export function markPlayed() {
  const all = readObj('days');
  const k = dayKey();
  const before = all[k] || 0;
  writeJSON('days', { ...all, [k]: before + 1 });
  if (before + 1 === DAILY_GOAL) window.dispatchEvent(new Event('goal-reached'));
}
export const useDays = () => useObj('days');

// Streak with a gentle rule: one missed day per 7 days is covered by a "freeze",
// so one busy day doesn't wipe out weeks of play. Today not played yet doesn't
// break the streak either (you still have time).
export function streakInfo(days, today = new Date()) {
  const d = new Date(today);
  const played = (x) => (days[dayKey(x)] || 0) > 0;
  const frozen = [];
  let count = 0;
  let lastFreeze = -Infinity; // index (in counted days) of the last freeze used
  const todayOpen = !played(d);
  if (todayOpen) d.setDate(d.getDate() - 1);
  for (;;) {
    if (played(d)) {
      count++;
      d.setDate(d.getDate() - 1);
      continue;
    }
    // A single missed day, with a played day before it, and no freeze in the last 7 days.
    const before = new Date(d);
    before.setDate(before.getDate() - 1);
    if ((count > 0 || todayOpen) && played(before) && count - lastFreeze >= 7) {
      frozen.push(dayKey(d));
      lastFreeze = count;
      d.setDate(d.getDate() - 1);
      continue;
    }
    break;
  }
  const freezeReady = count - lastFreeze >= 7;
  return { streak: count, frozen, freezeReady, todayMoves: days[dayKey(today)] || 0 };
}

export function useStreak() {
  const days = useDays();
  return { ...streakInfo(days), days };
}

// ---- Backup code: move progress to another browser, no account needed ----
// The code is "AIP1." + base64 of the saved progress. Restoring MERGES with what
// is already here (keeps the best of both), so it can never lose progress.
const LISTS = ['labs-passed', 'hunts-done'];
const OBJECTS = ['lab-stars', 'game-stats', 'daily', 'days'];

export function exportProgress() {
  const data = {};
  for (const k of LISTS) data[k] = read(k);
  for (const k of OBJECTS) data[k] = readObj(k);
  try {
    data.name = localStorage.getItem('player-name') || '';
  } catch {
    data.name = '';
  }
  const json = JSON.stringify(data);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return `AIP1.${b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}`;
}

// Numbers keep the larger value; nested objects merge key by key; arrays keep the first saved.
function mergeObj(a = {}, b = {}) {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) {
    if (typeof v === 'number') out[k] = Math.max(typeof a[k] === 'number' ? a[k] : -Infinity, v);
    else if (Array.isArray(v)) out[k] = a[k] ?? v;
    else if (v && typeof v === 'object') out[k] = mergeObj(a[k], v);
    else if (out[k] === undefined) out[k] = v;
  }
  return out;
}

export function importProgress(code) {
  try {
    const raw = code.trim();
    if (!raw.startsWith('AIP1.')) return { ok: false, error: 'This doesn’t look like an AI Patterns backup code.' };
    let b64 = raw.slice(5).replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const data = JSON.parse(decodeURIComponent(escape(atob(b64))));
    if (!data || typeof data !== 'object') throw new Error('bad');
    for (const k of LISTS) {
      if (!Array.isArray(data[k])) continue;
      const merged = [...new Set([...read(k), ...data[k].filter((x) => typeof x === 'string')])];
      localStorage.setItem(k, JSON.stringify(merged));
    }
    for (const k of OBJECTS) {
      if (data[k] && typeof data[k] === 'object') localStorage.setItem(k, JSON.stringify(mergeObj(readObj(k), data[k])));
    }
    if (data.name && !localStorage.getItem('player-name')) localStorage.setItem('player-name', String(data.name).slice(0, 24));
    window.dispatchEvent(new Event(CHANGE));
    return { ok: true };
  } catch {
    return { ok: false, error: 'That code didn’t work. Check that you copied all of it.' };
  }
}
