import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Snowflake, Target } from 'lucide-react';
import { DAILY_GOAL, dayKey, useStreak } from '../progress';
import Burst from './Burst';

// Small flame in the top bar: your day streak. Grey until you play today.
export function StreakPill() {
  const { streak, todayMoves } = useStreak();
  const lit = todayMoves > 0;
  return (
    <Link
      to="/play"
      className={'streak-pill' + (lit ? ' is-lit' : '')}
      aria-label={`${streak} day streak${lit ? '' : '. Play today to keep it.'}`}
      title={lit ? `${streak}-day streak` : 'Play today to keep your streak'}
    >
      <Flame size={14} strokeWidth={2} aria-hidden />
      <span key={streak} className="xp-num">{streak}</span>
    </Link>
  );
}

// A short celebration when the daily goal is reached, wherever you are.
export function GoalToast() {
  const [show, setShow] = useState(false);
  const { streak } = useStreak();
  useEffect(() => {
    let t;
    const on = () => {
      setShow(true);
      clearTimeout(t);
      t = setTimeout(() => setShow(false), 3500);
    };
    window.addEventListener('goal-reached', on);
    return () => {
      window.removeEventListener('goal-reached', on);
      clearTimeout(t);
    };
  }, []);
  if (!show) return null;
  return (
    <div className="goal-toast" role="status">
      <Burst count={20} />
      <Target size={18} strokeWidth={1.75} aria-hidden />
      <span>
        <strong>Daily goal done!</strong> {streak > 1 ? `🔥 ${streak}-day streak` : 'Streak started 🔥'}
      </span>
    </div>
  );
}

const WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Today: goal ring, streak, freeze and the last 7 days.
export function TodayCard() {
  const { streak, frozen, freezeReady, todayMoves, days } = useStreak();
  const pct = Math.min(1, todayMoves / DAILY_GOAL);
  const r = 26;
  const c = 2 * Math.PI * r;
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const k = dayKey(d);
    return { k, label: WEEK[d.getDay()], played: (days[k] || 0) > 0, frozen: frozen.includes(k), today: i === 6 };
  });
  return (
    <div className="today-card">
      <div className="today-goal">
        <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden>
          <circle cx="32" cy="32" r={r} className="ring-bg" />
          <circle cx="32" cy="32" r={r} className="ring-fg ring-goal" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
        </svg>
        <span className="today-goal-num">{Math.min(todayMoves, DAILY_GOAL)}<small>/{DAILY_GOAL}</small></span>
      </div>
      <div className="today-text">
        <p className="label">Today</p>
        <p className="today-title">{pct >= 1 ? 'Daily goal done!' : `${DAILY_GOAL - todayMoves} more moves today`}</p>
        <p className="small muted">
          A move is any answer in any game.{' '}
          {freezeReady ? (
            <span className="freeze"><Snowflake size={12} strokeWidth={2} aria-hidden /> 1 free skip day ready</span>
          ) : (
            <span className="freeze is-used"><Snowflake size={12} strokeWidth={2} aria-hidden /> Skip day used this week</span>
          )}
        </p>
      </div>
      <div className="today-streak">
        <span className={'today-flame' + (todayMoves > 0 ? ' is-lit' : '')}><Flame size={20} strokeWidth={2} aria-hidden /> {streak}</span>
        <span className="small muted">day streak</span>
      </div>
      <ol className="week" aria-label="Last 7 days">
        {last7.map((d) => (
          <li key={d.k} className={(d.played ? 'is-played' : d.frozen ? 'is-frozen' : '') + (d.today ? ' is-today' : '')} title={d.k}>
            <span className="week-dot">{d.played ? <Flame size={12} strokeWidth={2} aria-hidden /> : d.frozen ? <Snowflake size={12} strokeWidth={2} aria-hidden /> : null}</span>
            <span className="week-day">{d.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
