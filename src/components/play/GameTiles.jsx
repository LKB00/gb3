import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { games } from '../../config/games';
import { useRandomChallenge } from '../../game/useRandomChallenge';
import { useGameStats, useHuntsDone, usePassed } from '../../progress';

// One colourful tile per game. The list lives in config/games.js.
export default function GameTiles() {
  const random = useRandomChallenge();
  const progress = { stats: useGameStats(), passed: usePassed(), huntsDone: useHuntsDone() };
  return (
    <div className="games">
      {games.map((g) => {
        const [MetaIcon, metaText] = g.meta(progress);
        const className = `game ${g.tone}` + (g.wide ? ' game-wide' : '');
        const inner = (
          <>
            {g.isNew && <span className="game-new">New</span>}
            <g.icon size={22} strokeWidth={1.75} aria-hidden />
            <strong>{g.title}</strong>
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
      })}
    </div>
  );
}
