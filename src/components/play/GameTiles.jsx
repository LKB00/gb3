import { Link } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';
import { games } from '../../config/games';
import { useRandomChallenge } from '../../game/useRandomChallenge';
import { useGameStats, useHuntsDone, useMisses, usePassed } from '../../progress';

// The games, as two calm lists: quick games (1-2 minutes) and deeper games (about 5 minutes).
// One row style for every game: a coloured icon, the name, one line, and your progress
// only once you have played it (no "0/37" noise for a new player). The list lives in config/games.js.
const GROUPS = [
  { id: 'quick', title: 'Quick games', sub: '1-2 minutes' },
  { id: 'deep', title: 'Deeper games', sub: 'About 5 minutes' },
];

export default function GameTiles() {
  const random = useRandomChallenge();
  const progress = { stats: useGameStats(), passed: usePassed(), huntsDone: useHuntsDone(), misses: useMisses() };
  const row = (g) => {
    const [MetaIcon, metaText, played] = g.meta(progress);
    const inner = (
      <>
        <span className={`gl-icon ${g.tone}`} aria-hidden><g.icon size={20} strokeWidth={1.75} /></span>
        <span className="gl-text">
          <strong>
            {g.title}
            {g.isNew && <span className="game-new">New</span>}
          </strong>
          <span className="gl-blurb">{g.blurb}</span>
          {played && (
            <span className="game-meta">
              <MetaIcon size={13} strokeWidth={MetaIcon === Check ? 2 : 1.75} aria-hidden /> {metaText}
            </span>
          )}
        </span>
        <ChevronRight className="gl-go" size={18} strokeWidth={1.75} aria-hidden />
      </>
    );
    return (
      <li key={g.id}>
        {g.random ? (
          <button type="button" onClick={random} className="gl-row">{inner}</button>
        ) : (
          <Link to={g.to} className="gl-row">{inner}</Link>
        )}
      </li>
    );
  };
  return (
    <div className="games">
      {GROUPS.map((grp) => (
        <section key={grp.id} className="gl-group" aria-labelledby={`gl-${grp.id}`}>
          <h2 id={`gl-${grp.id}`} className="gl-title">
            {grp.title} <span className="gl-sub">{grp.sub}</span>
          </h2>
          <ul className="gl-list">{games.filter((g) => g.group === grp.id && (!g.show || g.show(progress))).map(row)}</ul>
        </section>
      ))}
    </div>
  );
}
