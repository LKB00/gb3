import { useTitle } from '../lib/useTitle';
import { useSearchParams } from 'react-router-dom';
import { Puzzle, Search } from 'lucide-react';
import { categories, patterns } from '../data/patterns';
import PatternCard from '../components/PatternCard';
import { usePassed, useStars } from '../progress';
import { useRandomChallenge } from '../game/useRandomChallenge';

export default function Patterns() {
  useTitle('Cards');
  const [params, setParams] = useSearchParams();
  const passed = usePassed();
  const stars = useStars();
  const random = useRandomChallenge();
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
      <header className="page-head page-head-tight cards-head">
        <h1 className="display">Your cards</h1>
        <p className="lead">Every card is an AI design pattern. Win its “Fix it” challenge to collect it, with up to 3 stars.</p>
        <div className="collect-bar">
          <span className="meter" aria-hidden><span style={{ width: `${(passed.length / patterns.length) * 100}%` }} /></span>
          <span className="small"><strong>{passed.length}</strong> of {patterns.length} collected</span>
          <button type="button" className="btn btn-primary" onClick={random}>
            <Puzzle size={15} strokeWidth={1.75} aria-hidden /> Play a random card
          </button>
        </div>
      </header>

      <div className="filters">
        <label className="search">
          <Search size={15} strokeWidth={1.75} aria-hidden />
          <input
            type="search"
            id="pattern-search"
            placeholder="Search cards"
            value={query}
            onChange={(e) => update('q', e.target.value)}
            aria-label="Search cards"
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
          {list.map((p) => <PatternCard key={p.id} pattern={p} number={patterns.indexOf(p) + 1} passed={passed.includes(p.id)} stars={stars[p.id] || (passed.includes(p.id) ? 1 : 0)} />)}
        </div>
      ) : (
        <div className="empty">
          <p>No cards match “{query}”.</p>
          <button className="btn btn-ghost" onClick={() => setParams({}, { replace: true })}>Clear filters</button>
        </div>
      )}
    </div>
  );
}
