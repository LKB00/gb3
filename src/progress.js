import { useEffect, useState } from 'react';

// Learning-by-doing progress, kept only in this visitor's browser:
// which Design Labs they passed and which Mistake Hunt screens they finished.
const EVENT = 'progress-change';

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function add(key, id) {
  const list = read(key);
  if (list.includes(id)) return;
  try {
    localStorage.setItem(key, JSON.stringify([...list, id]));
  } catch {
    /* storage blocked — progress just isn't saved */
  }
  window.dispatchEvent(new Event(EVENT));
}

function useList(key) {
  const [list, setList] = useState(() => read(key));
  useEffect(() => {
    const update = () => setList(read(key));
    window.addEventListener(EVENT, update);
    return () => window.removeEventListener(EVENT, update);
  }, [key]);
  return list;
}

export const markPassed = (id) => add('labs-passed', id);
export const usePassed = () => useList('labs-passed');

export const markHuntDone = (id) => add('hunts-done', id);
export const useHuntsDone = () => useList('hunts-done');

// ---- Game layer: stars, best streak, XP and levels ----
function readObj(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}
function writeObj(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked */
  }
  window.dispatchEvent(new Event(EVENT));
}
function useObj(key) {
  const [obj, setObj] = useState(() => readObj(key));
  useEffect(() => {
    const update = () => setObj(readObj(key));
    window.addEventListener(EVENT, update);
    return () => window.removeEventListener(EVENT, update);
  }, [key]);
  return obj;
}

// Stars per challenge: 3 = no mistakes, 2 = one mistake, 1 = more. Only the best is kept.
export function saveStars(id, stars) {
  const all = readObj('lab-stars');
  if ((all[id] || 0) >= stars) return;
  writeObj('lab-stars', { ...all, [id]: stars });
}
export const useStars = () => useObj('lab-stars');

export function saveStreak(n) {
  const s = readObj('game-stats');
  if ((s.bestStreak || 0) >= n) return;
  writeObj('game-stats', { ...s, bestStreak: n });
}
export const useGameStats = () => useObj('game-stats');

export const LEVELS = [
  { xp: 0, name: 'Rookie' },
  { xp: 100, name: 'Prompt tinkerer' },
  { xp: 300, name: 'Pattern spotter' },
  { xp: 600, name: 'Interaction designer' },
  { xp: 1000, name: 'AI UX pro' },
  { xp: 1300, name: 'Legend' },
];
export const XP = { star: 10, hunt: 30, streak: 5, daily: 10, speed: 2 };

// Build mode: best stars per brief, in game-stats.builds = { briefId: 1–3 }.
export function saveBuild(id, stars) {
  const s = readObj('game-stats');
  const builds = s.builds || {};
  if ((builds[id] || 0) >= stars) return;
  writeObj('game-stats', { ...s, builds: { ...builds, [id]: stars } });
}

// Stories: best trust per story, in game-stats.stories = { storyId: 0–100 }.
// (The first story used to save game-stats.storyBest; it still counts.)
export function saveStoryBest(id, trust) {
  const s = readObj('game-stats');
  const stories = { ...(s.stories || {}) };
  if (id === 'tidy' && s.storyBest != null && stories.tidy == null) stories.tidy = s.storyBest;
  if ((stories[id] ?? -1) >= trust) return;
  writeObj('game-stats', { ...s, stories: { ...stories, [id]: trust } });
}
export function storyBests(stats) {
  const out = { ...(stats.stories || {}) };
  if (stats.storyBest != null && out.tidy == null) out.tidy = stats.storyBest;
  return out;
}

// Speed round: best points in 60 seconds.
export function saveSpeed(points) {
  const s = readObj('game-stats');
  if ((s.speedBest || 0) >= points) return;
  writeObj('game-stats', { ...s, speedBest: points });
}

// Daily challenge: { 'YYYY-MM-DD': [true, false, …] }. First result of the day counts.
export function saveDaily(key, results) {
  const all = readObj('daily');
  if (all[key]) return;
  writeObj('daily', { ...all, [key]: results });
}
export const useDaily = () => useObj('daily');

// Days in a row with a Daily played, ending today (or yesterday, so it isn't lost before you play).
export function dailyStreak(daily, today = new Date()) {
  const key = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const d = new Date(today);
  if (!daily[key(d)]) d.setDate(d.getDate() - 1);
  let n = 0;
  while (daily[key(d)]) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

// Story mode: best trust score reached at the end (0–100).
export function saveStory(trust) {
  const s = readObj('game-stats');
  if ((s.storyBest ?? -1) >= trust) return;
  writeObj('game-stats', { ...s, storyBest: trust });
}

export function useXP() {
  const stars = useStars();
  const hunts = useHuntsDone();
  const stats = useGameStats();
  const passed = usePassed();
  const daily = useDaily();
  const dailyRight = Object.values(daily).reduce((n, r) => n + r.filter(Boolean).length, 0);
  // A collected card always counts at least one star (older saves had no stars).
  const starTotal = passed.reduce((n, id) => n + Math.max(stars[id] || 1, 1), 0);
  const xp =
    starTotal * XP.star +
    hunts.length * XP.hunt +
    (stats.bestStreak || 0) * XP.streak +
    dailyRight * XP.daily +
    Object.values(storyBests(stats)).reduce((n, t) => n + Math.round(Math.max(0, t) / 2), 0) +
    Object.values(stats.builds || {}).reduce((n, st) => n + st * XP.star, 0) +
    (stats.speedBest || 0) * XP.speed;
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

export function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function markPlayed() {
  const all = readObj('days');
  const k = dayKey();
  const before = all[k] || 0;
  writeObj('days', { ...all, [k]: before + 1 });
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
    window.dispatchEvent(new Event(EVENT));
    return { ok: true };
  } catch {
    return { ok: false, error: 'That code didn’t work. Check that you copied all of it.' };
  }
}
