import { Link } from 'react-router-dom';
import { ChevronRight, IdCard, Moon, Smartphone, Sun, Volume2, VolumeX } from 'lucide-react';
import { useHaptic, useSound } from '../game/fx';
import { useTheme } from '../theme';
import { TodayCard } from '../components/Today';
import { AppAndBackup, Badges, LevelCard } from './Play';
import { useTitle } from '../useTitle';

// "Me": your level, today, badges, settings and backup in one place.
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
          <span><strong>Your player card</strong><span className="small muted">See your AI-designer type and share it</span></span>
          <ChevronRight size={18} strokeWidth={1.75} aria-hidden />
        </Link>
      </div>

      <section className="block">
        <h2>Badges</h2>
        <Badges />
      </section>

      <section className="block">
        <h2>Settings</h2>
        <div className="me-stack">
          <button type="button" className="me-row" onClick={toggleSound} aria-pressed={sound}>
            {sound ? <Volume2 size={20} strokeWidth={1.75} aria-hidden /> : <VolumeX size={20} strokeWidth={1.75} aria-hidden />}
            <span><strong>Sound effects</strong><span className="small muted">Taps, right and wrong, wins, level ups</span></span>
            <span className={'switch' + (sound ? ' is-on' : '')} aria-hidden />
          </button>
          <button type="button" className="me-row" onClick={toggleHaptic} aria-pressed={haptic}>
            <Smartphone size={20} strokeWidth={1.75} aria-hidden />
            <span><strong>Vibration</strong><span className="small muted">Feel taps and wins on your phone</span></span>
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
        <h2>Your progress</h2>
        <AppAndBackup />
      </section>

      <p className="small muted me-credits">AI Patterns · a playground for AI interaction design. Progress is saved only in your browser. Icons by Lucide (ISC license).</p>
    </div>
  );
}
