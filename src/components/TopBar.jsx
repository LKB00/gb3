import { Link, NavLink, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { patterns } from '../data/patterns';
import { hunts } from '../data/hunts';
import { useHuntsDone, usePassed } from '../progress';
import { useTheme } from '../theme';

const LIBRARY = ['/patterns', '/teardowns', '/anti-patterns', '/principles', '/glossary'];

// Three places only: Learn (guided), Practice (do), Library (look things up).
export default function TopBar() {
  const { pathname } = useLocation();
  const passed = usePassed();
  const huntsDone = useHuntsDone();
  const [isDark, toggleTheme] = useTheme();
  const pct = Math.round(((passed.length + huntsDone.length) / (patterns.length + hunts.length)) * 100);
  const inLibrary = LIBRARY.some((p) => pathname.startsWith(p));
  const r = 7;
  const c = 2 * Math.PI * r;

  return (
    <header className="topnav">
      <div className="topnav-inner">
        <Link to="/" className="logo" aria-label="AI Patterns, home">
          <span className="logo-mark" aria-hidden />
          <span className="logo-text">AI Patterns</span>
        </Link>
        <nav className="topnav-links" aria-label="Main">
          <NavLink to="/learn">Learn</NavLink>
          <NavLink to="/practice">Practice</NavLink>
          <NavLink to="/patterns" className={() => (inLibrary ? 'active' : '')}>Library</NavLink>
        </nav>
        <div className="topnav-right">
          <Link to="/practice" className="progress-pill" aria-label={`Your progress: ${pct}%. ${passed.length} labs passed, ${huntsDone.length} hunts done.`}>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
              <circle cx="9" cy="9" r={r} className="ring-bg" />
              <circle cx="9" cy="9" r={r} className="ring-fg" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
            </svg>
            {pct}%
          </Link>
          <button className="icon-btn" onClick={toggleTheme} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
            {isDark ? <Sun size={16} strokeWidth={1.75} aria-hidden /> : <Moon size={16} strokeWidth={1.75} aria-hidden />}
          </button>
        </div>
      </div>
    </header>
  );
}
