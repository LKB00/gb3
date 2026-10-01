import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronLeft, Moon, Sun, Volume2, VolumeX, Zap } from 'lucide-react';
import { useXP } from '../progress';
import { useTheme } from '../theme';
import { GoalToast, StreakPill } from './Today';
import { useFx } from '../game/fx';

const PLAY = ['/play', '/practice'];
const EXPLORE = ['/teardowns', '/anti-patterns', '/principles', '/glossary', '/learn'];

// Where the phone back button goes from an inner page (desktop uses breadcrumbs).
const PARENT_NAMES = { '/play': 'Play', '/play/story': 'Stories', '/patterns': 'Cards', '/learn': 'Deep dives', '/teardowns': 'Teardowns' };
function parentOf(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length < 2) return null;
  const to = '/' + parts.slice(0, -1).join('/');
  return { to, name: PARENT_NAMES[to] || 'Back' };
}

// Three places only: Play (games), Cards (the pattern collection), Explore (go deeper).
// On phones the places move to the bottom bar (BottomNav) and this bar gets simpler.
export default function TopBar() {
  const { pathname } = useLocation();
  const { xp, level } = useXP();
  const [isDark, toggleTheme] = useTheme();
  const [sound, toggleSound] = useFx();
  const on = (list) => list.some((p) => pathname.startsWith(p));
  const parent = parentOf(pathname);

  return (
    <header className="topnav">
      <div className={'topnav-inner' + (parent ? ' has-back' : '')}>
        {parent && (
          <Link to={parent.to} className="topnav-back">
            <ChevronLeft size={20} strokeWidth={2} aria-hidden /> {parent.name}
          </Link>
        )}
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
          <Link to="/me" className="xp-pill" aria-label={`${xp} XP, level: ${level.name}`} title={level.name}>
            <Zap size={14} strokeWidth={2} aria-hidden />
            <span key={xp} className="xp-num">{xp}</span>
            <span className="xp-unit">XP</span>
          </Link>
          <button className="icon-btn hide-phone" onClick={toggleSound} aria-pressed={sound} aria-label={sound ? 'Turn sound and vibration off' : 'Turn sound and vibration on'} title={sound ? 'Sound on' : 'Sound off'}>
            {sound ? <Volume2 size={16} strokeWidth={1.75} aria-hidden /> : <VolumeX size={16} strokeWidth={1.75} aria-hidden />}
          </button>
          <button className="icon-btn hide-phone" onClick={toggleTheme} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
            {isDark ? <Sun size={16} strokeWidth={1.75} aria-hidden /> : <Moon size={16} strokeWidth={1.75} aria-hidden />}
          </button>
        </div>
      </div>
      <GoalToast />
    </header>
  );
}
