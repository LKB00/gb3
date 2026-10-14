import { useEffect, useState } from 'react';

// Tiny localStorage layer. Everything a visitor earns is saved in their own
// browser only. Every write fires one event, so every hook re-reads and the
// whole page updates at once (XP pill, streak, tiles…).
// Changes made in another open tab arrive as the browser's 'storage' event.
export const CHANGE = 'progress-change';

// When storage is blocked or full, writes are kept here for this visit only,
// so XP and streaks still move while the page is open.
const memory = new Map();

// Saved data can be broken (edited by hand, an old version, another site on the same
// address). If it isn't the same kind of thing as `fallback` (a list or a plain object),
// the fallback is used, so one bad value can never crash the site.
export function readJSON(key, fallback) {
  try {
    let text;
    if (memory.has(key)) text = memory.get(key);
    else {
      try {
        text = localStorage.getItem(key);
      } catch {
        text = null;
      }
    }
    const v = JSON.parse(text);
    if (Array.isArray(fallback)) return Array.isArray(v) ? v : fallback;
    return v && typeof v === 'object' && !Array.isArray(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  const text = JSON.stringify(value);
  try {
    localStorage.setItem(key, text);
    memory.delete(key);
  } catch {
    /* storage blocked: kept for this visit only */
    memory.set(key, text);
  }
  window.dispatchEvent(new Event(CHANGE));
}

// React hook: the saved value, kept up to date when anything is saved (here or in another tab).
export function useStored(key, fallback) {
  const [value, setValue] = useState(() => readJSON(key, fallback));
  useEffect(() => {
    const update = () => setValue(readJSON(key, fallback));
    const onStorage = (e) => {
      if (e.key === key || e.key === null) update();
    };
    window.addEventListener(CHANGE, update);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(CHANGE, update);
      window.removeEventListener('storage', onStorage);
    };
    // fallback is a fresh [] or {} each render; only the key matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return value;
}
