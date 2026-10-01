import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import LevelCard from '../components/play/LevelCard';
import DailyBanner from '../components/play/DailyBanner';
import GameTiles from '../components/play/GameTiles';
import Badges from '../components/play/Badges';
import { TodayCard } from '../components/Today';
import { useTitle } from '../lib/useTitle';

// The Play hub: level, today's goal, the Daily, then every game.
// To add a game, see src/config/games.js.
export default function Play() {
  useTitle('Play');
  return (
    <div className="page page-wide">
      <header className="page-head page-head-tight">
        <h1 className="display">Play</h1>
        <p className="lead">Pick a game. Earn XP, collect pattern cards, level up.</p>
      </header>
      <div className="play-grid">
        <LevelCard />
        <TodayCard />
        <DailyBanner />
        <GameTiles />
      </div>
      <section className="block hide-phone">
        <div className="section-head">
          <h2>Badges</h2>
          <p className="section-sub">Collect every card in a group to win its badge. All 3 stars on each makes it gold.</p>
        </div>
        <Badges />
      </section>
      <section className="block">
        <Link to="/me" className="text-link">Settings, app install and backup are on your Me page <ArrowRight size={14} strokeWidth={1.75} aria-hidden /></Link>
      </section>
    </div>
  );
}
