import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Snowflake, Target, TrendingUp, Volume2 } from 'lucide-react';
import { DAILY_GOAL, dayKey, useStreak, useXP } from '../progress';
import { goalRounds } from '../game/decks';
import Burst from './Burst';
import { fx, turnAllOff } from '../game/fx';

// Small flame in the top bar: your day streak. Grey until you play today.
export function StreakPill() {
  const { streak, todayMoves } = useStreak();
  const lit = todayMoves > 0;
  return (
    <Link
      to="/play"
      className={'streak-pill' + (lit ? ' is-lit' : '')}
      aria-label={`${streak}-day streak${lit ? '' : streak > 0 ? '. Play today to keep it.' : '. Play today to start one.'}`}
      title={lit ? `${streak}-day streak` : streak > 0 ? 'Play today to keep your streak' : 'Play today to start a streak'}
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
      fx('goal');
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
        <strong>Daily goal smashed!</strong> {streak > 1 ? `🔥 ${streak}-day streak` : 'Day streak started 🔥'}
      </span>
    </div>
  );
}

// One-time hint the first time a sound plays, since sound is on by default.
export function SoundHint() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let t;
    const on = () => {
      setShow(true);
      t = setTimeout(() => setShow(false), 5000);
    };
    window.addEventListener('fx-hint', on);
    return () => {
      window.removeEventListener('fx-hint', on);
      clearTimeout(t);
    };
  }, []);
  if (!show) return null;
  return (
    <div className="goal-toast sound-hint" role="status">
      <Volume2 size={16} strokeWidth={2} aria-hidden />
      <span>Sound and vibration are on.</span>
      <button
        type="button"
        className="sound-hint-off"
        data-fx="off"
        onClick={() => {
          turnAllOff();
          setShow(false);
        }}
      >
        Turn off
      </button>
    </div>
  );
}

// "Level up!" the moment XP crosses into a new level, wherever you are.
// XP that arrives from another open tab just catches this tab up, with no toast
// (that tab already celebrated).
export function LevelUpToast() {
  const { levelNum, level } = useXP();
  const prev = useRef(levelNum);
  const otherTabAt = useRef(0);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const mark = () => {
      otherTabAt.current = Date.now();
    };
    window.addEventListener('storage', mark);
    return () => window.removeEventListener('storage', mark);
  }, []);
  useEffect(() => {
    if (levelNum > prev.current && Date.now() - otherTabAt.current > 1000) {
      fx('levelup');
      setShow(true);
      const t = setTimeout(() => setShow(false), 4000);
      prev.current = levelNum;
      return () => clearTimeout(t);
    }
    prev.current = levelNum;
  }, [levelNum]);
  if (!show) return null;
  return (
    <div className="goal-toast levelup-toast" role="status">
      <Burst count={28} />
      <TrendingUp size={18} strokeWidth={2} aria-hidden />
      <span>
        <strong>Level up!</strong> You’re now {/^[aeiou]/i.test(level.name) ? 'an' : 'a'} {level.name}.
      </span>
    </div>
  );
}

const WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Did the skip day save yesterday? Then say so plainly:
// "You missed Tuesday. Your skip day kept your 7-day streak."
function skipNote(streak, frozen) {
  const y = new Date();
  y.setDate(y.getDate() - 1);
  if (!frozen.includes(dayKey(y)) || streak < 1) return null;
  const day = y.toLocaleDateString('en-US', { weekday: 'long' });
  return `You missed ${day}. Your skip day kept your ${streak}-day streak.`;
}

// Play page: all progress in one quiet line (level + XP bar, today's goal, day streak),
// so the Daily and the games are what the eye lands on. The full cards live on Me.
export function ProgressLine() {
  const { level, levelNum, nextLevel, toNext, xp } = useXP();
  const { streak, frozen, todayMoves } = useStreak();
  const pct = nextLevel ? Math.round(((xp - level.xp) / (nextLevel.xp - level.xp)) * 100) : 100;
  const done = Math.min(todayMoves, DAILY_GOAL);
  const saved = skipNote(streak, frozen);
  return (
    <div className="progress-line">
      <div className="pl-level">
        <span className="pl-badge" aria-hidden>{levelNum}</span>
        <span className="pl-level-text">
          <strong>{level.name}</strong>
          <span className="pl-bar" aria-hidden><span style={{ width: `${pct}%` }} /></span>
          <span className="small muted">{nextLevel ? `${toNext} XP to ${nextLevel.name}` : 'Top level!'}</span>
        </span>
      </div>
      <div className="pl-facts">
        <span className="pl-fact" title="Today's goal">
          <Target size={16} strokeWidth={2} aria-hidden /> <strong>{done}/{DAILY_GOAL}</strong> today
        </span>
        <span className="pl-fact pl-streak" title="Day streak">
          <Flame size={16} strokeWidth={2} aria-hidden /> <strong>{streak}</strong> {streak === 1 ? 'day' : 'days'}
        </span>
        <Link to="/me" className="pl-more">Your progress <ArrowRight size={14} strokeWidth={1.75} aria-hidden /></Link>
      </div>
      {saved && <p className="pl-saved small"><Snowflake size={13} strokeWidth={2} aria-hidden /> {saved}</p>}
    </div>
  );
}

// Today (Me page): the goal ring, one line and one button on top,
// then a quiet footer with the day streak, the skip day and the last 7 days.
// `go` = show the "Play N quick rounds" button while the goal is open.
export function TodayCard({ go = true }) {
  const { streak, frozen, freezeReady, todayMoves, days } = useStreak();
  const pct = Math.min(1, todayMoves / DAILY_GOAL);
  const left = DAILY_GOAL - todayMoves;
  const rounds = goalRounds(left);
  const saved = skipNote(streak, frozen);
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
        <p className="today-title">{pct >= 1 ? 'Daily goal done. Nice!' : `${left} more ${left === 1 ? 'answer' : 'answers'} to hit today’s goal`}</p>
        {saved ? (
          <p className="today-saved"><Snowflake size={13} strokeWidth={2} aria-hidden /> {saved}</p>
        ) : (
          <p className="small muted">Every answer in every game counts.</p>
        )}
        {go && left > 0 && (
          <Link to={`/play/this-or-that?rounds=${rounds}`} className="btn btn-primary today-go">
            Play {rounds} quick rounds <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
          </Link>
        )}
      </div>
      <div className="today-foot">
        <span className={'today-flame' + (todayMoves > 0 ? ' is-lit' : '')}>
          <Flame size={16} strokeWidth={2} aria-hidden /> <strong>{streak}</strong> day streak
        </span>
        <ol className="week" aria-label="Last 7 days">
          {last7.map((d) => (
            <li key={d.k} className={(d.played ? 'is-played' : d.frozen ? 'is-frozen' : '') + (d.today ? ' is-today' : '')} title={d.k}>
              <span className="week-dot">{d.played ? <Flame size={10} strokeWidth={2} aria-hidden /> : d.frozen ? <Snowflake size={10} strokeWidth={2} aria-hidden /> : null}</span>
              <span className="week-day">{d.label}</span>
            </li>
          ))}
        </ol>
        {freezeReady ? (
          <span className="freeze small" title="Miss a day and your skip day keeps your streak. You get 1 a week.">
            <Snowflake size={12} strokeWidth={2} aria-hidden /> 1 skip day ready: miss a day, keep your streak
          </span>
        ) : (
          <span className="freeze is-used small"><Snowflake size={12} strokeWidth={2} aria-hidden /> Skip day used. You get 1 a week.</span>
        )}
      </div>
    </div>
  );
}
