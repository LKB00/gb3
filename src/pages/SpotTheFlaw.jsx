import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { hunts } from '../data/hunts';
import { games } from '../config/games';
import { clearRun, readHuntRun, readRun, saveRun, useHuntsDone } from '../progress';
import Hunt from '../components/Hunt';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTitle } from '../lib/useTitle';
import { revealEl } from '../lib/useReveal';

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
  // When the screen is done, bring its next step into view. On phones the bar is pinned,
  // so show the win line just above it; elsewhere show the bar itself.
  const nextRef = useRef(null);
  useEffect(() => {
    if (!over) return;
    const id = requestAnimationFrame(() => {
      const bar = nextRef.current;
      const pinned = bar && getComputedStyle(bar).position === 'sticky';
      revealEl(pinned ? bar.previousElementSibling : bar);
    });
    return () => cancelAnimationFrame(id);
  }, [over, scenario.id]);
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
        <p className="lead">Each AI screen hides a few mistakes. Tap every one you spot.</p>
      </header>
      {/* A small picker instead of 10 chips, so the screen itself comes first. */}
      <div className="hunt-pick">
        <button type="button" className="icon-btn" onClick={() => go(idx - 1)} disabled={idx === 0} aria-label="Previous screen">
          <ChevronLeft size={18} strokeWidth={1.75} aria-hidden />
        </button>
        <label className="hunt-pick-select">
          <span className="sr-only">Pick a screen</span>
          <select value={idx} onChange={(e) => go(Number(e.target.value))}>
            {hunts.map((h, i) => (
              <option key={h.id} value={i}>
                {i + 1}. {h.title}{huntsDone.includes(h.id) ? ' ✓' : ''}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="icon-btn" onClick={() => go(idx + 1)} disabled={last} aria-label="Next screen">
          <ChevronRight size={18} strokeWidth={1.75} aria-hidden />
        </button>
        <span className="hunt-pick-done small muted">{huntsDone.length}/{hunts.length} done</span>
      </div>
      <p className="hunt-brief">{scenario.brief}</p>
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
