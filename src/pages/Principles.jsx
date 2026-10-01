import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { principleTypes, principles, patternsUsing } from '../data/principles';
import { getPattern } from '../data/patterns';
import { useTitle } from '../useTitle';

export default function Principles() {
  useTitle('Principles');
  const [params] = useSearchParams();
  const focus = params.get('focus');

  useEffect(() => {
    // Wait one frame: the app scrolls to the top on every page change first.
    if (!focus) return;
    const t = setTimeout(() => document.getElementById(`pr-${focus}`)?.scrollIntoView({ block: 'center' }), 50);
    return () => clearTimeout(t);
  }, [focus]);

  return (
    <div className="page">
      <header className="page-head">
        <p className="label">Principles</p>
        <h1 className="display">The ideas behind the patterns</h1>
        <p className="lead">
          Patterns work because of how people think. These are the UX heuristics, laws and psychology the patterns rely on, and where each one is used.
        </p>
      </header>

      {principleTypes.map((t) => (
        <section key={t.id} className="block">
          <div className="section-head">
            <h2>{t.name}</h2>
            <p className="section-sub">{t.blurb}</p>
          </div>
          <ul className="pr-index">
            {principles.filter((p) => p.type === t.id).map((p) => (
              <li key={p.id} id={`pr-${p.id}`} className={'pr-entry' + (focus === p.id ? ' pr-entry-focus' : '')}>
                <h3>{p.name}</h3>
                <p>{p.def}</p>
                <div className="row">
                  <span className="label">Used in</span>
                  {patternsUsing(p.id).map((pid) => (
                    <Link key={pid} to={`/patterns/${pid}`} className="chip chip-sm">{getPattern(pid).title}</Link>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
