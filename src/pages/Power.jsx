import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Gauge, RotateCcw, Star, X } from 'lucide-react';
import { getLevel, levels, TAGS, tasks } from '../data/autonomy';
import { getPattern } from '../data/patterns';
import { fx } from '../game/fx';
import { shuffle } from '../lib/random';
import { track } from '../game/track';
import { markPlayed, savePower, useGameStats, XP } from '../progress';
import Breadcrumbs from '../components/Breadcrumbs';
import Disagree from '../components/Disagree';
import Burst, { XpPop } from '../components/Burst';
import { useTitle } from '../lib/useTitle';

// "How much power?": a task, five levels, pick the right one.
// Exact = 2 points, one step off = 1 point. 8 tasks, so 16 is perfect.
const ROUNDS = 8;
const MAX = ROUNDS * 2;

function deal() {
  // One task for each level first, so every level shows up, then random ones.
  const all = shuffle(tasks);
  const first = levels.map((l) => all.find((t) => t.level === l.n)).filter(Boolean);
  const rest = all.filter((t) => !first.includes(t)).slice(0, ROUNDS - first.length);
  return shuffle([...first, ...rest]);
}

const starsFor = (pts) => (pts >= 14 ? 3 : pts >= 10 ? 2 : 1);

export default function Power() {
  useTitle('How much power?');
  const stats = useGameStats();
  const [hand, setHand] = useState(deal);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [points, setPoints] = useState(0);
  const [log, setLog] = useState([]);
  const [result, setResult] = useState(null);
  const nextRef = useRef(null);
  const whyRef = useRef(null);

  const t = hand[i];
  const answered = pick != null;
  const off = answered ? Math.abs(pick - t.level) : null;

  const choose = (n) => {
    if (answered) return;
    markPlayed();
    const d = Math.abs(n - t.level);
    const gain = d === 0 ? 2 : d === 1 ? 1 : 0;
    fx(d === 0 ? 'right' : d === 1 ? 'select' : 'wrong', { streak: log.filter((x) => x === 2).length });
    setPick(n);
    setPoints((p) => p + gain);
    setLog((l) => [...l, gain]);
  };

  useEffect(() => {
    if (!answered) return;
    nextRef.current?.focus({ preventScroll: true });
    // Phones: bring the explanation into view (it sits below the five levels).
    if (window.matchMedia('(max-width: 720px)').matches) {
      whyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [answered]);

  const next = () => {
    if (i + 1 < ROUNDS) {
      setI(i + 1);
      setPick(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const best = stats.powerBest || 0;
    setResult({ record: points > best, gain: Math.max(0, points - best) * XP.power });
    savePower(points);
    window.scrollTo(0, 0);
    fx(points >= 14 ? 'win' : 'timeup');
    track('Game finished', { game: 'power', score: points });
  };

  const again = () => {
    setHand(deal());
    setI(0);
    setPick(null);
    setPoints(0);
    setLog([]);
    setResult(null);
  };

  if (result) {
    const stars = starsFor(points);
    return (
      <div className="page page-wide">
        <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: 'How much power?' }]} />
        <div className="tot tot-over">
          {stars === 3 && <Burst count={26} />}
          <span className="lab-stars" aria-label={`${stars} of 3 stars`}>
            {[1, 2, 3].map((n) => <Star key={n} size={28} strokeWidth={1.5} className={n <= stars ? 'is-on' : ''} style={{ animationDelay: `${n * 120}ms` }} aria-hidden />)}
          </span>
          <p className="tot-big">{points}<span>/{MAX}</span>{result.gain > 0 && <XpPop amount={result.gain} />}</p>
          <p className="tot-verdict">
            {stars === 3 ? 'You know when to trust the AI. Great instincts.' : stars === 2 ? 'Good sense of risk. A few levels off.' : 'Tricky! Look at the clues: money, undo, how often.'}
          </p>
          <ul className="power-recap">
            {hand.map((x, k) => (
              <li key={x.id} className={log[k] === 2 ? 'is-good' : log[k] === 1 ? 'is-close' : 'is-bad'}>
                {log[k] === 2 ? <Check size={14} strokeWidth={2.25} aria-hidden /> : log[k] === 1 ? <Gauge size={14} strokeWidth={2} aria-hidden /> : <X size={14} strokeWidth={2.25} aria-hidden />}
                <span>{x.text}</span>
                <strong>{getLevel(x.level).name}</strong>
              </li>
            ))}
          </ul>
          <div className="tot-stats">
            {result.record && points > 0 ? <span className="pill-new">New best!</span> : <span>Best: {stats.powerBest || 0}/{MAX}</span>}
          </div>
          <div className="row wrap center">
            <button type="button" className="btn btn-primary btn-lg" onClick={again}>
              <RotateCcw size={15} strokeWidth={1.75} aria-hidden /> Play again
            </button>
            <Link to="/autonomy" className="btn btn-ghost btn-lg">See the ladder</Link>
          </div>
        </div>
      </div>
    );
  }

  const right = getLevel(t.level);
  return (
    <div className="page page-wide">
      <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: 'How much power?' }]} />
      <header className="page-head page-head-tight">
        <h1 className="display">How much power?</h1>
        <p className="lead">How much should the AI do on its own? Pick the level for each task. Exact = 2 points, one step off = 1.</p>
      </header>

      <div className="power">
        <div className="power-top">
          <span className="label">Task {i + 1} of {ROUNDS}</span>
          <span className="power-dots" aria-hidden>
            {Array.from({ length: ROUNDS }, (_, k) => (
              <span key={k} className={k < log.length ? (log[k] === 2 ? 'is-good' : log[k] === 1 ? 'is-close' : 'is-bad') : k === i ? 'is-now' : ''} />
            ))}
          </span>
          <span className="power-points" key={points}>{points} pts</span>
        </div>

        <div className="power-task" key={t.id}>
          <p className="power-where">{t.detail}</p>
          <p className="power-text">{t.text}</p>
          <div className="power-tags">
            {t.tags.map((g) => <span key={g} className={`power-tag tag-${g}`}>{TAGS[g]}</span>)}
          </div>
        </div>

        <div className="power-opts" role="radiogroup" aria-label="Pick a level">
          {levels.map((l) => {
            let cls = '';
            if (answered) {
              if (l.n === t.level) cls = ' is-good';
              else if (l.n === pick) cls = off === 1 ? ' is-close' : ' is-bad';
              else cls = ' is-dim';
            }
            return (
              <button
                key={l.n}
                type="button"
                role="radio"
                aria-checked={pick === l.n}
                className={'power-opt' + cls}
                disabled={answered}
                onClick={() => choose(l.n)}
                style={{ '--step': l.n }}
              >
                <span className="ladder-n">{l.n}</span>
                <span className="ladder-text">
                  <strong>{l.name}</strong>
                  <span>{l.short}</span>
                </span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div ref={whyRef} className={'lab-why power-why ' + (off === 0 ? 'lab-why-good' : off === 1 ? 'power-why-close' : 'lab-why-bad')} aria-live="polite">
            <strong>
              {off === 0 ? <><Check size={15} strokeWidth={2.25} aria-hidden /> Exactly right · +2</> : off === 1 ? <><Gauge size={15} strokeWidth={2} aria-hidden /> Close · +1. Best: {right.name}</> : <><X size={15} strokeWidth={2.25} aria-hidden /> Best: {right.name}</>}
            </strong>
            <span>{t.why}</span>
            <span className="power-needs">
              Needs:{' '}
              {right.patterns.slice(0, 3).map((id, k) => (
                <span key={id}>{k > 0 && ' · '}<Link to={`/patterns/${id}`}>{getPattern(id).title}</Link></span>
              ))}
            </span>
          </div>
        )}

        {answered && (
          <div className="lab-nav power-nav">
            <button ref={nextRef} type="button" className="btn btn-primary btn-lg" onClick={next}>
              {i + 1 < ROUNDS ? 'Next task' : 'See my score'} <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
            </button>
            <Disagree where={`How much power? · ${t.text}`} detail={`Picked level ${pick}, answer ${t.level}`} />
          </div>
        )}
      </div>
    </div>
  );
}
