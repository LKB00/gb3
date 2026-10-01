import { useTitle } from '../useTitle';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, Circle } from 'lucide-react';
import { hunts } from '../data/hunts';
import { categories, patterns } from '../data/patterns';
import { useHuntsDone, usePassed } from '../progress';
import Hunt from '../components/Hunt';

export default function Practice() {
  useTitle('Practice');
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'hunt' ? 'hunt' : 'labs';
  const [idx, setIdx] = useState(0);
  const passed = usePassed();
  const huntsDone = useHuntsDone();
  const scenario = hunts[idx];

  return (
    <div className="page page-wide">
      <header className="page-head page-head-tight">
        <h1 className="display">Practice</h1>
        <p className="lead">Two ways to learn by doing. Pick one.</p>
      </header>

      {/* Why tabs: one task on screen at a time, instead of two long sections. */}
      <div className="tabs practice-tabs" role="tablist" aria-label="Practice modes">
        <button role="tab" aria-selected={tab === 'labs'} className="tab" onClick={() => setParams({}, { replace: true })}>
          Design Labs <span className="tab-count">{passed.length}/{patterns.length}</span>
        </button>
        <button role="tab" aria-selected={tab === 'hunt'} className="tab" onClick={() => setParams({ tab: 'hunt' }, { replace: true })}>
          Mistake Hunt <span className="tab-count">{huntsDone.length}/{hunts.length}</span>
        </button>
      </div>

      {tab === 'labs' && (
        <section className="view">
          <p className="section-sub">Build each feature by picking options. The lab checks your design for common mistakes.</p>
          <div className="lab-groups">
            {categories.map((c) => (
              <div key={c.id}>
                <p className="label">{c.name}</p>
                <ul className="index-list">
                  {patterns.filter((p) => p.category === c.id).map((p) => {
                    const done = passed.includes(p.id);
                    return (
                      <li key={p.id}>
                        <Link to={`/patterns/${p.id}`} className={'lab-link' + (done ? ' lab-link-done' : '')}>
                          {done ? <Check size={14} strokeWidth={2} aria-label="Passed" /> : <Circle size={14} strokeWidth={1.5} aria-hidden />}
                          {p.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
      {tab === 'hunt' && (
        <section className="view">
          <div className="chips hunt-tabs" role="tablist" aria-label="Screens">
            {hunts.map((h, i) => (
              <button key={h.id} role="tab" aria-selected={i === idx} className={'chip' + (i === idx ? ' chip-on' : '')} onClick={() => setIdx(i)}>
                {huntsDone.includes(h.id) && <Check size={12} strokeWidth={2.5} aria-label="Done" />}
                {h.title}
              </button>
            ))}
          </div>
          <p className="section-sub">{scenario.brief}</p>
          <Hunt key={scenario.id} scenario={scenario} />
          {idx < hunts.length - 1 && (
            <div className="actions">
              <button className="btn btn-primary" onClick={() => setIdx(idx + 1)}>
                Next screen <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
