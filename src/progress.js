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
export const XP = { star: 10, hunt: 30, streak: 5 };

export function useXP() {
  const stars = useStars();
  const hunts = useHuntsDone();
  const stats = useGameStats();
  const passed = usePassed();
  // A collected card always counts at least one star (older saves had no stars).
  const starTotal = passed.reduce((n, id) => n + Math.max(stars[id] || 1, 1), 0);
  const xp = starTotal * XP.star + hunts.length * XP.hunt + (stats.bestStreak || 0) * XP.streak;
  let i = LEVELS.length - 1;
  while (LEVELS[i].xp > xp) i--;
  const level = LEVELS[i];
  const nextLevel = LEVELS[i + 1];
  return { xp, starTotal, level, levelNum: i + 1, nextLevel, toNext: nextLevel ? nextLevel.xp - xp : 0 };
}
