import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { weeklyScreen } from '../data/weekly';
import { weekKey } from '../lib/dates';
import { markWeeklyDone, useWeeklyDone } from '../progress';
import Hunt from '../components/Hunt';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTitle } from '../lib/useTitle';
import { revealEl } from '../lib/useReveal';

// Screen of the week: one Spot-the-flaw screen from an everyday AI product, new every Monday.
// The week is fixed when the page opens, so a game that runs past midnight on Sunday still counts.
// Finishing it (every flaw found, answers not shown) is saved per week in 'weekly' and gives XP.hunt once.
export default function Weekly() {
  useTitle('Screen of the week');
  const [now] = useState(() => new Date());
  const week = weekKey(now);
  const scenario = weeklyScreen(now);
  const doneWeeks = useWeeklyDone();
  const [doneAtOpen] = useState(() => doneWeeks[week] === scenario.id);
  const [over, setOver] = useState(false);
  const onDone = useCallback((id) => markWeeklyDone(week, id), [week]);

  // When the screen is done, bring the next step into view (on phones it is pinned).
  const nextRef = useRef(null);
  useEffect(() => {
    if (!over) return;
    const id = requestAnimationFrame(() => {
      const bar = nextRef.current;
      const pinned = bar && getComputedStyle(bar).position === 'sticky';
      revealEl(pinned ? bar.previousElementSibling : bar);
    });
    return () => cancelAnimationFrame(id);
  }, [over]);

  return (
    <div className="page page-wide">
      <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: 'Screen of the week' }]} />
      <header className="page-head page-head-tight wk-head">
        <p className="label">Screen of the week</p>
        <h1 className="display">{scenario.type}</h1>
        <p className="lead">
          {scenario.brief} Tap every mistake you spot. <span className="wk-new">New one every Monday.</span>
        </p>
        {doneAtOpen && (
          <p className="wk-done small">
            <Check size={14} strokeWidth={1.75} aria-hidden /> You cracked this week’s screen. Play it again for fun.
          </p>
        )}
      </header>
      <div className="view">
        <Hunt key={scenario.id} scenario={scenario} onOver={setOver} onDone={onDone} doneBefore={doneAtOpen} game="screen-of-the-week">
          {over && (
            <div ref={nextRef} className="lab-nav hunt-next">
              <Link to="/play/spot-the-flaw" className="btn btn-primary btn-lg">
                More screens to crack <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
              </Link>
            </div>
          )}
        </Hunt>
      </div>
    </div>
  );
}
