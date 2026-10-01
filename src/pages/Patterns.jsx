import { useSearchParams } from 'react-router-dom';
import { categories, patterns } from '../data/patterns';
import PatternCard from '../components/PatternCard';

export default function Patterns() {
  const [params, setParams] = useSearchParams();
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
    <div className="container page">
      <h1>Pattern library</h1>
      <p className="lead">Proven ways to solve common problems in AI products. Every pattern has a live demo.</p>

      <div className="filters">
        <input
          type="search"
          className="search"
          placeholder="Search patterns…"
          value={query}
          onChange={(e) => update('q', e.target.value)}
          aria-label="Search patterns"
        />
        <div className="chips" role="group" aria-label="Filter by category">
          {[{ id: 'all', name: 'All' }, ...categories].map((c) => (
            <button key={c.id} className={'chip' + (category === c.id ? ' chip-on' : '')} aria-pressed={category === c.id} onClick={() => update('category', c.id)}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {list.length ? (
        <div className="card-grid">
          {list.map((p) => <PatternCard key={p.id} pattern={p} />)}
        </div>
      ) : (
        <div className="empty">
          <p><strong>No patterns match “{query}”.</strong></p>
          <button className="btn btn-ghost" onClick={() => setParams({}, { replace: true })}>Clear filters</button>
        </div>
      )}
    </div>
  );
}
