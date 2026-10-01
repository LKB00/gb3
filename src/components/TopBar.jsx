import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronLeft, Moon, Sun, Volume2, VolumeX, Zap } from 'lucide-react';
import { useXP } from '../progress';
import { useTheme } from '../lib/theme';
import { GoalToast, LevelUpToast, SoundHint, StreakPill } from './Today';
import { useFx } from '../game/fx';
import LogoMark from './LogoMark';
import { useCountUp } from '../lib/useCountUp';
import { EXPLORE_HOME, isExplore, isPlay, parentOf } from '../config/nav';

// Three places only: Play (games), Cards (the pattern collection), Explore (go deeper).
// On phones the places move to the bottom bar (BottomNav) and this bar gets simpler.
export default function TopBar() {
  const { pathname } = useLocation();
  const { xp, level } = useXP();
  const shownXp = useCountUp(xp);
  const [isDark, toggleTheme] = useTheme();
  const [sound, toggleSound] = useFx();
  const parent = parentOf(pathname);

  return (
    <header className="topnav">
      <div className={'topnav-inner' + (parent ? ' has-back' : '')}>
        {parent && (
          <Link to={parent.to} className="topnav-back">
            <ChevronLeft size={20} strokeWidth={2} aria-hidden /> {parent.name}
          </Link>
        )}
        <Link to="/" className="logo" aria-label="Good Bot, Bad Bot, home">
          <LogoMark />
          <span className="logo-text">Good Bot, Bad Bot</span>
        </Link>
        <nav className="topnav-links" aria-label="Main">
          <NavLink to="/play" className={() => (isPlay(pathname) ? 'active' : '')}>Play</NavLink>
          <NavLink to="/patterns">Cards</NavLink>
          <NavLink to={EXPLORE_HOME} className={() => (isExplore(pathname) ? 'active' : '')}>Explore</NavLink>
        </nav>
        <div className="topnav-right">
          <StreakPill />
          <Link to="/me" className="xp-pill" aria-label={`${xp} XP, level: ${level.name}`} title={level.name}>
            <Zap size={14} strokeWidth={2} aria-hidden />
            <span key={xp} className="xp-num">{shownXp}</span>
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
      <LevelUpToast />
      <SoundHint />
    </header>
  );
}
