import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Bot, ChevronRight, IdCard, Moon, Smartphone, Sun, Volume2, VolumeX } from 'lucide-react';
import { useHaptic, useSound } from '../game/fx';
import { useTheme } from '../lib/theme';
import { TodayCard } from '../components/Today';
import AppAndBackup from '../components/play/AppAndBackup';
import Badges from '../components/play/Badges';
import LevelCard from '../components/play/LevelCard';
import { useTitle } from '../lib/useTitle';
import { AchievementList } from '../components/Achievements';
import { buddyOn, setBuddyOn } from '../game/buddy';
import { designerType } from '../game/designerType';
import { GOAL_OPTIONS, markMeSeen, saveDailyGoal, useDailyGoal, usePassed, useStars } from '../progress';
import { Bell, CalendarPlus, Target } from 'lucide-react';
import { downloadReminder } from '../lib/reminder';

// "Me": your level, today, badges, settings and backup in one place.
// Order: who you are (a quiet level line), today's goal (the one card with a button), then details.
// On phones it's a bottom tab; on desktop the XP pill opens it.
export default function Me() {
  useTitle('Me');
  useEffect(markMeSeen, []); // ticks "See your level" in Home's first-steps list
  const myType = designerType({ passed: usePassed(), stars: useStars() });
  const [sound, toggleSound] = useSound();
  const [haptic, toggleHaptic] = useHaptic();
  const [isDark, toggleTheme] = useTheme();
  const [pal, setPal] = useState(buddyOn);
  const togglePal = () => {
    setBuddyOn(!pal);
    setPal(!pal);
  };
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
          <span><strong>Your player card</strong><span className="small muted">{myType.sentence ? `You’re ${myType.sentence}. See your card.` : 'Find your AI designer type and show it off'}</span></span>
          <ChevronRight size={18} strokeWidth={1.75} aria-hidden />
        </Link>
      </div>

      <section className="block">
        <h2>Badges</h2>
        <Badges row />
      </section>

      <section className="block">
        <h2>Achievements</h2>
        <AchievementList />
      </section>

      <section className="block">
        <h2>Settings</h2>
        <div className="me-group">
          <GoalRow />
          <ReminderRow />
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
          <button type="button" className="me-row" onClick={togglePal} aria-pressed={pal}>
            <Bot size={20} strokeWidth={1.75} aria-hidden />
            <span><strong>Bot buddy</strong><span className="small muted">A little GB3 bot that cheers you on now and then</span></span>
            <span className={'switch' + (pal ? ' is-on' : '')} aria-hidden />
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

// Settings: pick how many answers a day make your goal (5, 10 or 20).
const GOAL_NAMES = { 5: 'Easy', 10: 'Normal', 20: 'Serious' };
function GoalRow() {
  const goal = useDailyGoal();
  return (
    <div className="me-row sx-row">
      <Target size={20} strokeWidth={1.75} aria-hidden />
      <span><strong>Daily goal</strong><span className="small muted">How many answers a day feels right?</span></span>
      <div className="show-seg sx-seg" role="group" aria-label="Daily goal">
        {GOAL_OPTIONS.map((n) => (
          <button key={n} type="button" className={goal === n ? 'is-on' : ''} aria-pressed={goal === n} onClick={() => saveDailyGoal(n)}>
            {GOAL_NAMES[n]} {n}
          </button>
        ))}
      </div>
    </div>
  );
}

// Settings: a daily reminder as a calendar file. Nothing is sent anywhere.
function ReminderRow() {
  const [time, setTime] = useState('09:00');
  const [note, setNote] = useState('');
  const add = () => setNote(downloadReminder(time) ? 'Done! Open the file to add it to your calendar.' : 'Your browser blocked the file. Try another browser.');
  return (
    <div className="me-row sx-row">
      <Bell size={20} strokeWidth={1.75} aria-hidden />
      <span>
        <strong>Daily reminder</strong>
        <span className="small muted">Add a reminder to your own calendar. No spam, no account.</span>
        <span className="small sx-note" role="status">{note}</span>
      </span>
      <div className="sx-controls">
        <input type="time" className="sx-time" value={time} onChange={(e) => setTime(e.target.value)} aria-label="Reminder time" />
        <button type="button" className="btn btn-ghost btn-sm" onClick={add}>
          <CalendarPlus size={14} strokeWidth={1.75} aria-hidden /> Add to my calendar
        </button>
      </div>
    </div>
  );
}
