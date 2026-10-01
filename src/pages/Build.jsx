import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle, Check, CircleDashed, Hammer, Plus, RotateCcw, Star, X } from 'lucide-react';
import { builds, getBuild } from '../data/builds';
import { getPattern } from '../data/patterns';
import { fx } from '../game/fx';
import { track } from '../game/track';
import Disagree from '../components/Disagree';
import { markPlayed, saveBuild, useGameStats, XP } from '../progress';
import MockFrame, { MockBlock } from '../mock/Mock';
import Breadcrumbs from '../components/Breadcrumbs';
import Burst, { XpPop } from '../components/Burst';
import { useTitle } from '../useTitle';

// Build mode: a blank AI screen and a box of pieces. Tap (or drag) pieces onto
// the screen, then check. Good pieces are patterns; traps are common mistakes.
// Why: designing from scratch is the closest thing to real work, and the most creative game here.
function shuffled(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function score(build, placed) {
  const needs = build.pieces.filter((p) => p.kind === 'need');
  const have = needs.filter((p) => placed.includes(p.id));
  const missing = needs.filter((p) => !placed.includes(p.id));
  const traps = build.pieces.filter((p) => p.kind === 'trap' && placed.includes(p.id));
  const nice = build.pieces.filter((p) => p.kind === 'nice' && placed.includes(p.id));
  const stars = missing.length === 0 && traps.length === 0 ? 3 : missing.length + traps.length <= 2 ? 2 : 1;
  return { have, missing, traps, nice, stars };
}

function Builder({ build }) {
  const stats = useGameStats();
  const pieces = useMemo(() => shuffled(build.pieces), [build]);
  const [placed, setPlaced] = useState([]);
  const [result, setResult] = useState(null);
  const [gain, setGain] = useState(0);
  const [over, setOver] = useState(false);

  const add = (id) => {
    if (placed.includes(id)) return;
    markPlayed();
    fx('flip');
    setPlaced((p) => [...p, id]);
    setResult(null);
  };
  const remove = (id) => {
    setPlaced((p) => p.filter((x) => x !== id));
    setResult(null);
  };
  const check = () => {
    const r = score(build, placed);
    const before = (stats.builds || {})[build.id] || 0;
    setGain(Math.max(0, r.stars - before) * XP.star);
    saveBuild(build.id, r.stars);
    fx(r.stars === 3 ? 'win' : r.traps.length ? 'wrong' : 'right');
    setResult(r);
    track('Game finished', { game: `build-${build.id}`, stars: r.stars });
  };
  const reset = () => {
    setPlaced([]);
    setResult(null);
    setGain(0);
  };


  return (
    <div className="build">
      <div className="build-box">
        <p className="label">The brief</p>
        <p className="lab-goal">{build.brief}</p>
        <p className="label build-box-label">Pieces · tap or drag onto the screen</p>
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

      <div className="build-screen">
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
            {placed.length === 0 && <div className="m-slot-empty m-slot-focus">Empty screen. Add pieces from the box.</div>}
          </MockFrame>
        </div>
        <div className="lab-nav">
          <button type="button" className="btn btn-primary" onClick={check} disabled={placed.length === 0}>
            <Hammer size={14} strokeWidth={1.75} aria-hidden /> Check my screen
          </button>
          {placed.length > 0 && (
            <button type="button" className="btn btn-ghost" onClick={reset}>
              <RotateCcw size={14} strokeWidth={1.75} aria-hidden /> Start over
            </button>
          )}
        </div>
      </div>

      {result && (
        <div className="build-result" aria-live="polite">
          {result.stars === 3 && <Burst count={26} />}
          <div className="build-result-head">
            <span className="lab-stars" aria-label={`${result.stars} of 3 stars`}>
              {[1, 2, 3].map((n) => <Star key={n} size={24} strokeWidth={1.5} className={n <= result.stars ? 'is-on' : ''} style={{ animationDelay: `${n * 120}ms` }} aria-hidden />)}
            </span>
            <h3>{result.stars === 3 ? 'Ship it! A great screen.' : result.stars === 2 ? 'Close. A couple of fixes.' : 'Not ready yet.'}{gain > 0 && <XpPop amount={gain} />}</h3>
          </div>
          <ul className="build-notes">
            {result.have.map((p) => (
              <li key={p.id} className="is-good"><Check size={14} strokeWidth={2.25} aria-hidden /><span><strong>{p.label}.</strong> {p.why} <Link to={`/patterns/${p.pattern}`}>{getPattern(p.pattern).title}</Link></span></li>
            ))}
            {result.nice.map((p) => (
              <li key={p.id} className="is-good"><Plus size={14} strokeWidth={2.25} aria-hidden /><span><strong>Bonus: {p.label}.</strong> {p.why}</span></li>
            ))}
            {result.traps.map((p) => (
              <li key={p.id} className="is-bad"><AlertTriangle size={14} strokeWidth={2} aria-hidden /><span><strong>Trap: {p.label}.</strong> {p.why} <Link to={`/patterns/${p.pattern}`}>{getPattern(p.pattern).title}</Link></span></li>
            ))}
            {result.missing.map((p) => (
              <li key={p.id} className="is-missing"><CircleDashed size={14} strokeWidth={2} aria-hidden /><span><strong>Missing: something for “{getPattern(p.pattern).title}”.</strong> Look in the box again.</span></li>
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
  return (
    <div className="page page-wide">
      <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: 'Build mode' }]} />
      <header className="page-head page-head-tight">
        <h1 className="display">Build mode</h1>
        <p className="lead">Design the screen yourself. Add the pieces it needs, leave out the traps, then check it.</p>
      </header>
      <div className="tabs tot-modes" role="tablist" aria-label="Briefs">
        {builds.map((b) => (
          <button key={b.id} role="tab" aria-selected={b.id === build.id} className="tab" onClick={() => setParams({ brief: b.id }, { replace: true })}>
            {b.title}
            {best[b.id] ? <span className="tab-count">{'★'.repeat(best[b.id])}</span> : null}
          </button>
        ))}
      </div>
      <div className="view">
        <Builder key={build.id} build={build} />
      </div>
    </div>
  );
}
