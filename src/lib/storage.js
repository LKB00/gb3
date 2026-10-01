import { useEffect, useState } from 'react';

// Tiny localStorage layer. Everything a visitor earns is saved in their own
// browser only. Every write fires one event, so every hook re-reads and the
// whole page updates at once (XP pill, streak, tiles…).
export const CHANGE = 'progress-change';

// Saved data can be broken (edited by hand, an old version, another site on the same
// address). If it isn't the same kind of thing as `fallback` (a list or a plain object),
// the fallback is used, so one bad value can never crash the site.
export function readJSON(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    if (Array.isArray(fallback)) return Array.isArray(v) ? v : fallback;
    return v && typeof v === 'object' && !Array.isArray(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked: progress just isn't saved */
  }
  window.dispatchEvent(new Event(CHANGE));
}

// React hook: the saved value, kept up to date when anything is saved.
export function useStored(key, fallback) {
  const [value, setValue] = useState(() => readJSON(key, fallback));
  useEffect(() => {
    const update = () => setValue(readJSON(key, fallback));
    window.addEventListener(CHANGE, update);
    return () => window.removeEventListener(CHANGE, update);
    // fallback is a fresh [] or {} each render; only the key matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return value;
}
