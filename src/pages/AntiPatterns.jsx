import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import { antipatterns, antipatternSources } from '../data/antipatterns';
import { getPattern } from '../data/patterns';
import MockFrame, { MockBlock } from '../mock/Mock';
import { useTitle } from '../lib/useTitle';
import LibraryTabs from '../components/LibraryTabs';

export default function AntiPatterns() {
  useTitle('Dark patterns');
  return (
    <div className="page page-wide">
      <LibraryTabs />
      <header className="page-head">
        <h1 className="display">AI dark patterns: never ship these</h1>
        <p className="lead">
          They look great in a demo. They hurt the people using the product. Here’s how to spot each one, and what to build instead.
        </p>
      </header>

      <div className="block">
        <ul className="anti-list">
          {antipatterns.map((a) => (
            <li key={a.id} className="anti-item">
              <div className="anti-screen" aria-hidden>
                <MockFrame>
                  {a.blocks.map((b, i) => <MockBlock key={i} b={b} pin={b.pin} state={b.pin ? 'bad' : undefined} />)}
                </MockFrame>
              </div>
              <div className="anti-body">
                <div>
                  <p className="label">{a.also}</p>
                  <h2>{a.name}</h2>
                </div>
                <p>{a.what}</p>
                <dl className="anti-dl">
                  <dt>Why it hurts</dt>
                  <dd>{a.harm}</dd>
                  <dt>Do this instead</dt>
                  <dd>
                    <span className="anti-fix"><Check size={14} strokeWidth={2} aria-hidden /> {a.fix}</span>
                    <span className="row">
                      {a.patterns.map((pid) => (
                        <Link key={pid} to={`/patterns/${pid}`} className="chip chip-sm">{getPattern(pid).title}</Link>
                      ))}
                    </span>
                  </dd>
                </dl>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <section className="block">
        <div className="section-head">
          <h2>Sources</h2>
          <p className="section-sub">These groups come from research on AI dark patterns.</p>
        </div>
        <ul className="ref-list">
          {antipatternSources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer" className="ref-link">
                <strong>{s.name}</strong>
                <span>{s.by}</span>
                <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
