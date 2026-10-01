import { useEffect, useState } from 'react';

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

  useEffect(() => {
    const root = document.documentElement;
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
