import { useEffect, useRef, useState } from 'react';

// Light / dark choice. "null" means follow the system setting.
function readTheme() {
  try {
    return localStorage.getItem('theme');
  } catch {
    return null;
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(readTheme);

  const first = useRef(true);
  useEffect(() => {
    const root = document.documentElement;
    // Cross-fade the colours when the person switches (not on first load).
    if (!first.current) {
      root.classList.add('theme-fade');
      setTimeout(() => root.classList.remove('theme-fade'), 400);
    }
    first.current = false;
    if (theme) root.dataset.theme = theme;
    else delete root.dataset.theme;
    try {
      if (theme) localStorage.setItem('theme', theme);
    } catch {
      /* storage blocked — the choice still works for this visit */
    }
  }, [theme]);

  const isDark = theme ? theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  return [isDark, () => setTheme(isDark ? 'light' : 'dark')];
}
