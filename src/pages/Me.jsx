import { Link } from 'react-router-dom';
import { ChevronRight, IdCard, Moon, Smartphone, Sun, Volume2, VolumeX } from 'lucide-react';
import { useHaptic, useSound } from '../game/fx';
import { useTheme } from '../lib/theme';
import { TodayCard } from '../components/Today';
import AppAndBackup from '../components/play/AppAndBackup';
import Badges from '../components/play/Badges';
import LevelCard from '../components/play/LevelCard';
import { useTitle } from '../lib/useTitle';

// "Me": your level, today, badges, settings and backup in one place.
// Order: who you are (a quiet level line), today's goal (the one card with a button), then details.
// On phones it's a bottom tab; on desktop the XP pill opens it.
export default function Me() {
  useTitle('Me');
  const [sound, toggleSound] = useSound();
  const [haptic, toggleHaptic] = useHaptic();
  const [isDark, toggleTheme] = useTheme();
  return (
    <div className="page page-wide me">
      <header className="page-head page-head-tight">
        <h1 className="display">Me</h1>
      </header>
      <div className="me-stack">
        <LevelCard />
        <TodayCard />
        <Link to="/play/card" className="me-row">
          <IdCard size={20} strokeWidth={1.75} aria-hidden />
          <span><strong>Your player card</strong><span className="small muted">Find your AI designer type and show it off</span></span>
          <ChevronRight size={18} strokeWidth={1.75} aria-hidden />
        </Link>
      </div>

      <section className="block">
        <h2>Badges</h2>
        <Badges row />
      </section>

      <section className="block">
        <h2>Settings</h2>
        <div className="me-group">
          <button type="button" className="me-row" onClick={toggleSound} aria-pressed={sound}>
            {sound ? <Volume2 size={20} strokeWidth={1.75} aria-hidden /> : <VolumeX size={20} strokeWidth={1.75} aria-hidden />}
            <span><strong>Sound effects</strong><span className="small muted">Little sounds for taps, answers and wins</span></span>
            <span className={'switch' + (sound ? ' is-on' : '')} aria-hidden />
          </button>
          <button type="button" className="me-row" onClick={toggleHaptic} aria-pressed={haptic}>
            <Smartphone size={20} strokeWidth={1.75} aria-hidden />
            <span><strong>Vibration</strong><span className="small muted">A small buzz on taps and wins, on phones</span></span>
            <span className={'switch' + (haptic ? ' is-on' : '')} aria-hidden />
          </button>
          <button type="button" className="me-row" onClick={toggleTheme} aria-pressed={isDark}>
            {isDark ? <Moon size={20} strokeWidth={1.75} aria-hidden /> : <Sun size={20} strokeWidth={1.75} aria-hidden />}
            <span><strong>Dark mode</strong><span className="small muted">Easier on the eyes at night</span></span>
            <span className={'switch' + (isDark ? ' is-on' : '')} aria-hidden />
          </button>
        </div>
      </section>

      <section className="block">
        <h2>App and backup</h2>
        <AppAndBackup />
      </section>

    </div>
  );
}
