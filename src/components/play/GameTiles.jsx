import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { games } from '../../config/games';
import { useRandomChallenge } from '../../game/useRandomChallenge';
import { useGameStats, useHuntsDone, usePassed } from '../../progress';

// One colourful tile per game. The list lives in config/games.js.
// The first two are big ("start here"); the rest are smaller, so the page has a clear first pick.
const BIG = 2;

export default function GameTiles() {
  const random = useRandomChallenge();
  const progress = { stats: useGameStats(), passed: usePassed(), huntsDone: useHuntsDone() };
  const tile = (g, big) => {
    const [MetaIcon, metaText] = g.meta(progress);
    const className = `game ${g.tone} ${big ? 'game-big' : 'game-small'}`;
    const inner = (
      <>
        <g.icon size={big ? 22 : 20} strokeWidth={1.75} aria-hidden />
        <strong>
          {g.title}
          {g.isNew && <span className="game-new">New</span>}
        </strong>
        <span>{g.blurb}</span>
        <span className="game-meta">
          <MetaIcon size={13} strokeWidth={MetaIcon === Check ? 2 : 1.75} aria-hidden /> {metaText}
        </span>
      </>
    );
    return g.random ? (
      <button key={g.id} type="button" onClick={random} className={className}>{inner}</button>
    ) : (
      <Link key={g.id} to={g.to} className={className}>{inner}</Link>
    );
  };
  return (
    <div className="games">
      <div className="games-top">{games.slice(0, BIG).map((g) => tile(g, true))}</div>
      <div className="games-more">{games.slice(BIG).map((g) => tile(g, false))}</div>
    </div>
  );
}
