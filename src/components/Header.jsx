import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

function readTheme() {
  try {
    return localStorage.getItem('theme');
  } catch {
    return null;
  }
}

export default function Header() {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme) root.dataset.theme = theme;
    else delete root.dataset.theme;
    try {
      if (theme) localStorage.setItem('theme', theme);
    } catch {
      /* storage blocked — theme still works for this visit */
    }
  }, [theme]);

  const isDark = theme ? theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden>
            <svg viewBox="0 0 32 32" width="18" height="18"><path d="M16 3c1 8 5 12 13 13-8 1-12 5-13 13-1-8-5-12-13-13 8-1 12-5 13-13z" fill="currentColor" /></svg>
          </span>
          <span className="logo-text">AI Patterns</span>
        </Link>
        <nav className="nav" aria-label="Main">
          <NavLink to="/patterns">Patterns</NavLink>
          <NavLink to="/practice">Practice</NavLink>
          <NavLink to="/learn">Learn</NavLink>
          <button className="icon-btn" onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
            {isDark ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>
    </header>
  );
}
