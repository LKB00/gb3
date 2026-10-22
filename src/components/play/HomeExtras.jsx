import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, X } from 'lucide-react';
import { achievements } from '../../data/achievements';
import { hideFirstSteps, saveRecapSeen } from '../../progress';
import { useRandomChallenge } from '../../game/useRandomChallenge';

// Small extras on Home (styles in styles/home-extra.css, prefix hx-).
//   ContinueRow  one quiet line back into an unfinished game (progress.js lastRun)
//   FirstSteps   3 ticks for brand-new players, below the first game
//   WeekRecap    last week in numbers, once per week (progress.js weekRecap)

// "Continue: Agent on duty · scene 3 →". The x hides it for this visit (this tab).
const HIDE_KEY = 'gb3-continue-hidden';
export function ContinueRow({ run }) {
  const [hidden, setHidden] = useState(() => {
    try {
      return sessionStorage.getItem(HIDE_KEY) === run.key;
    } catch {
      return false;
    }
  });
  if (hidden) return null;
  const hide = () => {
    setHidden(true);
    try {
      sessionStorage.setItem(HIDE_KEY, run.key);
    } catch {
      /* hidden until Home opens again */
    }
  };
  return (
    <p className="hx-continue">
      <Link to={run.to} className="hx-continue-link" onClick={run.open}>
        <span className="hx-continue-text">Continue: <strong>{run.label}</strong></span>
        <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
      </Link>
      <button type="button" className="hx-x" onClick={hide} aria-label="Hide this for now">
        <X size={14} strokeWidth={1.75} aria-hidden />
      </button>
    </p>
  );
}

function Step({ done, children }) {
  return (
    <li className={'hx-step' + (done ? ' is-done' : '')}>
      <span className="hx-check" aria-hidden>{done && <Check size={12} strokeWidth={2.5} />}</span>
      {children}
      {done && <span className="sr-only"> (done)</span>}
    </li>
  );
}

// Three steps that tick themselves. The page decides when to show it.
export function FirstSteps({ played, carded, meSeen }) {
  const playCard = useRandomChallenge();
  return (
    <section className="hx-steps" aria-label="Your first 5 minutes">
      <div className="hx-steps-head">
        <h2 className="hx-steps-title">Your first 5 minutes</h2>
        <button type="button" className="link-like small" onClick={hideFirstSteps}>Hide</button>
      </div>
      <ol className="hx-step-list">
        <Step done={played}>
          <span>Play a round in the game above</span>
        </Step>
        <Step done={carded}>
          {carded ? (
            <span>Win your first card</span>
          ) : (
            <button type="button" className="link-like" onClick={playCard}>
              Win your first card <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
            </button>
          )}
        </Step>
        <Step done={meSeen}>
          <Link to="/me" className="link-like">
            See your level <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
          </Link>
        </Step>
      </ol>
    </section>
  );
}

const plural = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`;
const spark = (days) => (days >= 7 ? 'Every single day!' : days >= 4 ? 'Nice rhythm!' : days >= 2 ? 'Good going!' : 'One strong day!');

// "Last week: 42 answers in 4 days. Nice rhythm!" plus one quiet line of details.
export function WeekRecap({ recap }) {
  const names = recap.achievements.map((id) => achievements.find((a) => a.id === id)?.name).filter(Boolean);
  const bits = [];
  if (recap.best && recap.daysPlayed > 1) bits.push(`Best day: ${recap.best.day}, ${plural(recap.best.n, 'answer')}`);
  if (recap.dailies) bits.push(`${plural(recap.dailies, 'Daily', 'Dailies')}${recap.perfect ? `, ${recap.perfect} perfect` : ''}`);
  if (names.length) bits.push(`Earned: ${names.join(', ')}`);
  return (
    <section className="hx-recap" aria-label="Last week">
      <p className="hx-recap-title">
        Last week: {plural(recap.answers, 'answer')} in {plural(recap.daysPlayed, 'day')}. {spark(recap.daysPlayed)}
      </p>
      {bits.length > 0 && (
        <ul className="hx-recap-bits small muted">
          {bits.map((b) => <li key={b}>{b}</li>)}
        </ul>
      )}
      <button type="button" className="btn btn-ghost btn-sm hx-recap-ok" onClick={() => saveRecapSeen(recap.week)}>Got it</button>
    </section>
  );
}
