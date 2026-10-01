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
            <svg viewBox="0 0 32 32" width="22" height="22"><path d="M9 22l7-12 7 12" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          AI Patterns
        </Link>
        <nav className="nav" aria-label="Main">
          <NavLink to="/patterns">Patterns</NavLink>
          <NavLink to="/learn">Learn</NavLink>
          <button className="icon-btn" onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
            {isDark ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>
    </header>
  );
}
