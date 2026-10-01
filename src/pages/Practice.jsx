import { useState } from 'react';
import { Link } from 'react-router-dom';
import { hunts } from '../data/hunts';
import { categories, patterns } from '../data/patterns';
import { usePassed } from '../progress';
import Hunt from '../components/Hunt';

export default function Practice() {
  const [idx, setIdx] = useState(0);
  const passed = usePassed();
  const scenario = hunts[idx];

  return (
    <div className="container page">
      <h1>Practice</h1>
      <p className="lead">Learn by doing. Find mistakes in real-looking AI screens, then build features yourself in the Design Labs.</p>

      <section className="practice-block">
        <div className="row space-between">
          <h2>🔍 Mistake Hunt</h2>
          <span className="demo-muted small">Screen {idx + 1} of {hunts.length}</span>
        </div>
        <div className="hunt-tabs" role="tablist" aria-label="Screens">
          {hunts.map((h, i) => (
            <button key={h.id} role="tab" aria-selected={i === idx} className={'chip' + (i === idx ? ' chip-on' : '')} onClick={() => setIdx(i)}>
              {h.title}
            </button>
          ))}
        </div>
        <p className="hunt-brief"><strong>{scenario.title}.</strong> {scenario.brief}</p>
        <Hunt key={scenario.id} scenario={scenario} />
        {idx < hunts.length - 1 && (
          <div className="row hunt-next">
            <button className="btn btn-primary" onClick={() => setIdx(idx + 1)}>Next screen →</button>
          </div>
        )}
      </section>

      <section className="practice-block">
        <div className="row space-between">
          <h2>🧪 Design Labs</h2>
          <span className="lab-count">{passed.length} / {patterns.length} passed</span>
        </div>
        <p className="demo-muted">Build each feature by picking options. The lab checks your design for common mistakes.</p>
        {categories.map((c) => (
          <div key={c.id} className="lab-group">
            <h3 className={`tag tag-${c.id}`}>{c.name}</h3>
            <div className="lab-links">
              {patterns.filter((p) => p.category === c.id).map((p) => (
                <Link key={p.id} to={`/patterns/${p.id}#lab`} className={'lab-link' + (passed.includes(p.id) ? ' lab-link-done' : '')}>
                  <span aria-hidden>{passed.includes(p.id) ? '✓' : '○'}</span>
                  {p.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
