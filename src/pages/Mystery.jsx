import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { mystery } from '../data/mystery';
import { useAchievements, useMystery, useStreak, saveMystery } from '../progress';
import Lab from '../components/Lab';
import Compare from '../components/Compare';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTitle } from '../lib/useTitle';

const GOAL = 7; // same as the 'streak-7' achievement

// The Mystery card: a bonus card that is not one of the 38. It stays face down until the
// 'streak-7' achievement (7 days in a row) is earned. Winning its Fix it is saved in 'mystery'.
export default function Mystery() {
  const open = !!useAchievements()['streak-7'];
  useTitle(open ? mystery.title : 'Mystery card');
  return (
    <div className="page page-wide">
      <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: 'Mystery card' }]} />
      {open ? <Revealed /> : <Locked />}
    </div>
  );
}

function Locked() {
  const { streak } = useStreak();
  const now = Math.min(streak, GOAL);
  return (
    <div className="my-locked">
      <div className="my-back" aria-hidden>
        <Sparkles size={16} strokeWidth={1.75} />
        <span className="my-q">???</span>
      </div>
      <h1 className="display my-title">Mystery card</h1>
      <p className="lead">Play 7 days in a row to reveal it.</p>
      <div className="my-days" aria-label={`Day streak: ${streak} of ${GOAL} days`}>
        {Array.from({ length: GOAL }, (_, i) => (
          <span key={i} className={'my-day' + (i < now ? ' is-on' : '')} />
        ))}
        <span className="small muted">{streak === 0 ? 'Your day streak starts with one answer.' : `Day ${now} of ${GOAL}`}</span>
      </div>
      <Link to="/play" className="btn btn-primary">
        Play today <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
      </Link>
    </div>
  );
}

function Stars({ n }) {
  return (
    <span className="my-stars" aria-label={`${n} of 3 stars`}>
      {[1, 2, 3].map((k) => <Star key={k} size={14} strokeWidth={1.75} className={k <= n ? 'is-on' : ''} aria-hidden />)}
    </span>
  );
}

function Revealed() {
  const saved = useMystery();
  return (
    <>
      <header className="page-head page-head-tight">
        <p className="label my-label"><Sparkles size={14} strokeWidth={1.75} aria-hidden /> Mystery card, revealed</p>
        <h1 className="display">{mystery.title}</h1>
        <p className="lead">{mystery.summary}</p>
        {saved.won && (
          <p className="small muted my-won">Yours to keep. Best run: <Stars n={saved.stars} /></p>
        )}
      </header>
      <div className="view">
        <Lab
          id={mystery.id}
          lab={mystery.lab}
          onWin={saveMystery}
          prize={
            <div className="my-prize">
              <Sparkles size={16} strokeWidth={1.75} aria-hidden />
              <strong>{mystery.title}</strong>
              <span className="small">The bonus card. Only 7-day players get this one.</span>
            </div>
          }
          next={
            <Link to="/play" className="btn btn-primary">
              Back to Play <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
            </Link>
          }
        />
      </div>
      <section className="block">
        <div className="section-head">
          <h2>The winning design</h2>
          <p className="section-sub">The same moment, designed two ways.</p>
        </div>
        <Compare data={mystery.compare} />
      </section>
    </>
  );
}
