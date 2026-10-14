import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Search } from 'lucide-react';
import { furtherReading, glossary } from '../data/glossary';
import { getPattern } from '../data/patterns';
import { useTitle } from '../lib/useTitle';
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
        <p className="lead">The words you’ll hear when building AI features. Each one in plain English, with why designers care.</p>
      </header>

      <div className="filters">
        <label className="search">
          <Search size={15} strokeWidth={1.75} aria-hidden />
          <input id="glossary-search" type="search" placeholder="Search a word" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search a word" />
        </label>
      </div>

      <dl className="gloss">
        {list.map((g) => (
          <div key={g.term} className="gloss-row">
            <dt>{g.term}</dt>
            <dd>
              <p>{g.def}</p>
              <p className="gloss-design"><span className="label">Why it matters</span> {g.design}</p>
              {g.patterns?.length > 0 && (
                <div className="gloss-cards">
                  <span className="label">See it on a card</span>
                  {/* A read place, so the card opens on "Why it works" (Play is one tab away) */}
                  {g.patterns.map((pid) => (
                    <Link key={pid} to={`/patterns/${pid}?view=understand`} className={`tag tag-${getPattern(pid).category}`}>{getPattern(pid).title}</Link>
                  ))}
                </div>
              )}
            </dd>
          </div>
        ))}
      </dl>
      {!list.length && <p className="empty">No words match “{q}”. Try a shorter search.</p>}

      <section className="block">
        <div className="section-head">
          <h2>Further reading</h2>
          <p className="section-sub">The guides and libraries that inspired this site.</p>
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
