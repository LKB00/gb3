import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { hunts } from '../data/hunts';
import { useHuntsDone } from '../progress';
import Hunt from '../components/Hunt';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTitle } from '../lib/useTitle';

// Spot the flaw: real-looking screens with hidden mistakes. Opens on the first unfinished one.
export default function SpotTheFlaw() {
  useTitle('Spot the flaw');
  const huntsDone = useHuntsDone();
  const firstOpen = Math.max(0, hunts.findIndex((h) => !huntsDone.includes(h.id)));
  const [idx, setIdx] = useState(firstOpen);
  const scenario = hunts[idx];
  return (
    <div className="page page-wide">
      <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: 'Spot the flaw' }]} />
      <header className="page-head page-head-tight">
        <h1 className="display">Spot the flaw</h1>
        <p className="lead">{scenario.brief}</p>
      </header>
      <div className="chips hunt-tabs" role="tablist" aria-label="Screens">
        {hunts.map((h, i) => (
          <button key={h.id} role="tab" aria-selected={i === idx} className={'chip' + (i === idx ? ' chip-on' : '')} onClick={() => setIdx(i)}>
            {huntsDone.includes(h.id) && <Check size={12} strokeWidth={2.5} aria-label="Done" />}
            {h.title}
          </button>
        ))}
      </div>
      <div className="view">
        <Hunt key={scenario.id} scenario={scenario} />
        {idx < hunts.length - 1 && (
          <div className="actions">
            <button className="btn btn-primary" onClick={() => setIdx(idx + 1)}>
              Next screen <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
