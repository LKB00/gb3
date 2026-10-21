import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import DailyBanner from '../components/play/DailyBanner';
import GameTiles from '../components/play/GameTiles';
import Badges from '../components/play/Badges';
import { ProgressLine } from '../components/Today';
import { useTitle } from '../lib/useTitle';

// The Play hub, in order of what matters: today's Daily (the one big "start here"),
// one quiet line of progress, then every game. Detailed stats live on the Me page.
// To add a game, see src/config/games.js.
export default function Play() {
  useTitle('Play');
  return (
    <div className="page page-wide">
      <header className="page-head page-head-tight">
        <h1 className="display">Play</h1>
        <p className="lead">Pick a game, any game. Win XP, collect cards and level up.</p>
      </header>
      <div className="play-grid">
        <DailyBanner />
        <ProgressLine />
        <GameTiles />
      </div>
      <section className="block play-badges">
        <div className="section-head">
          <h2>Badges</h2>
          <p className="section-sub">Collect every card in a group to win its badge. Get 3 stars on each to turn it gold.</p>
        </div>
        <Badges row />
      </section>
      <section className="block">
        <Link to="/me" className="text-link">Settings, install and backup live on your Me page <ArrowRight size={14} strokeWidth={1.75} aria-hidden /></Link>
      </section>
    </div>
  );
}
