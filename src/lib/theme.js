import { useEffect, useState } from 'react';

// Light / dark choice. "null" means follow the system setting.
// One shared value for the whole page, so the top-bar button and the Me switch always agree.
const EVENT = 'theme-change';
let memory = null; // this visit's choice, in case storage is blocked

function readTheme() {
  if (memory) return memory;
  try {
    const t = localStorage.getItem('theme');
    return t === 'light' || t === 'dark' ? t : null;
  } catch {
    return null;
  }
}

let current = readTheme();

function apply(theme, fade) {
  const root = document.documentElement;
  // Cross-fade the colours when the person switches (not on first load).
  if (fade) {
    root.classList.add('theme-fade');
    setTimeout(() => root.classList.remove('theme-fade'), 400);
  }
  if (theme) root.dataset.theme = theme;
  else delete root.dataset.theme;
}

function setTheme(theme) {
  current = theme;
  memory = theme;
  try {
    localStorage.setItem('theme', theme);
  } catch {
    /* storage blocked — the choice still works for this visit */
  }
  apply(theme, true);
  window.dispatchEvent(new Event(EVENT));
}

export function useTheme() {
  const [theme, setLocal] = useState(current);

  useEffect(() => {
    apply(current, false);
    setLocal(current);
    const update = () => setLocal(current);
    // Another tab switched the theme.
    const onStorage = (e) => {
      if (e.key !== 'theme' && e.key !== null) return;
      memory = null;
      const next = readTheme();
      if (next === current) return;
      current = next;
      apply(current, true);
      window.dispatchEvent(new Event(EVENT));
    };
    window.addEventListener(EVENT, update);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(EVENT, update);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const isDark = theme ? theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  return [isDark, () => setTheme(isDark ? 'light' : 'dark')];
}
