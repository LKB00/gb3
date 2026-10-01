import { Link, NavLink, useLocation } from 'react-router-dom';
import { Moon, Sun, Zap } from 'lucide-react';
import { useXP } from '../progress';
import { useTheme } from '../theme';
import { GoalToast, StreakPill } from './Today';

const PLAY = ['/play', '/practice'];
const EXPLORE = ['/teardowns', '/anti-patterns', '/principles', '/glossary', '/learn'];

// Three places only: Play (games), Cards (the pattern collection), Explore (go deeper).
export default function TopBar() {
  const { pathname } = useLocation();
  const { xp, level } = useXP();
  const [isDark, toggleTheme] = useTheme();
  const on = (list) => list.some((p) => pathname.startsWith(p));

  return (
    <header className="topnav">
      <div className="topnav-inner">
        <Link to="/" className="logo" aria-label="AI Patterns, home">
          <span className="logo-mark" aria-hidden />
          <span className="logo-text">AI Patterns</span>
        </Link>
        <nav className="topnav-links" aria-label="Main">
          <NavLink to="/play" className={() => (on(PLAY) ? 'active' : '')}>Play</NavLink>
          <NavLink to="/patterns">Cards</NavLink>
          <NavLink to="/teardowns" className={() => (on(EXPLORE) ? 'active' : '')}>Explore</NavLink>
        </nav>
        <div className="topnav-right">
          <StreakPill />
          <Link to="/play" className="xp-pill" aria-label={`${xp} XP, level: ${level.name}`} title={level.name}>
            <Zap size={14} strokeWidth={2} aria-hidden />
            <span key={xp} className="xp-num">{xp}</span>
            <span className="xp-unit">XP</span>
          </Link>
          <button className="icon-btn" onClick={toggleTheme} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
            {isDark ? <Sun size={16} strokeWidth={1.75} aria-hidden /> : <Moon size={16} strokeWidth={1.75} aria-hidden />}
          </button>
        </div>
      </div>
      <GoalToast />
    </header>
  );
}
