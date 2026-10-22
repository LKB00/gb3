import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { useDaily, useDailyGoal, useStreak } from '../../progress';
import { dailyLabel, goalRounds } from '../../game/decks';
import { dayKey } from '../../lib/dates';

// The Daily challenge, as a wide banner: today's status and one clear button.
// The day streak is not repeated here (it is in the top bar and the Today card).
// Once the Daily is done, it points at the daily goal instead of a result you already saw.
export default function DailyBanner() {
  const daily = useDaily();
  const { todayMoves } = useStreak();
  const goal = useDailyGoal();
  const key = dayKey();
  const today = daily[key];

  if (!today) {
    return (
      <Link to="/play/daily" className="daily-banner">
        <CalendarDays size={22} strokeWidth={1.75} aria-hidden />
        <span className="daily-banner-text">
          <strong>Daily #{dailyLabel(key)}</strong>
          <span>5 rounds. Same for everyone. One shot!</span>
        </span>
        <span className="btn btn-primary">Play now <ArrowRight size={14} strokeWidth={1.75} aria-hidden /></span>
      </Link>
    );
  }

  const got = `You got ${today.filter(Boolean).length}/${today.length}.`;
  const left = goal - todayMoves;
  const rounds = goalRounds(left);
  return (
    <div className="daily-banner is-done">
      <CalendarDays size={22} strokeWidth={1.75} aria-hidden />
      <span className="daily-banner-text">
        <strong>Daily #{dailyLabel(key)}</strong>
        <span>{left > 0 ? `${got} ${left} more ${left === 1 ? 'answer' : 'answers'} for today’s goal.` : `${got} Goal done. New Daily tomorrow.`}</span>
      </span>
      <span className="daily-banner-actions">
        {left > 0 ? (
          <>
            <Link to={`/play/this-or-that?rounds=${rounds}`} className="btn btn-primary">
              Play {rounds} quick rounds <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
            </Link>
            <Link to="/play/daily" className="daily-banner-link">See result</Link>
          </>
        ) : (
          <Link to="/play/daily" className="daily-banner-link">See result</Link>
        )}
      </span>
    </div>
  );
}
