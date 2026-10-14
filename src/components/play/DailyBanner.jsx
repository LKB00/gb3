import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Flame } from 'lucide-react';
import { DAILY_GOAL, useDaily, useStreak } from '../../progress';
import { dailyLabel, goalRounds } from '../../game/decks';
import { dayKey } from '../../lib/dates';

// The Daily challenge, as a wide banner: today's status and the day streak (same as the top bar flame).
// Once the Daily is done, it points at the daily goal instead of a result you already saw.
export default function DailyBanner() {
  const daily = useDaily();
  const { streak, todayMoves } = useStreak();
  const key = dayKey();
  const today = daily[key];
  const flame = streak > 0 && <span className="pill-streak"><Flame size={13} strokeWidth={1.75} aria-hidden /> {streak}-day streak</span>;

  if (!today) {
    return (
      <Link to="/play/daily" className="daily-banner">
        <CalendarDays size={22} strokeWidth={1.75} aria-hidden />
        <span className="daily-banner-text">
          <strong>Daily #{dailyLabel(key)}</strong>
          <span>5 rounds. Same for everyone. One shot!</span>
        </span>
        {flame}
        <span className="btn btn-primary">Play now <ArrowRight size={14} strokeWidth={1.75} aria-hidden /></span>
      </Link>
    );
  }

  const got = `You got ${today.filter(Boolean).length}/${today.length} today.`;
  const left = DAILY_GOAL - todayMoves;
  const rounds = goalRounds(left);
  return (
    <div className="daily-banner is-done">
      <CalendarDays size={22} strokeWidth={1.75} aria-hidden />
      <span className="daily-banner-text">
        <strong>Daily #{dailyLabel(key)}</strong>
        <span>{left > 0 ? `${got} ${left} more ${left === 1 ? 'answer' : 'answers'} to hit today’s goal.` : `${got} Goal done · New Daily tomorrow.`}</span>
      </span>
      {flame}
      <span className="daily-banner-actions">
        {left > 0 ? (
          <>
            <Link to={`/play/this-or-that?rounds=${rounds}`} className="btn btn-primary">
              Hit your goal: {rounds} quick rounds <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
            </Link>
            <Link to="/play/daily" className="daily-banner-link">See result</Link>
          </>
        ) : (
          <Link to="/play/daily" className="btn btn-primary">See result <ArrowRight size={14} strokeWidth={1.75} aria-hidden /></Link>
        )}
      </span>
    </div>
  );
}
