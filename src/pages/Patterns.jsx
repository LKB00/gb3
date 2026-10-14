import { useTitle } from '../lib/useTitle';
import { Link, useSearchParams } from 'react-router-dom';
import { Puzzle, Search } from 'lucide-react';
import { categories, getCategory, patterns } from '../data/patterns';
import { realExamples } from '../data/examples';
import PatternCard from '../components/PatternCard';
import { usePassed, useStars } from '../progress';
import { isMissing, needsStars, useRandomChallenge } from '../game/useRandomChallenge';

// Everything search can read for one card, in lower case: the words designers use too
// (the id, the group, when to use it, real products, and extra `keywords`).
const fold = (s) => s.toLowerCase().replace(/[’‘]/g, "'");
const searchText = Object.fromEntries(
  patterns.map((p) => [
    p.id,
    fold(
      [
        p.id.replace(/-/g, ' '),
        p.title,
        getCategory(p.category).name,
        p.summary,
        p.problem,
        p.solution,
        ...p.when,
        ...p.avoid,
        ...p.dos,
        ...p.donts,
        ...(p.examples || []),
        ...(realExamples[p.id] || []).flatMap((e) => [e.product, e.company]),
        ...(p.keywords || []),
      ].join(' · ')
    ),
  ])
);
const words = (q) => fold(q).split(/[^a-z0-9']+/).filter(Boolean);
const matches = (p, ws) => ws.every((w) => searchText[p.id].includes(w));
// No match: cards that share the start of a word you typed ("halluc…", "permiss…").
function nearby(ws) {
  const stems = ws.filter((w) => w.length >= 4).map((w) => w.slice(0, Math.max(4, w.length - 3)));
  if (!stems.length) return [];
  return patterns
    .map((p) => ({ p, n: stems.filter((s) => searchText[p.id].includes(s)).length }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, 3)
    .map((x) => x.p);
}

const SHOWS = ['missing', 'stars'];

export default function Patterns() {
  useTitle('Cards');
  const [params, setParams] = useSearchParams();
  const passed = usePassed();
  const stars = useStars();
  const random = useRandomChallenge();
  const asked = params.get('category');
  const group = categories.find((c) => c.id === asked);
  const category = group ? group.id : 'all'; // an unknown group in the link shows all cards
  const show = SHOWS.includes(params.get('show')) ? params.get('show') : null;
  const query = params.get('q') || '';

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const missingCount = patterns.filter((p) => isMissing(p.id, passed)).length;
  const starsCount = patterns.filter((p) => needsStars(p.id, passed, stars)).length;
  const ws = words(query);
  const byText = patterns.filter((p) => !ws.length || matches(p, ws));
  const list = byText.filter(
    (p) =>
      (category === 'all' || p.category === category) &&
      (show !== 'missing' || isMissing(p.id, passed)) &&
      (show !== 'stars' || needsStars(p.id, passed, stars))
  );
  const playLabel = random.kind === 'missing' ? 'Play a missing card' : random.kind === 'stars' ? 'Go for 3 stars' : 'Play a random card';

  // Why the grid is empty, and the one tap that fixes it.
  const empty = () => {
    if (byText.length) {
      // The text matches, but a filter hides those cards.
      if (show === 'missing' && !query && !group) return { text: 'Every card is collected. What a set!', action: 'Show all cards' };
      if (show === 'stars' && !query && !group) {
        return { text: passed.length ? 'Every card you have is at 3 stars. Shiny!' : 'No cards yet. Win one, then come back for stars.', action: 'Show all cards' };
      }
      const where = group ? ` in ${group.name}` : '';
      return { text: show ? `Nothing left to do here${where}. Nice work!` : `No “${query}” cards${where}. Other groups have some.`, action: 'Search all cards', keep: true };
    }
    return { text: `No cards match “${query}”. Try one of these, or another word.`, action: 'Show all cards', near: nearby(ws) };
  };
  const e = list.length ? null : empty();
  const clearFilters = () => setParams(e?.keep && query ? { q: query } : {}, { replace: true });

  return (
    <div className="page page-wide">
      <header className="page-head page-head-tight cards-head">
        <h1 className="display">Your cards</h1>
        <p className="lead">Each card is one AI design pattern: a proven way to make AI feel good to use. Win its Fix it game to collect it, with up to 3 stars.</p>
        <div className="collect-bar">
          <span className="meter" aria-hidden><span style={{ width: `${(passed.length / patterns.length) * 100}%` }} /></span>
          <span className="small"><strong>{passed.length}</strong> of {patterns.length} collected</span>
          <button type="button" className="btn btn-primary" onClick={random}>
            <Puzzle size={15} strokeWidth={1.75} aria-hidden /> {playLabel}
          </button>
        </div>
      </header>

      <div className="filters">
        <label className="search">
          <Search size={15} strokeWidth={1.75} aria-hidden />
          <input
            type="search"
            id="pattern-search"
            placeholder="Search cards, like “approval”"
            value={query}
            onChange={(ev) => update('q', ev.target.value)}
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
        <div className="chips chips-progress" role="group" aria-label="Filter by progress">
          <button className={'chip' + (show === 'missing' ? ' chip-on' : '')} aria-pressed={show === 'missing'} onClick={() => update('show', show === 'missing' ? null : 'missing')}>
            To collect ({missingCount})
          </button>
          <button className={'chip' + (show === 'stars' ? ' chip-on' : '')} aria-pressed={show === 'stars'} onClick={() => update('show', show === 'stars' ? null : 'stars')}>
            Not 3 stars yet ({starsCount})
          </button>
        </div>
      </div>

      {list.length ? (
        <div className="card-grid">
          {list.map((p) => <PatternCard key={p.id} pattern={p} number={patterns.indexOf(p) + 1} passed={passed.includes(p.id)} stars={stars[p.id] || (passed.includes(p.id) ? 1 : 0)} />)}
        </div>
      ) : (
        <div className="empty">
          <p>{e.text}</p>
          {e.near?.length > 0 && (
            <div className="row wrap">
              {e.near.map((p) => <Link key={p.id} to={`/patterns/${p.id}`} className="chip">{p.title}</Link>)}
            </div>
          )}
          <button className="btn btn-ghost" onClick={clearFilters}>{e.action}</button>
        </div>
      )}
    </div>
  );
}
