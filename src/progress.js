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
export const XP = { star: 10, hunt: 30, streak: 5, daily: 10 };

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
    Math.round(Math.max(0, stats.storyBest || 0) / 2);
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
