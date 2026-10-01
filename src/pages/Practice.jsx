import { useTitle } from '../useTitle';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Circle } from 'lucide-react';
import { hunts } from '../data/hunts';
import { categories, patterns } from '../data/patterns';
import { usePassed } from '../progress';
import Hunt from '../components/Hunt';

export default function Practice() {
  useTitle('Practice');
  const [idx, setIdx] = useState(0);
  const passed = usePassed();
  const scenario = hunts[idx];

  return (
    <div className="page page-wide">
      <header className="page-head">
        <p className="label">Practice</p>
        <h1 className="display">Learn by doing</h1>
        <p className="lead">Find mistakes in real-looking AI screens, then build features yourself in the Design Labs.</p>
      </header>

      <section className="block">
        <div className="row space-between">
          <h2>Mistake Hunt</h2>
          <span className="muted small">Screen {idx + 1} of {hunts.length}</span>
        </div>
        <div className="chips hunt-tabs" role="tablist" aria-label="Screens">
          {hunts.map((h, i) => (
            <button key={h.id} role="tab" aria-selected={i === idx} className={'chip' + (i === idx ? ' chip-on' : '')} onClick={() => setIdx(i)}>
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

      <section className="block">
        <div className="row space-between">
          <h2>Design Labs</h2>
          <span className="muted small">{passed.length} of {patterns.length} passed</span>
        </div>
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
                      <Link to={`/patterns/${p.id}#lab`} className={'lab-link' + (done ? ' lab-link-done' : '')}>
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
    </div>
  );
}
