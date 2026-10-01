import { useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { furtherReading, glossary } from '../data/glossary';
import { useTitle } from '../useTitle';
import LibraryTabs from '../components/LibraryTabs';

export default function Glossary() {
  useTitle('Glossary');
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();
  const list = glossary.filter((g) => !query || (g.term + ' ' + g.def).toLowerCase().includes(query));

  return (
    <div className="page page-wide page-lib-read">
      <LibraryTabs />
      <header className="page-head">
        <h1 className="display">AI words, in plain English</h1>
        <p className="lead">The terms you will hear when designing AI features, and why each one matters for design.</p>
      </header>

      <div className="filters">
        <label className="search">
          <Search size={15} strokeWidth={1.75} aria-hidden />
          <input id="glossary-search" type="search" placeholder="Search terms" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search terms" />
        </label>
      </div>

      <dl className="gloss">
        {list.map((g) => (
          <div key={g.term} className="gloss-row">
            <dt>{g.term}</dt>
            <dd>
              <p>{g.def}</p>
              <p className="gloss-design"><span className="label">For design</span> {g.design}</p>
            </dd>
          </div>
        ))}
      </dl>
      {!list.length && <p className="empty">No terms match “{q}”.</p>}

      <section className="block">
        <div className="section-head">
          <h2>Further reading</h2>
          <p className="section-sub">The guidelines and libraries this site learns from.</p>
        </div>
        <ul className="ref-list">
          {furtherReading.map((s) => (
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
