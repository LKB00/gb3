import { ArrowRight, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import MockFrame, { MockBlock } from '../mock/Mock';
import { getPattern } from '../data/patterns';
import { markHuntDone, markPlayed, readHuntRun, saveRun, useHuntsDone, XP } from '../progress';
import { PeekLink } from './PatternPeek';
import Burst, { XpPop } from './Burst';
import { fx } from '../game/fx';
import { track } from '../game/track';
import { revealEl } from '../lib/useReveal';

// Spot the flaw: tap the parts of the screen that are wrong.
// What you found is kept for this tab (run 'hunt:<id>'), so a link, Back or a refresh keeps it.
// onOver(true) tells the page the screen is done (all found, or answers shown).
// children (the page's next step) sit at the end of the side column, right under the result.
// Optional, for screens that are not in data/hunts.js (Screen of the week):
//   onDone(id) saves the finish instead of hunts-done, doneBefore says if its XP was already won,
//   game is the name sent with "Game finished".
export default function Hunt({ scenario, onOver, children, onDone, doneBefore: doneProp, game = 'spot-the-flaw' }) {
  const [saved] = useState(() => readHuntRun(scenario));
  const [found, setFound] = useState(saved?.found ?? []); // block indexes, in the order found
  const [fine, setFine] = useState(null); // last "this part is fine" click
  const [revealed, setRevealed] = useState(saved?.revealed ?? false);
  const doneBefore = useHuntsDone();
  const [wasDone] = useState(() => doneProp ?? doneBefore.includes(scenario.id));
  const finish = useRef(onDone ?? markHuntDone);
  finish.current = onDone ?? markHuntDone;
  useEffect(() => {
    saveRun('hunt:' + scenario.id, { found, revealed });
  }, [scenario.id, found, revealed]);

  const mistakes = scenario.blocks.map((b, i) => (b.mistake ? i : -1)).filter((i) => i >= 0);
  const done = found.length === mistakes.length;
  useEffect(() => {
    onOver?.(done || revealed);
  }, [onOver, done, revealed]);

  // Finding every mistake yourself (without revealing) completes the screen.
  // Counted as a finished game only when the last find happens now, not when a finished screen is opened again.
  const doneAtOpen = useRef(done);
  useEffect(() => {
    if (done && !revealed) finish.current(scenario.id);
    if (done && !revealed && !doneAtOpen.current) {
      doneAtOpen.current = true;
      track('Game finished', { game });
    }
  }, [done, revealed, scenario.id, game]);
  const shown = revealed ? [...found, ...mistakes.filter((i) => !found.includes(i))] : found;
  // On a phone the list sits below the screen: show the newest mistake's note after each find.
  const listRef = useRef(null);
  const winRef = useRef(null);
  useEffect(() => {
    // The last find shows the win line (and XP) under the list: show that instead.
    if (found.length) requestAnimationFrame(() => revealEl(done ? winRef.current : listRef.current?.lastElementChild));
  }, [found.length, done]);

  const click = (i) => {
    if (done || revealed) return; // the hunt is over: taps change nothing
    const b = scenario.blocks[i];
    if (b.mistake) {
      if (!found.includes(i)) {
        setFound((f) => [...f, i]);
        markPlayed();
        fx(found.length + 1 === mistakes.length ? 'win' : 'right');
      }
      setFine(null);
    } else {
      fx('wrong');
      setFine(i);
    }
  };

  return (
    <div className="hunt">
      <div className="hunt-screen">
        <MockFrame title={scenario.app}>
          {scenario.blocks.map((b, i) => {
            const n = shown.indexOf(i);
            const state = n >= 0 ? (found.includes(i) ? 'found' : 'missed') : fine === i ? 'fine' : undefined;
            return (
              <MockBlock
                key={i}
                b={b}
                state={state}
                marker={n >= 0 ? n + 1 : undefined}
                pin={fine === i ? 'This part is fine. Keep hunting!' : undefined}
                onClick={() => click(i)}
                label={`Screen part ${i + 1}`}
              />
            );
          })}
        </MockFrame>
      </div>

      <div className="hunt-side">
        <div className="hunt-progress" aria-label={`Found ${found.length} of ${mistakes.length} mistakes`}>
          {mistakes.map((_, i) => (
            <span key={i} className={'hunt-dot' + (i < found.length ? ' hunt-dot-on' : '')} />
          ))}
          {/* The page lead says what to do; this line is the score, so no second how-to line here. */}
          <strong>{found.length} of {mistakes.length} mistakes found</strong>
        </div>

        {revealed && <p className="demo-muted hunt-hint">No worries. Here they all are. Find them yourself next time for XP.</p>}

        <ol className="hunt-list" ref={listRef}>
          {shown.map((i, n) => {
            const m = scenario.blocks[i].mistake;
            const p = getPattern(m.pattern);
            return (
              <li key={i} className={found.includes(i) ? 'hunt-item-found' : 'hunt-item-missed'}>
                <span className="hunt-num">{n + 1}</span>
                <div>
                  <p>{m.text}</p>
                  <PeekLink id={p.id} className="hunt-fix">See the fix: {p.title} <ArrowRight size={13} strokeWidth={1.75} aria-hidden /></PeekLink>
                </div>
              </li>
            );
          })}
        </ol>

        {done && !revealed && (
          <p ref={winRef} className="demo-ok hunt-win">
            <Burst />
            <Check size={14} strokeWidth={2} aria-hidden /> Sharp eyes! You found every mistake.
            {!wasDone && <XpPop amount={XP.hunt} />}
          </p>
        )}
        {!done && !revealed && (
          <button className="btn btn-ghost btn-sm" onClick={() => setRevealed(true)}>Show me the answers</button>
        )}
        {children}
      </div>
    </div>
  );
}
