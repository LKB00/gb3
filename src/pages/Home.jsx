import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Zap } from 'lucide-react';
import { getPattern, patterns } from '../data/patterns';
import { useDaily, usePassed, useStreak, useXP } from '../progress';
import { playerName } from '../game/challenge';
import { dayKey } from '../lib/dates';
import ThisOrThat from '../components/ThisOrThat';
import DailyBanner from '../components/play/DailyBanner';
import GameTiles from '../components/play/GameTiles';
import { useTitle } from '../lib/useTitle';

// Home = play in one second. The first game starts right here, no reading needed.
// Returning players get a short hello and today's Daily first.
export default function Home() {
  useTitle(null);
  const passed = usePassed();
  const { xp, level } = useXP();
  const { streak, days } = useStreak();
  const daily = useDaily();
  // Decided once per visit, so the first answer of a new player doesn't reshuffle the page mid-game.
  const [back] = useState(() => xp > 0 || Object.keys(days).length > 0);
  const dailyDone = !!daily[dayKey()];
  const name = playerName();

  // The score screen's next step: today's Daily first, then a quick game, then a card to win.
  const next = ({ missed, last }) => {
    const id = missed.find((m) => !passed.includes(m)) || missed[0] || last;
    const p = getPattern(id);
    return (
      <>
        {dailyDone ? (
          <Link to="/play/speed" className="btn btn-primary btn-lg"><Zap size={15} strokeWidth={2} aria-hidden /> Try a 60-second Speed round</Link>
        ) : (
          <Link to="/play/daily" className="btn btn-primary btn-lg"><CalendarDays size={15} strokeWidth={1.75} aria-hidden /> Play today’s Daily</Link>
        )}
        {p && (
          <Link to={`/patterns/${p.id}`} className="btn btn-ghost btn-lg">
            {passed.includes(p.id) ? `See the “${p.title}” card` : `Win the “${p.title}” card`}
          </Link>
        )}
      </>
    );
  };

  const me = xp > 0 && (
    <p className="home-me">
      You’re {/^[aeiou]/i.test(level.name) ? 'an' : 'a'} <strong>{level.name}</strong> · {xp} XP · {passed.length}/{patterns.length} cards{streak > 0 && ` · 🔥 ${streak}-day streak`} · <Link to="/play/card">See your player card</Link>
    </p>
  );

  return (
    <div className="page page-wide">
      {back ? (
        <header className="home-hero is-back">
          <h1 className="home-back-title">Welcome back{name ? `, ${name}` : ''}! Ready to spot some bots?</h1>
          {me}
        </header>
      ) : (
        <header className="home-hero">
          <p className="eyebrow">Quick games about AI design</p>
          <h1 className="display display-xl">Can you spot good AI design?</h1>
          <p className="lead">Two AI screens, like ChatGPT or Copilot. One is better. Tap it below.</p>
          {me}
        </header>
      )}

      {back && (
        <section className="home-daily">
          <DailyBanner />
        </section>
      )}

      <section className="home-game" aria-label="This or That, quick round">
        <ThisOrThat rounds={5} next={next} />
      </section>

      {!back && (
        <section className="block">
          <DailyBanner />
        </section>
      )}

      <section className="block">
        <div className="row space-between">
          <h2>More games</h2>
          <Link to="/play" className="text-link">Your level and badges <ArrowRight size={14} strokeWidth={1.75} aria-hidden /></Link>
        </div>
        <GameTiles skip={['this-or-that']} />
      </section>
    </div>
  );
}
