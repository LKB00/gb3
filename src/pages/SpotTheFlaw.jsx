import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { hunts } from '../data/hunts';
import { games } from '../config/games';
import { clearRun, readHuntRun, readRun, saveRun, useHuntsDone } from '../progress';
import Hunt from '../components/Hunt';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTitle } from '../lib/useTitle';
import { useReveal } from '../lib/useReveal';

// The game after this one on the Play page (skipping tiles without a page of their own).
const NEXT_GAME = (() => {
  const k = games.findIndex((g) => g.id === 'spot-the-flaw');
  return [...games.slice(k + 1), ...games.slice(0, k)].find((g) => g.to);
})();

// A finished screen starts fresh next time you open it (its XP is already saved).
function leave(scenario) {
  const run = readHuntRun(scenario);
  const mistakes = scenario.blocks.filter((b) => b.mistake).length;
  if (run && (run.revealed || run.found.length === mistakes)) clearRun('hunt:' + scenario.id);
}

// Spot the flaw: real-looking screens with hidden mistakes. Opens on the screen you were on
// (this tab), else on the first unfinished one.
export default function SpotTheFlaw() {
  useTitle('Spot the flaw');
  const huntsDone = useHuntsDone();
  const [idx, setIdx] = useState(() => {
    const k = hunts.findIndex((h) => h.id === readRun('spot')?.screen);
    return k >= 0 ? k : Math.max(0, hunts.findIndex((h) => !huntsDone.includes(h.id)));
  });
  const [over, setOver] = useState(false);
  const scenario = hunts[idx];
  const last = idx === hunts.length - 1;
  // When the screen is done, bring its next step into view (it sits under the win line).
  const nextRef = useReveal(over ? scenario.id : null);
  useEffect(() => {
    saveRun('spot', { screen: scenario.id });
  }, [scenario.id]);

  const go = (i) => {
    if (i === idx) return;
    leave(scenario);
    setOver(false);
    setIdx(i);
  };
  const next = () => {
    go(idx + 1);
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: calm ? 'instant' : 'smooth' });
  };

  return (
    <div className="page page-wide">
      <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: 'Spot the flaw' }]} />
      <header className="page-head page-head-tight">
        <h1 className="display">Spot the flaw</h1>
        <p className="lead">{scenario.brief}</p>
      </header>
      <div className="chips hunt-tabs" role="tablist" aria-label="Screens">
        {hunts.map((h, i) => (
          <button key={h.id} role="tab" aria-selected={i === idx} className={'chip' + (i === idx ? ' chip-on' : '')} onClick={() => go(i)}>
            {huntsDone.includes(h.id) && <Check size={12} strokeWidth={2.5} aria-label="Done" />}
            {h.title}
          </button>
        ))}
      </div>
      <div className="view">
        <Hunt key={scenario.id} scenario={scenario} onOver={setOver}>
          {over && (
            <div ref={nextRef} className="lab-nav hunt-next">
              {!last ? (
                <button className="btn btn-primary btn-lg" onClick={next}>
                  Next screen <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
                </button>
              ) : (
                NEXT_GAME && (
                  <Link to={NEXT_GAME.to} className="btn btn-primary btn-lg" onClick={() => { leave(scenario); clearRun('spot'); }}>
                    Next game: {NEXT_GAME.title} <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
                  </Link>
                )
              )}
            </div>
          )}
        </Hunt>
        {!over && !last && (
          <div className="actions">
            <button className="btn btn-ghost" onClick={next}>
              Skip to the next screen <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
