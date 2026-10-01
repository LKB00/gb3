import { useEffect, useState } from 'react';

// Tiny localStorage layer. Everything a visitor earns is saved in their own
// browser only. Every write fires one event, so every hook re-reads and the
// whole page updates at once (XP pill, streak, tiles…).
export const CHANGE = 'progress-change';

export function readJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
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
