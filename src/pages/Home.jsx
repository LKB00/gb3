import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { patterns } from '../data/patterns';
import { usePassed, useXP } from '../progress';
import ThisOrThat from '../components/ThisOrThat';
import { DailyBanner, GameTiles } from './Play';
import { useTitle } from '../useTitle';

// Home = play in one second. The first game starts right here, no reading needed.
export default function Home() {
  useTitle(null);
  const passed = usePassed();
  const { xp, level } = useXP();

  return (
    <div className="page page-wide">
      <header className="home-hero">
        <p className="eyebrow">A playground for AI interaction design</p>
        <h1 className="display display-xl">Can you spot good AI design?</h1>
        <p className="lead">Quick games about the patterns behind ChatGPT, Copilot, Perplexity and more. Play a round right now.</p>
        {xp > 0 && (
          <p className="home-me">
            You’re a <strong>{level.name}</strong> · {xp} XP · {passed.length}/{patterns.length} cards
          </p>
        )}
      </header>

      <section className="home-game" aria-label="This or That, quick round">
        <ThisOrThat rounds={5} />
      </section>

      <section className="block">
        <DailyBanner />
      </section>

      <section className="block">
        <div className="row space-between">
          <h2>More games</h2>
          <Link to="/play" className="text-link">Your level and badges <ArrowRight size={14} strokeWidth={1.75} aria-hidden /></Link>
        </div>
        <GameTiles />
      </section>
    </div>
  );
}
