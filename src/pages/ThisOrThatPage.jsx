import { useSearchParams } from 'react-router-dom';
import { Eye, Shuffle } from 'lucide-react';
import ThisOrThat from '../components/ThisOrThat';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTitle } from '../lib/useTitle';

// This or That, with Classic / Hard tabs (?mode=hard). ?rounds=3..10 plays a shorter run (default 10),
// e.g. "Play 5 quick rounds" to reach the daily goal.
function roundsFrom(v) {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? Math.min(10, Math.max(3, n)) : 10;
}

export default function ThisOrThatPage() {
  useTitle('This or That');
  const [params, setParams] = useSearchParams();
  const mode = params.get('mode') === 'hard' ? 'hard' : 'classic';
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
          <Eye size={15} strokeWidth={1.75} aria-hidden /> Hard <span className="tab-count">spot the 1 difference</span>
        </button>
      </div>
      <div className="view">
        <ThisOrThat rounds={rounds} mode={mode} />
      </div>
    </div>
  );
}
