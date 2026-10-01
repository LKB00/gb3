import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Flame } from 'lucide-react';
import { dailyStreak, useDaily } from '../../progress';
import { dailyNumber } from '../../game/decks';
import { dayKey } from '../../lib/dates';

// The Daily challenge, as a wide banner: today's status and streak.
export default function DailyBanner() {
  const daily = useDaily();
  const key = dayKey();
  const today = daily[key];
  const streak = dailyStreak(daily);
  return (
    <Link to="/play/daily" className={'daily-banner' + (today ? ' is-done' : '')}>
      <CalendarDays size={22} strokeWidth={1.75} aria-hidden />
      <span className="daily-banner-text">
        <strong>Daily #{dailyNumber(key)}</strong>
        <span>{today ? `Done today: ${today.filter(Boolean).length}/${today.length}. Share your result.` : '5 rounds, same for everyone today. One try.'}</span>
      </span>
      {streak > 0 && <span className="pill-streak"><Flame size={13} strokeWidth={1.75} aria-hidden /> {streak}</span>}
      <span className="btn btn-primary">{today ? 'See result' : 'Play today’s'} <ArrowRight size={14} strokeWidth={1.75} aria-hidden /></span>
    </Link>
  );
}
