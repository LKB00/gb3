import { useTitle } from '../useTitle';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { categories, patterns } from '../data/patterns';
import PatternCard from '../components/PatternCard';
import { usePassed } from '../progress';
import LibraryTabs from '../components/LibraryTabs';

export default function Patterns() {
  useTitle('All patterns');
  const [params, setParams] = useSearchParams();
  const passed = usePassed();
  const category = params.get('category') || 'all';
  const query = params.get('q') || '';

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const q = query.trim().toLowerCase();
  const list = patterns.filter(
    (p) =>
      (category === 'all' || p.category === category) &&
      (!q || [p.title, p.summary, p.problem, p.solution].join(' ').toLowerCase().includes(q))
  );

  return (
    <div className="page page-wide">
      <LibraryTabs />
      <header className="page-head">
        <h1 className="display">All patterns</h1>
        <p className="lead">{patterns.length} patterns for designing AI features, grouped by the problem they solve.</p>
      </header>

      <div className="filters">
        <label className="search">
          <Search size={15} strokeWidth={1.75} aria-hidden />
          <input
            type="search"
            id="pattern-search"
            placeholder="Search patterns"
            value={query}
            onChange={(e) => update('q', e.target.value)}
            aria-label="Search patterns"
          />
        </label>
        <div className="chips" role="group" aria-label="Filter by group">
          {[{ id: 'all', name: 'All' }, ...categories].map((c) => (
            <button key={c.id} className={'chip' + (category === c.id ? ' chip-on' : '')} aria-pressed={category === c.id} onClick={() => update('category', c.id)}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {list.length ? (
        <div className="card-grid">
          {list.map((p) => <PatternCard key={p.id} pattern={p} passed={passed.includes(p.id)} />)}
        </div>
      ) : (
        <div className="empty">
          <p>No patterns match “{query}”.</p>
          <button className="btn btn-ghost" onClick={() => setParams({}, { replace: true })}>Clear filters</button>
        </div>
      )}
    </div>
  );
}
