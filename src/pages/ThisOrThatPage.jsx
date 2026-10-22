import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Eye, RotateCcw, Shuffle } from 'lucide-react';
import ThisOrThat from '../components/ThisOrThat';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTitle } from '../lib/useTitle';
import { useMisses } from '../progress';

// This or That, with Classic / Hard tabs (?mode=hard), plus "Your misses" (?mode=misses) once you have some. ?rounds=3..10 plays a shorter run (default 10),
// e.g. "Play 5 quick rounds" to reach the daily goal.
function roundsFrom(v) {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? Math.min(10, Math.max(3, n)) : 10;
}

export default function ThisOrThatPage() {
  useTitle('This or That');
  const [params, setParams] = useSearchParams();
  const asked = params.get('mode');
  const mode = asked === 'hard' || asked === 'misses' ? asked : 'classic';
  const misses = useMisses().length;
  // The misses tab plays the deck it had when you opened it; it only shows "nothing here" if it opened empty.
  const [startedWith, setStartedWith] = useState(misses);
  useEffect(() => {
    if (mode === 'misses') setStartedWith(misses);
    // Only when you switch to the tab, not on every answer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);
  const rounds = roundsFrom(params.get('rounds'));
  // Switching mode keeps a short run short.
  const keep = rounds === 10 ? {} : { rounds: String(rounds) };
  return (
    <div className="page page-wide">
      <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: 'This or That' }]} />
      <h1 className="sr-only">This or That</h1>
      <div className="tabs tot-modes" role="tablist" aria-label="Mode">
        <button role="tab" aria-selected={mode === 'classic'} className="tab" onClick={() => setParams(keep, { replace: true })}>
          <Shuffle size={15} strokeWidth={1.75} aria-hidden /> Classic
        </button>
        <button role="tab" aria-selected={mode === 'hard'} className="tab" onClick={() => setParams({ mode: 'hard', ...keep }, { replace: true })}>
          {/* The hint helps pick the mode. Once Hard is on, each round's tag says it, so it isn't repeated here. */}
          <Eye size={15} strokeWidth={1.75} aria-hidden /> Hard {mode === 'classic' && misses === 0 && <span className="tab-count">spot the 1 difference</span>}
        </button>
        {(misses > 0 || mode === 'misses') && (
          <button role="tab" aria-selected={mode === 'misses'} className="tab" onClick={() => setParams({ mode: 'misses', ...keep }, { replace: true })}>
            <RotateCcw size={15} strokeWidth={1.75} aria-hidden /> Your misses {misses > 0 && <span className="tab-count">{misses}</span>}
          </button>
        )}
      </div>
      <div className="view">
        {mode === 'misses' && startedWith === 0 ? (
          <div className="empty">
            <p>No misses right now. Any screen you get wrong lands here, so you can win it back.</p>
            <Link to="/play/this-or-that" className="btn btn-primary">Play This or That</Link>
          </div>
        ) : (
          <ThisOrThat rounds={rounds} mode={mode} />
        )}
      </div>
    </div>
  );
}
