import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Check, CircleDashed, Hammer, Plus, RotateCcw, Star, X } from 'lucide-react';
import { builds, getBuild } from '../data/builds';
import { getPattern } from '../data/patterns';
import { fx } from '../game/fx';
import { shuffle } from '../lib/random';
import { track } from '../game/track';
import { buddy } from '../game/buddy';
import Disagree from '../components/Disagree';
import { PeekLink } from '../components/PatternPeek';
import { clearRun, markPlayed, readBuildRun, saveBuild, saveRun, useGameStats, XP } from '../progress';
import MockFrame, { MockBlock } from '../mock/Mock';
import Breadcrumbs from '../components/Breadcrumbs';
import Burst, { XpPop } from '../components/Burst';
import { useTitle } from '../lib/useTitle';
import { useReveal } from '../lib/useReveal';

// Build mode: a blank AI screen and a box of pieces. Tap (or drag) pieces onto
// the screen, then check. Good pieces are patterns; traps are common mistakes.
// Why: designing from scratch is the closest thing to real work, and the most creative game here.
function score(build, placed) {
  const needs = build.pieces.filter((p) => p.kind === 'need');
  const have = needs.filter((p) => placed.includes(p.id));
  const missing = needs.filter((p) => !placed.includes(p.id));
  const traps = build.pieces.filter((p) => p.kind === 'trap' && placed.includes(p.id));
  const nice = build.pieces.filter((p) => p.kind === 'nice' && placed.includes(p.id));
  const stars = missing.length === 0 && traps.length === 0 ? 3 : missing.length + traps.length <= 2 ? 2 : 1;
  return { have, missing, traps, nice, stars };
}

function Builder({ build, nextJob, onNextJob }) {
  const stats = useGameStats();
  // Pieces on the screen are kept per brief for this tab, so switching jobs, a link,
  // Back or a refresh never empties the screen. "Start over" clears it.
  const [saved] = useState(() => readBuildRun(build));
  const [pieces] = useState(() => (saved?.order ? saved.order.map((id) => build.pieces.find((p) => p.id === id)) : shuffle(build.pieces)));
  const [placed, setPlaced] = useState(saved?.placed ?? []);
  const [result, setResult] = useState(() => (saved?.checked ? score(build, saved.placed) : null));
  const [gain, setGain] = useState(0);
  const [over, setOver] = useState(false);
  const resultRef = useReveal(result);
  // Phones: the pinned screen is short, so scroll it to the newest piece.
  const screenRef = useRef(null);
  useEffect(() => {
    const el = screenRef.current;
    if (el && el.scrollHeight > el.clientHeight) el.scrollTo({ top: el.scrollHeight });
  }, [placed.length]);
  const runKey = 'build:' + build.id;
  useEffect(() => {
    if (placed.length) saveRun(runKey, { order: pieces.map((p) => p.id), placed, checked: !!result });
    else clearRun(runKey);
  }, [runKey, pieces, placed, result]);

  const add = (id) => {
    if (placed.includes(id)) return;
    markPlayed();
    fx('place');
    setPlaced((p) => [...p, id]);
    setResult(null);
  };
  const remove = (id) => {
    fx('remove');
    setPlaced((p) => p.filter((x) => x !== id));
    setResult(null);
  };
  const check = () => {
    const r = score(build, placed);
    const before = (stats.builds || {})[build.id] || 0;
    setGain(Math.max(0, r.stars - before) * XP.star);
    saveBuild(build.id, r.stars);
    fx(r.stars === 3 ? 'win' : r.traps.length ? 'wrong' : 'right');
    if (r.stars === 3) buddy('win');
    else if (r.traps.length) buddy('trap');
    setResult(r);
    track('Game finished', { game: `build-${build.id}`, stars: r.stars });
  };
  const reset = () => {
    setPlaced([]);
    setResult(null);
    setGain(0);
  };
  const shipped = result?.stars === 3;

  return (
    <div className={'build' + (result ? ' has-result' : '')}>
      <div className="build-job">
        <p className="label">Your job</p>
        <p className="lab-goal">{build.brief}</p>
      </div>
      <div className="build-box">
        <p className="label">Pieces · tap to add, tap again to remove</p>
        <ul className="build-pieces">
          {pieces.map((p) => {
            const on = placed.includes(p.id);
            return (
              <li key={p.id}>
                <button
                  type="button"
                  className={'build-piece' + (on ? ' is-on' : '')}
                  draggable={!on}
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', p.id)}
                  onClick={() => (on ? remove(p.id) : add(p.id))}
                  aria-pressed={on}
                >
                  {on ? <Check size={14} strokeWidth={2.25} aria-hidden /> : <Plus size={14} strokeWidth={2} aria-hidden />}
                  {p.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* On phones this wrapper melts away: the screen sticks to the top while you tap pieces,
          and the buttons stick to the bottom. */}
      <div className="build-side">
        <div className="build-screen" ref={screenRef}>
          <p className="label">Your screen · {placed.length} piece{placed.length === 1 ? '' : 's'}</p>
          <div
            className={'build-drop' + (over ? ' is-over' : '')}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(true);
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setOver(false);
              const id = e.dataTransfer.getData('text/plain');
              if (build.pieces.some((p) => p.id === id)) add(id);
            }}
          >
            <MockFrame title={build.app}>
              {build.base.map((b, i) => <MockBlock key={i} b={b} />)}
              {placed.map((id) => {
                const p = build.pieces.find((x) => x.id === id);
                const state = result ? (p.kind === 'trap' ? 'bad' : 'good') : undefined;
                return (
                  <div key={id} className="build-placed">
                    <MockBlock b={p.block} state={state} />
                    {!result && (
                      <button type="button" className="build-remove" onClick={() => remove(id)} aria-label={`Remove ${p.label}`}>
                        <X size={12} strokeWidth={2.25} aria-hidden />
                      </button>
                    )}
                  </div>
                );
              })}
              {placed.length === 0 && <div className="m-slot-empty m-slot-focus">Nothing here yet. Tap a piece to add it.</div>}
            </MockFrame>
          </div>
        </div>
        <div className="lab-nav build-actions">
          {shipped ? (
            nextJob ? (
              <button type="button" className="btn btn-primary" onClick={() => onNextJob(nextJob.id)}>
                Next job: {nextJob.title} <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
              </button>
            ) : (
              <Link to="/play" className="btn btn-primary">
                All jobs built! More games <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
              </Link>
            )
          ) : (
            <button type="button" className="btn btn-primary" onClick={check} disabled={placed.length === 0}>
              <Hammer size={14} strokeWidth={1.75} aria-hidden /> Check my screen
            </button>
          )}
          {placed.length > 0 && (
            <button type="button" className="build-reset" onClick={reset}>
              <RotateCcw size={13} strokeWidth={1.75} aria-hidden /> Start over
            </button>
          )}
        </div>
      </div>

      {result && (
        <div ref={resultRef} className="build-result" aria-live="polite">
          {result.stars === 3 && <Burst count={26} />}
          <div className="build-result-head">
            <span className="lab-stars" aria-label={`${result.stars} of 3 stars`}>
              {[1, 2, 3].map((n) => <Star key={n} size={24} strokeWidth={1.5} className={n <= result.stars ? 'is-on' : ''} style={{ animationDelay: `${n * 120}ms` }} aria-hidden />)}
            </span>
            <h3>{result.stars === 3 ? 'Ship it! People will trust this one.' : result.stars === 2 ? 'So close! Fix 1 or 2 things.' : 'Not ready yet. Let’s fix it.'}{gain > 0 && <XpPop amount={gain} />}</h3>
          </div>
          <p className="small muted">{result.stars === 3 ? 'Every must-have piece, and not one trap. Clean.' : 'For 3 stars, add every must-have and drop every trap. Then check again.'}</p>
          {/* What to fix comes first (traps, then missing pieces), then what already works. */}
          <ul className="build-notes">
            {result.traps.map((p) => (
              <li key={p.id} className="is-bad"><AlertTriangle size={14} strokeWidth={2} aria-hidden /><span><strong>Trap: {p.label}.</strong> {p.why} <PeekLink id={p.pattern}>{getPattern(p.pattern).title}</PeekLink></span></li>
            ))}
            {result.missing.map((p) => (
              <li key={p.id} className="is-missing"><CircleDashed size={14} strokeWidth={2} aria-hidden /><span><strong>Missing: a piece for “{getPattern(p.pattern).title}”.</strong> Look for it in the pieces.</span></li>
            ))}
            {result.have.map((p) => (
              <li key={p.id} className="is-good"><Check size={14} strokeWidth={2.25} aria-hidden /><span><strong>{p.label}.</strong> {p.why} <PeekLink id={p.pattern}>{getPattern(p.pattern).title}</PeekLink></span></li>
            ))}
            {result.nice.map((p) => (
              <li key={p.id} className="is-good"><Plus size={14} strokeWidth={2.25} aria-hidden /><span><strong>Bonus: {p.label}.</strong> {p.why}</span></li>
            ))}
          </ul>
          <Disagree where={`Build mode · ${build.title}`} detail={`Pieces: ${placed.join(', ')}`} />
        </div>
      )}
    </div>
  );
}

export default function Build() {
  useTitle('Build mode');
  const [params, setParams] = useSearchParams();
  const stats = useGameStats();
  const build = getBuild(params.get('brief')) || builds[0];
  const best = stats.builds || {};
  // The next job without 3 stars yet, after this one.
  const k = builds.indexOf(build);
  const nextJob = [...builds.slice(k + 1), ...builds.slice(0, k)].find((b) => best[b.id] !== 3) || null;
  const goTo = (id) => setParams({ brief: id }, { replace: true });
  const nextJobGo = (id) => {
    goTo(id);
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: calm ? 'instant' : 'smooth' });
  };
  return (
    <div className="page page-wide">
      <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: 'Build mode' }]} />
      <header className="page-head page-head-tight">
        <h1 className="display">Build mode</h1>
        <p className="lead">Build an AI screen people can trust. Add the pieces it needs, skip the traps, then check it.</p>
      </header>
      <div className="tabs tot-modes" role="tablist" aria-label="Briefs">
        {builds.map((b) => (
          <button key={b.id} role="tab" aria-selected={b.id === build.id} className="tab" onClick={() => goTo(b.id)}>
            {b.title}
            {best[b.id] ? <span className="tab-count">{'★'.repeat(best[b.id])}</span> : null}
          </button>
        ))}
      </div>
      <div className="view">
        <Builder key={build.id} build={build} nextJob={nextJob} onNextJob={nextJobGo} />
      </div>
    </div>
  );
}
