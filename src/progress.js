import { useEffect, useMemo, useState } from 'react';
import { hunts } from './data/hunts';
import { builds } from './data/builds';
import { stories } from './data/story';
import { categories, patterns } from './data/patterns';
import { subtle } from './data/subtle';
import { achievements } from './data/achievements';
import { weekly } from './data/weekly';
import { dayKey, weekKey } from './lib/dates';
import { CHANGE, readJSON, writeJSON, useStored } from './lib/storage';
import { trackStart } from './game/track';

export { dayKey };

// Everything a visitor earns, saved in their browser (see lib/storage.js).
// Keys in localStorage:
//   labs-passed  ['citations', …]        cards collected (Fix it)
//   hunts-done   ['chat', …]             Spot the flaw screens finished
//   lab-stars    { citations: 3, … }     best stars per card
//   game-stats   { bestStreak, speedBest, powerBest, bestDayStreak, builds: {id: stars}, stories: {id: trust}, boss: {group: right answers} }
//   misses       ['c:citations', 'h:practice-run', …]   This or That rounds you got wrong (the "Your misses" deck)
//   achievements { 'perfect-daily': 'YYYY-MM-DD', … }   achievements earned, with the day
//   daily        { 'YYYY-MM-DD': [true, false, …] }   Daily challenge results
//   days         { 'YYYY-MM-DD': moves }              day streak and daily goal
//   first-steps  { on, hidden, me }                   Home's "first 5 minutes" list
//   recap-seen   { week: '2026-W43' }                 Monday recap dismissed for that week
//   run:<key>    { v: run, at: ms }                   games in progress (see "Games in progress")
//   daily-goal   { n: 5 | 10 | 20 }                   chosen daily goal (Me page), default 10
// Adding a new game score: add a saveBest('myBest') line and a line in xpParts().

// Everything read from storage is cleaned first: wrong types, NaN and absurd numbers
// are dropped or clamped, so broken saved data can't crash a page or inflate XP.
const num = (x, min, max) => {
  const n = Number(x);
  return typeof x !== 'boolean' && x !== null && x !== '' && Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : 0;
};
// Keep only keys that pass keyOk, with values cleaned by f (null = drop).
const cleanMap = (o, f, keyOk = () => true) => Object.fromEntries(Object.entries(o).filter(([k]) => keyOk(k)).map(([k, v]) => [k, f(v)]).filter(([, v]) => v !== null));
// Only ids that exist (a hand-edited or old save can't add cards that aren't there).
const KNOWN = {
  'labs-passed': new Set(patterns.map((p) => p.id)),
  'hunts-done': new Set(hunts.map((h) => h.id)),
  builds: new Set(builds.map((b) => b.id)),
  stories: new Set(stories.map((s) => s.id)),
  // Round keys from game/decks.js: 'c:' + pattern id (classic) or 'h:' + hard pair id.
  misses: new Set([...patterns.map((p) => `c:${p.id}`), ...subtle.map((x) => `h:${x.id}`)]),
  boss: new Set(categories.map((c) => c.id)),
  achievements: new Set(achievements.map((a) => a.id)),
};
const isDay = (k) => /^\d{4}-\d{2}-\d{2}$/.test(k);
const isWeek = (k) => /^\d{4}-W\d{2}$/.test(k);
const plainObj = (x) => (x && typeof x === 'object' && !Array.isArray(x) ? x : {});
const cleanList = (l, key) => [...new Set(l.filter((x) => typeof x === 'string' && (!KNOWN[key] || KNOWN[key].has(x))))];
const cleanStars = (o) => cleanMap(o, (v) => Math.round(num(v, 1, 3)) || null, (k) => KNOWN['labs-passed'].has(k));
// Daily: 5 answers a day, only for days from Daily #1 (1 Oct 2026) up to tomorrow (time zones ahead).
const DAILY_LEN = 5;
const FIRST_DAILY = '2026-10-01';
const dailyDayOk = (k) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isDay(k) && k >= FIRST_DAILY && k <= dayKey(tomorrow);
};
const cleanDaily = (o) => cleanMap(o, (v) => (Array.isArray(v) ? v.slice(0, DAILY_LEN).map(Boolean) : null), dailyDayOk);
const cleanAchievements = (o) => cleanMap(o, (v) => (typeof v === 'string' && isDay(v) ? v : null), (k) => KNOWN.achievements.has(k));
const cleanDays = (o) => cleanMap(o, (v) => Math.round(num(v, 0, 100000)), isDay);
function cleanStats(s) {
  const out = {
    bestStreak: Math.round(num(s.bestStreak, 0, 999)),
    speedBest: Math.round(num(s.speedBest, 0, 999)),
    powerBest: Math.round(num(s.powerBest, 0, 16)),
    bestDayStreak: Math.round(num(s.bestDayStreak, 0, 100000)),
    golden: Math.round(num(s.golden, 0, 100000)),
    // Per ISO week ('2026-W43'): best Speed score, and right answers in that week's theme group.
    speedWeeks: cleanMap(plainObj(s.speedWeeks), (v) => Math.round(num(v, 0, 999)), isWeek),
    themeWeeks: cleanMap(plainObj(s.themeWeeks), (v) => Math.round(num(v, 0, 100000)), isWeek),
    builds: cleanMap(s.builds && typeof s.builds === 'object' && !Array.isArray(s.builds) ? s.builds : {}, (v) => Math.round(num(v, 1, 3)) || null, (k) => KNOWN.builds.has(k)),
    stories: cleanMap(s.stories && typeof s.stories === 'object' && !Array.isArray(s.stories) ? s.stories : {}, (v) => Math.round(num(v, 0, 100)), (k) => KNOWN.stories.has(k)),
    boss: cleanMap(s.boss && typeof s.boss === 'object' && !Array.isArray(s.boss) ? s.boss : {}, (v) => Math.round(num(v, 0, BOSS_ROUNDS)), (k) => KNOWN.boss.has(k)),
  };
  // Older saves kept the first story's best here.
  if (s.storyBest != null && Number.isFinite(Number(s.storyBest))) out.storyBest = Math.round(num(s.storyBest, 0, 100));
  return out;
}

const read = (key) => cleanList(readJSON(key, []), key);
const readObj = (key) => readJSON(key, {});
const readStats = () => cleanStats(readObj('game-stats'));
const useCleaned = (key, clean) => {
  const raw = useStored(key, {});
  return useMemo(() => clean(raw), [raw, clean]);
};
const useList = (key) => {
  const raw = useStored(key, []);
  return useMemo(() => cleanList(raw, key), [raw, key]);
};

function add(key, id) {
  const list = read(key);
  if (list.includes(id)) return;
  writeJSON(key, [...list, id]);
}

// Keep the best number only: game-stats[field] = max(old, value).
function saveBest(field, value) {
  const s = readStats();
  if ((s[field] || 0) >= value) return;
  writeJSON('game-stats', { ...s, [field]: value });
}
// Same, per item: game-stats[field][id] = max(old, value).
function saveBestIn(field, id, value, current = (s) => s[field] || {}) {
  const s = readStats();
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
  const all = cleanStars(readObj('lab-stars'));
  if ((all[id] || 0) >= stars) return;
  writeJSON('lab-stars', { ...all, [id]: stars });
};
export const useStars = () => useCleaned('lab-stars', cleanStars);

export const saveStreak = (n) => saveBest('bestStreak', n);
export const useGameStats = () => useCleaned('game-stats', cleanStats);

export const LEVELS = [
  { xp: 0, name: 'Rookie' },
  { xp: 100, name: 'Prompt tinkerer' },
  { xp: 300, name: 'Pattern spotter' },
  { xp: 600, name: 'Interaction designer' },
  { xp: 1000, name: 'AI UX pro' },
  { xp: 1300, name: 'Legend' },
];
export const XP = { star: 10, hunt: 30, streak: 5, daily: 10, speed: 2, power: 2, boss: 5, golden: 10 };

// ---- Golden rounds (a rare This or That round worth XP.golden when you get it right) ----
export function addGolden() {
  const s = readStats();
  writeJSON('game-stats', { ...s, golden: (s.golden || 0) + 1 });
}
// ---- Weekly: best Speed score per week ("beat your last week") and theme-week answers ----
export const saveSpeedWeek = (week, points) => saveBestIn('speedWeeks', week, points);
export function addThemeAnswer(week) {
  const s = readStats();
  const n = (s.themeWeeks[week] || 0) + 1;
  writeJSON('game-stats', { ...s, themeWeeks: { ...s.themeWeeks, [week]: n } });
  return n;
}

// ---- Your misses: This or That rounds you got wrong, until you get them right ----
export const useMisses = () => useList('misses');
export const readMisses = () => read('misses');
export const addMiss = (key) => add('misses', key);
export function clearMiss(key) {
  const list = read('misses');
  if (!list.includes(key)) return;
  writeJSON('misses', list.filter((k) => k !== key));
  if (list.length === 1) window.dispatchEvent(new CustomEvent('gb3-event', { detail: { type: 'misses-cleared' } }));
}

// ---- Boss rounds: one hard final per group; you beat it with BOSS_WIN of BOSS_ROUNDS right ----
export const BOSS_ROUNDS = 8;
export const BOSS_WIN = 7;
export const saveBoss = (group, right) => saveBestIn('boss', group, right);
export const saveDayStreak = (n) => saveBest('bestDayStreak', n);

// ---- Achievements: { id: day earned }. The list and the rules live in data/achievements.js ----
export const useAchievements = () => useCleaned('achievements', cleanAchievements);
export const readAchievements = () => cleanAchievements(readObj('achievements'));
export function unlockAchievement(id) {
  const all = readAchievements();
  if (all[id] || !KNOWN.achievements.has(id)) return false;
  writeJSON('achievements', { ...all, [id]: dayKey() });
  return true;
}
// Everything the achievement rules can look at, read fresh from storage.
export function readProgress() {
  return {
    passed: read('labs-passed'),
    hunts: read('hunts-done'),
    stars: cleanStars(readObj('lab-stars')),
    stats: readStats(),
    daily: cleanDaily(readObj('daily')),
    days: cleanDays(readObj('days')),
  };
}

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
  const all = cleanDaily(readObj('daily'));
  if (all[key]) return;
  writeJSON('daily', { ...all, [key]: results });
  writeJSON('daily-run', null);
}

// A Daily in progress: today's answers so far, so a refresh can't reset the one try.
// Saved in localStorage as { day: 'YYYY-MM-DD', r: [true, false, …], at: time saved }; anything else reads as "not started".
// (It only counts for its own day, so it needs no expiry.)
const cleanDailyRun = (o) => (o && isDay(o.day) && Array.isArray(o.r) ? { day: o.day, r: o.r.slice(0, 5).map(Boolean), at: Math.round(num(o.at, 0, 1e14)) } : null);
export function readDailyRun(day) {
  const run = cleanDailyRun(readJSON('daily-run', null));
  return run && run.day === day ? run.r : [];
}
export function saveDailyRun(day, r) {
  writeJSON('daily-run', { day, r, at: Date.now() });
}
export const useDaily = () => useCleaned('daily', cleanDaily);

// ---- Games in progress ("runs") ----
// A run lives in localStorage as { v: the run, at: time saved }, so a link, Back, a refresh
// or closing the app resumes the game instead of wiping it. Runs older than 3 days are
// thrown away when read. Keys: 'run:story:<id>', 'run:build:<id>', 'run:power',
// 'run:hunt:<id>', 'run:spot'. (Older versions kept runs in sessionStorage, unwrapped:
// those are moved over the first time they are read.)
// Every run is cleaned when read: anything with the wrong shape reads as null = start fresh.
const RUN = 'run:';
const RUN_MAX_AGE = 3 * 86400000;
const isPlain = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
// The saved wrapper, or null (and removed) if it is broken or too old.
function readWrapped(key) {
  let text = null;
  try {
    text = localStorage.getItem(RUN + key);
  } catch {
    return null;
  }
  if (text == null) return null;
  let w = null;
  try {
    w = JSON.parse(text);
  } catch {
    /* broken: removed below */
  }
  const age = isPlain(w) && typeof w.at === 'number' && Number.isFinite(w.at) ? Date.now() - w.at : NaN;
  if (isPlain(w) && isPlain(w.v) && age < RUN_MAX_AGE && age > -86400000) return w;
  clearRun(key);
  return null;
}
// An old sessionStorage run: moved to localStorage once, so nobody loses a game on update.
function migrateRun(key) {
  try {
    const text = sessionStorage.getItem(RUN + key);
    if (text == null) return null;
    sessionStorage.removeItem(RUN + key);
    const v = JSON.parse(text);
    if (!isPlain(v)) return null;
    saveRun(key, v);
    return v;
  } catch {
    return null;
  }
}
export function readRun(key) {
  const w = readWrapped(key);
  return w ? w.v : migrateRun(key);
}
export function saveRun(key, value) {
  try {
    localStorage.setItem(RUN + key, JSON.stringify({ v: value, at: Date.now() }));
  } catch {
    /* storage blocked: the run lives in React state only */
  }
}
export function clearRun(key) {
  try {
    localStorage.removeItem(RUN + key);
  } catch {
    /* nothing to clear */
  }
  try {
    sessionStorage.removeItem(RUN + key);
  } catch {
    /* nothing to clear */
  }
}
const isInt = (x, min, max) => Number.isInteger(x) && x >= min && x <= max;
const uniq = (l) => new Set(l).size === l.length;

// Story: { sceneId, trust, picked, history: [{ scene, choice, delta }] }. Needs the story to check scene ids.
export function readStoryRun(story) {
  const r = readRun('story:' + story.id);
  const scenes = story.scenes;
  const has = (id) => typeof id === 'string' && Object.prototype.hasOwnProperty.call(scenes, id);
  if (!r || !has(r.sceneId) || !isInt(r.trust, 0, 100) || !Array.isArray(r.history) || r.history.length > 50) return null;
  const history = r.history.filter((h) => h && has(h.scene) && isInt(h.choice, 0, scenes[h.scene].choices.length - 1) && isInt(h.delta, -100, 100));
  if (history.length !== r.history.length) return null;
  const picked = r.picked === null ? null : isInt(r.picked, 0, scenes[r.sceneId].choices.length - 1) ? r.picked : undefined;
  if (picked === undefined) return null;
  // A pick is always the last step in the history.
  const last = history[history.length - 1];
  if (picked !== null && !(last && last.scene === r.sceneId && last.choice === picked)) return null;
  return { sceneId: r.sceneId, trust: r.trust, picked, history: history.map(({ scene, choice, delta }) => ({ scene, choice, delta })) };
}

// Build: { order: [pieceId], placed: [pieceId], checked }. Needs the brief to check piece ids.
export function readBuildRun(build) {
  const r = readRun('build:' + build.id);
  const ids = build.pieces.map((p) => p.id);
  if (!r || !Array.isArray(r.placed) || !Array.isArray(r.order)) return null;
  const placed = r.placed.filter((id) => ids.includes(id));
  if (placed.length !== r.placed.length || !uniq(placed)) return null;
  const order = r.order.length === ids.length && uniq(r.order) && r.order.every((id) => ids.includes(id)) ? r.order : null;
  return { order, placed, checked: r.checked === true && placed.length > 0 };
}

// How much power?: { ids: [taskId x rounds], i, pick, log: [0..2] }. Points are worked out from the log.
export function readPowerRun(tasks, rounds) {
  const r = readRun('power');
  if (!r || !Array.isArray(r.ids) || r.ids.length !== rounds || !uniq(r.ids) || !Array.isArray(r.log)) return null;
  const hand = r.ids.map((id) => tasks.find((t) => t.id === id));
  if (hand.some((t) => !t) || !isInt(r.i, 0, rounds - 1)) return null;
  const pick = r.pick === null ? null : isInt(r.pick, 1, 5) ? r.pick : undefined;
  if (pick === undefined || r.log.length !== r.i + (pick === null ? 0 : 1) || !r.log.every((x) => isInt(x, 0, 2))) return null;
  return { hand, i: r.i, pick, log: r.log };
}

// Spot the flaw, one screen: { found: [block index], revealed }. Only real mistakes count.
export function readHuntRun(scenario) {
  const r = readRun('hunt:' + scenario.id);
  if (!r || !Array.isArray(r.found)) return null;
  const found = r.found.filter((i) => isInt(i, 0, scenario.blocks.length - 1) && scenario.blocks[i].mistake);
  if (found.length !== r.found.length || !uniq(found)) return null;
  return { found, revealed: r.revealed === true };
}

// The most recent unfinished game, for Home's "Continue" row: { key, to, label, open? } or null.
// Only real progress counts (a story with a choice made, a flaw found, a piece placed, a round answered);
// finished games are cleared by their pages, and done-but-not-cleared ones are skipped here.
// open() (if there is one) runs on click, before going to `to`.
const POWER_ROUNDS = 8; // same as pages/Power.jsx
export function lastRun() {
  const keys = new Set();
  for (const name of ['sessionStorage', 'localStorage']) {
    try {
      const s = window[name];
      for (let i = 0; i < s.length; i++) {
        const k = s.key(i);
        if (k && k.startsWith(RUN)) keys.add(k.slice(RUN.length));
      }
    } catch {
      /* storage blocked: nothing to continue */
    }
  }
  const found = [];
  const add = (key, item) => found.push({ key, at: readWrapped(key)?.at ?? 0, ...item });
  for (const key of keys) {
    const cut = key.indexOf(':');
    const kind = cut < 0 ? key : key.slice(0, cut);
    const id = key.slice(cut + 1);
    if (kind === 'story') {
      const s = stories.find((x) => x.id === id);
      const r = s && readStoryRun(s);
      if (r && r.history.length) add(key, { to: `/play/story/${s.id}`, label: `${s.title} · scene ${r.history.length + (r.picked === null ? 1 : 0)}` });
    } else if (kind === 'build') {
      const b = builds.find((x) => x.id === id);
      const r = b && readBuildRun(b);
      if (r && r.placed.length && !r.checked) add(key, { to: `/play/build?brief=${encodeURIComponent(b.id)}`, label: `Build mode · ${b.title}` });
    } else if (kind === 'hunt') {
      const h = hunts.find((x) => x.id === id);
      const r = h && readHuntRun(h);
      const mistakes = h ? h.blocks.filter((b) => b.mistake).length : 0;
      if (r && r.found.length && !r.revealed && r.found.length < mistakes) {
        add(key, { to: '/play/spot-the-flaw', label: `Spot the flaw · ${h.title}`, open: () => saveRun('spot', { screen: h.id }) });
      }
    } else if (key === 'power') {
      // A light check: the page itself checks the full run when it opens.
      const r = readRun('power');
      if (r && Array.isArray(r.ids) && r.ids.length === POWER_ROUNDS && isInt(r.i, 0, POWER_ROUNDS - 1) && Array.isArray(r.log) && r.log.length > 0) {
        add(key, { to: '/play/power', label: `How much power? · round ${r.i + 1} of ${POWER_ROUNDS}` });
      }
    }
  }
  // Today's Daily, started but not finished (it lives in 'daily-run', see above).
  const today = dayKey();
  const d = cleanDailyRun(readJSON('daily-run', null));
  if (d && d.day === today && d.r.length > 0 && d.r.length < DAILY_LEN && !cleanDaily(readObj('daily'))[today]) {
    found.push({ key: 'daily', at: d.at, to: '/play/daily', label: `Today’s Daily · round ${d.r.length + 1} of ${DAILY_LEN}` });
  }
  found.sort((a, b) => b.at - a.at);
  return found[0] || null;
}

// ---- First 5 minutes: Home's 3-step list for brand-new players ----
// 'first-steps' = { on, hidden, me }: on = shown to this player (set once, when Home opens
// for someone with nothing played yet), hidden = they tapped "Hide", me = the Me page was opened.
const cleanFirstSteps = (o) => ({ on: o.on === true, hidden: o.hidden === true, me: o.me === true });
const readFirstSteps = () => cleanFirstSteps(readObj('first-steps'));
const setFirstSteps = (patch) => {
  const s = readFirstSteps();
  if (Object.keys(patch).every((k) => s[k] === patch[k])) return;
  writeJSON('first-steps', { ...s, ...patch });
};
export const useFirstSteps = () => useCleaned('first-steps', cleanFirstSteps);
export const startFirstSteps = () => setFirstSteps({ on: true });
export const hideFirstSteps = () => setFirstSteps({ hidden: true });
export const markMeSeen = () => setFirstSteps({ me: true });

// ---- Monday recap: last week (Mon-Sun) in numbers, shown on Home once per week ----
// 'recap-seen' = { week: '2026-W43' }: the week whose recap was dismissed ("Got it").
const cleanRecapSeen = (o) => (typeof o.week === 'string' && /^\d{4}-W\d{2}$/.test(o.week) ? o.week : '');
export const useRecapSeen = () => useCleaned('recap-seen', cleanRecapSeen);
export const saveRecapSeen = (week) => writeJSON('recap-seen', { week });
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// Last week's numbers, or null if nothing was played. Takes cleaned days, daily and achievements maps.
export function weekRecap({ days, daily, achievements: earned }, today = new Date()) {
  const mon = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  mon.setDate(mon.getDate() - ((mon.getDay() + 6) % 7) - 7); // last week's Monday
  const keys = [];
  let best = null;
  for (let i = 0; i < 7; i++) {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    const k = dayKey(d);
    keys.push(k);
    const n = days[k] || 0;
    if (n > 0 && (!best || n > best.n)) best = { day: WEEKDAYS[d.getDay()], n };
  }
  const answers = keys.reduce((n, k) => n + (days[k] || 0), 0);
  if (!answers) return null;
  const played = keys.filter((k) => daily[k]);
  return {
    week: weekKey(today),
    answers,
    daysPlayed: keys.filter((k) => (days[k] || 0) > 0).length,
    dailies: played.length,
    perfect: played.filter((k) => daily[k].length === DAILY_LEN && daily[k].every(Boolean)).length,
    achievements: Object.keys(earned).filter((id) => keys.includes(earned[id])),
    best,
  };
}

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
      boss: sum(stats.boss || {}, (n) => n * XP.boss),
      golden: (stats.golden || 0) * XP.golden,
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
export const DAILY_GOAL = 10; // the default goal

// The daily goal is a setting (Me page): Easy 5, Normal 10 or Serious 20 answers.
// Saved as 'daily-goal' = { n }. Anything else reads as the default.
export const GOAL_OPTIONS = [5, 10, 20];
const cleanGoal = (o) => (GOAL_OPTIONS.includes(o?.n) ? o.n : DAILY_GOAL);
export const readDailyGoal = () => cleanGoal(readObj('daily-goal'));
export const useDailyGoal = () => cleanGoal(useStored('daily-goal', {}));
export const saveDailyGoal = (n) => writeJSON('daily-goal', { n: GOAL_OPTIONS.includes(n) ? n : DAILY_GOAL });

export function markPlayed() {
  const all = cleanDays(readObj('days'));
  const k = dayKey();
  const before = all[k] || 0;
  writeJSON('days', { ...all, [k]: before + 1 });
  trackStart(); // every game calls this on each answer, so the first one marks "Game started"
  window.dispatchEvent(new CustomEvent('gb3-event', { detail: { type: 'answer', hour: new Date().getHours() } }));
  if (before + 1 === readDailyGoal()) window.dispatchEvent(new Event('goal-reached'));
}
export const useDays = () => useCleaned('days', cleanDays);

// Streak with a gentle rule: one missed day per 7 days is covered by a "freeze",
// so one busy day doesn't wipe out weeks of play. Today not played yet doesn't
// break the streak either (you still have time).
export function streakInfo(days, today = new Date()) {
  const d = new Date(today);
  const played = (x) => (days[dayKey(x)] || 0) > 0;
  const frozen = [];
  let count = 0;
  let lastFreeze = -Infinity; // index (in counted days) of the last freeze used
  let newestFreeze = null; // played days between today and the most recent freeze
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
      if (newestFreeze === null) newestFreeze = count;
      lastFreeze = count;
      d.setDate(d.getDate() - 1);
      continue;
    }
    break;
  }
  // Ready again once 7 days have been played since the most recent skip day.
  const freezeReady = newestFreeze === null || newestFreeze >= 7;
  return { streak: count, frozen, freezeReady, todayMoves: days[dayKey(today)] || 0 };
}

// Today's date key, which changes at local midnight (and is checked again when the tab comes back),
// so the Today card and the streak flame don't show yesterday after midnight.
function useTodayKey() {
  const [key, setKey] = useState(dayKey);
  useEffect(() => {
    const check = () => setKey(dayKey());
    const next = new Date();
    next.setHours(24, 0, 1, 0);
    const t = setTimeout(check, next - Date.now());
    const onVisible = () => document.visibilityState === 'visible' && check();
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', check);
    return () => {
      clearTimeout(t);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', check);
    };
  }, [key]);
  return key;
}

export function useStreak() {
  const days = useDays();
  const today = useTodayKey();
  return { ...streakInfo(days), days, today };
}

// ---- Backup code: move progress to another browser, no account needed ----
// The code is "AIP1." + base64 of the saved progress. Restoring MERGES with what
// is already here (keeps the best of both), so it can never lose progress.
const LISTS = ['labs-passed', 'hunts-done', 'misses'];
const OBJECTS = ['lab-stars', 'game-stats', 'daily', 'days', 'achievements'];

export function exportProgress() {
  const data = {};
  for (const k of LISTS) data[k] = read(k);
  data['lab-stars'] = cleanStars(readObj('lab-stars'));
  data['game-stats'] = readStats();
  data.daily = cleanDaily(readObj('daily'));
  data.days = cleanDays(readObj('days'));
  data.achievements = readAchievements();
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
    if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
    if (typeof v === 'number') out[k] = Math.max(typeof a[k] === 'number' ? a[k] : -Infinity, v);
    else if (Array.isArray(v)) out[k] = a[k] ?? v;
    else if (v && typeof v === 'object') out[k] = mergeObj(a[k], v);
    else if (out[k] === undefined) out[k] = v;
  }
  return out;
}

// Same rule as names in challenge links: no control characters, max 24.
// eslint-disable-next-line no-control-regex
const cleanName = (s) => (typeof s === 'string' ? s.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 24) : '');

function storageWorks() {
  try {
    localStorage.setItem('aip-test', '1');
    localStorage.removeItem('aip-test');
    return true;
  } catch {
    return false;
  }
}

export function importProgress(code) {
  try {
    const text = String(code).trim();
    if (text.length > 200000) return { ok: false, error: 'That’s too long to be a backup code. Copy it again and paste it here.' };
    // The code may come wrapped in quotes or with a note around it: take the code itself.
    const raw = text.match(/AIP1\.[A-Za-z0-9_-]+/)?.[0];
    if (!raw) return { ok: false, error: 'That doesn’t look like a backup code. Ours start with AIP1.' };
    let b64 = raw.slice(5).replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const data = JSON.parse(decodeURIComponent(escape(atob(b64))));
    const plain = (x) => x && typeof x === 'object' && !Array.isArray(x);
    if (!plain(data)) throw new Error('bad');
    if (!LISTS.some((k) => Array.isArray(data[k])) && !OBJECTS.some((k) => plain(data[k]))) {
      return { ok: false, error: 'That code is empty. Make a fresh one on your other device.' };
    }
    if (!storageWorks()) {
      return { ok: false, error: 'Your code looks fine, but this browser isn’t letting us save anything here. Allow site data (or leave private mode) and try again.' };
    }
    // Clean what comes in, merge it with what is here (the best of both), clean again, save.
    for (const k of LISTS) {
      if (!Array.isArray(data[k])) continue;
      localStorage.setItem(k, JSON.stringify(cleanList([...read(k), ...data[k]], k)));
    }
    const CLEAN = { 'lab-stars': cleanStars, 'game-stats': cleanStats, daily: cleanDaily, days: cleanDays, achievements: cleanAchievements };
    for (const k of OBJECTS) {
      if (!plain(data[k])) continue;
      const here = CLEAN[k](readObj(k));
      localStorage.setItem(k, JSON.stringify(CLEAN[k](mergeObj(here, CLEAN[k](data[k])))));
    }
    const name = cleanName(data.name);
    if (name && !localStorage.getItem('player-name')) localStorage.setItem('player-name', name);
    window.dispatchEvent(new Event(CHANGE));
    return { ok: true };
  } catch {
    return { ok: false, error: 'That code didn’t work. It may be cut off. Copy all of it and try again.' };
  }
}
