import { ArrowLeft, ArrowRight, Check, RotateCcw, Star, TriangleAlert } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import MockFrame, { MockBlock, MockSlot } from '../mock/Mock';
import { markPassed, markPlayed, saveStars, useStars, XP } from '../progress';
import Burst, { XpPop } from './Burst';
import FlipCard from './FlipCard';
import { fx } from '../game/fx';
import { track } from '../game/track';
import Disagree from './Disagree';
import { useReveal } from '../lib/useReveal';

// Challenge ("Fix it"), built as a guided flow:
//   one decision at a time → instant feedback → fix mistakes → next step → summary.
// Why: showing every question at once, with feedback only after a "Check" button,
// made people unsure what to do first and which part of the preview they were changing.
// Feedback lines rotate by step so the praise doesn't feel canned.
const CHEERS = ['Nice pick!', 'Sharp eye!', 'That’s the one!'];
const OOPS = ['Not quite', 'So close', 'Easy to miss'];

export default function Lab({ id, lab, title, next }) {
  const decisions = lab.decisions;
  const total = decisions.length;
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [choice, setChoice] = useState({});
  const [tried, setTried] = useState({});
  const [finished, setFinished] = useState(false);
  // Star chimes are timed; stop them if the person leaves the page first.
  const chimes = useRef([]);
  useEffect(() => () => chimes.current.forEach(clearTimeout), []);
  const [skipped, setSkipped] = useState(false);
  const [gained, setGained] = useState(0);
  const savedStars = useStars();

  const d = decisions[step];
  const picked = choice[d.id];
  const pickedOpt = picked !== undefined ? d.options[picked] : undefined;
  const whyRef = useReveal(pickedOpt ? `${d.id}-${picked}` : null);
  // A won card: bring "Next missing card" into view (on desktop it sits below the fold).
  const endRef = useReveal(finished && !skipped ? 'won' : null);
  const best = (dec) => dec.options.findIndex((o) => o.ok);
  const mistakes = decisions.reduce((n, x) => n + (tried[x.id] || []).filter((k) => !x.options[k].ok).length, 0);
  const stars = mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1;

  const pick = (i) => {
    markPlayed();
    fx(d.options[i].ok ? 'right' : 'wrong');
    setChoice((c) => ({ ...c, [d.id]: i }));
    setTried((t) => ({ ...t, [d.id]: (t[d.id] || []).includes(i) ? t[d.id] : [...(t[d.id] || []), i] }));
  };

  const qRef = useRef(null);
  const goTo = (n, focus = false) => {
    setStep(n);
    setReached((r) => Math.max(r, n));
    // Keyboard players: the Next button disappears, so land on the new question.
    if (focus) requestAnimationFrame(() => qRef.current?.focus({ preventScroll: true }));
  };

  const advance = () => {
    if (step < total - 1) return goTo(step + 1, true);
    // A step changed to a wrong pick after it was passed: go back to it instead of finishing.
    const open = decisions.findIndex((x) => !x.options[choice[x.id]]?.ok);
    if (open >= 0) return goTo(open, true);
    setFinished(true);
    if (skipped) return;
    setGained(Math.max(0, stars - (savedStars[id] || 0)) * XP.star);
    fx('win');
    for (let n = 1; n <= stars; n++) chimes.current.push(setTimeout(() => fx('star', { n }), 450 + n * 160));
    track('Game finished', { game: 'fix-it', stars });
    saveStars(id, stars);
    markPassed(id);
  };

  const skip = () => {
    setChoice(Object.fromEntries(decisions.map((x) => [x.id, best(x)])));
    setSkipped(true);
    setFinished(true);
  };

  const restart = () => {
    setStep(0);
    setReached(0);
    setChoice({});
    setTried({});
    setFinished(false);
    setSkipped(false);
    setGained(0);
  };

  // Frame blocks + one slot per decision (slots not placed in the frame go at the end).
  const placed = new Set(lab.frame.filter((f) => f.slot).map((f) => f.slot));
  const layout = [...lab.frame, ...decisions.filter((x) => !placed.has(x.id)).map((x) => ({ slot: x.id }))];

  return (
    <div className={'lab' + (finished ? ' lab-finished' : '')}>
      <header className="lab-head">
        <p className="label">Fix it · your job</p>
        <p className="lab-goal">{lab.goal}</p>
        <ol className="lab-steps" aria-label="Steps">
          {decisions.map((x, n) => {
            const done = finished || (choice[x.id] === best(x) && n !== step);
            const current = !finished && n === step;
            const canGo = !finished && n <= reached;
            return (
              <li key={x.id} className={'lab-step' + (current ? ' is-current' : '') + (done ? ' is-done' : '')}>
                <button type="button" disabled={!canGo} onClick={() => goTo(n)} aria-current={current ? 'step' : undefined}>
                  <span className="lab-step-dot">{done && !current ? <Check size={11} strokeWidth={2.5} aria-hidden /> : n + 1}</span>
                  <span className="lab-step-label">{x.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </header>

      <div className="lab-preview">
        <p className="label">Your AI screen</p>
        <MockFrame title={title}>
          {layout.map((item, i) => {
            if (!item.slot) return <MockBlock key={i} b={item} />;
            const n = decisions.findIndex((x) => x.id === item.slot);
            const dec = decisions[n];
            const o = dec.options[choice[dec.id]];
            let state;
            if (!finished && n === step) state = o ? (o.ok ? 'good' : 'bad') : 'focus';
            return (
              <MockSlot
                key={i}
                blocks={o?.blocks}
                state={state}
                marker={!finished && (o || n === step) ? n + 1 : undefined}
                placeholder={n === step ? 'Your choice shows here' : `Step ${n + 1}`}
              />
            );
          })}
        </MockFrame>
      </div>

      <div className="lab-panel" aria-live="polite">
        {!finished ? (
          <>
            <h3 ref={qRef} tabIndex={-1} className="lab-q lab-q-step" aria-level="2" key={`q-${d.id}`}>{d.label}</h3>
            <div className="lab-options" key={`o-${d.id}`} role="radiogroup" aria-label={d.label}>
              {d.options.map((o, i) => {
                const on = picked === i;
                const wasWrong = !on && (tried[d.id] || []).includes(i) && !o.ok;
                return (
                  <button
                    key={i}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    className={'lab-opt' + (on ? (o.ok ? ' lab-opt-good' : ' lab-opt-bad') : '') + (wasWrong ? ' lab-opt-tried' : '')}
                    onClick={() => pick(i)}
                  >
                    <span className="lab-radio" aria-hidden />
                    <span>{o.label}</span>
                  </button>
                );
              })}
            </div>

            {!pickedOpt && <p className="lab-hint">Tap an option to see it on your screen. No misses wins all 3 stars.</p>}

            {pickedOpt && (
              <div ref={whyRef} className={'lab-why ' + (pickedOpt.ok ? 'lab-why-good' : 'lab-why-bad')}>
                <strong>
                  {pickedOpt.ok ? <Check size={14} strokeWidth={2.25} aria-hidden /> : <TriangleAlert size={14} strokeWidth={2} aria-hidden />}
                  {pickedOpt.ok ? CHEERS[step % CHEERS.length] : OOPS[step % OOPS.length]}
                </strong>
                <span>{pickedOpt.why}</span>
                {!pickedOpt.ok && <span className="lab-why-try">Pick another one. No harm done.</span>}
                <Disagree where={`Fix it · ${id} · ${d.label}`} detail={`“${pickedOpt.label}” was marked ${pickedOpt.ok ? 'good' : 'a mistake'}: ${pickedOpt.why}`} />
              </div>
            )}

            <div className="lab-nav">
              {step > 0 && (
                <button type="button" className="btn btn-ghost" onClick={() => goTo(step - 1)}>
                  <ArrowLeft size={14} strokeWidth={1.75} aria-hidden /> Back
                </button>
              )}
              {pickedOpt?.ok && (
                <button type="button" className="btn btn-primary" onClick={advance}>
                  {step < total - 1 ? 'Next step' : 'Collect my card'} <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
                </button>
              )}
              <button type="button" className="lab-skip" onClick={skip}>Show answers, skip the card</button>
            </div>
          </>
        ) : (
          <>
            {!skipped && <Burst count={stars === 3 ? 26 : 16} />}
            <p className="lab-count">{skipped ? 'No worries' : 'New card!'}</p>
            <h3 className="lab-q" aria-level="2">
              {skipped ? 'Here are the best picks.' : stars === 3 ? 'Perfect run!' : stars === 2 ? 'Nice save!' : 'You got there!'}
              {gained > 0 && <XpPop amount={gained} />}
            </h3>
            {!skipped && (
              <p className="lab-stars" aria-label={`${stars} of 3 stars`}>
                {[1, 2, 3].map((n) => (
                  <Star key={n} size={22} strokeWidth={1.5} className={n <= stars ? 'is-on' : ''} style={{ animationDelay: `${n * 120}ms` }} aria-hidden />
                ))}
                <span>{mistakes === 0 ? 'Flawless. Not a single miss.' : mistakes === 1 ? 'Just 1 miss. So close to perfect!' : `${mistakes} misses, and you still cracked it.`}</span>
              </p>
            )}
            {!skipped && <FlipCard id={id} stars={stars} />}
            {/* The one next step, right under the win (pinned near the thumb on phones). */}
            <div className="lab-nav lab-end" ref={endRef}>
              {next}
            </div>
            {/* Replay sits with its reason, quieter than the next step. */}
            <p className="lab-again">
              {skipped ? <span>No card this time.</span> : stars < 3 ? <span>Every miss taught you a trick.</span> : null}
              <button type="button" className="btn btn-ghost btn-sm" onClick={restart}>
                <RotateCcw size={13} strokeWidth={1.75} aria-hidden /> {skipped ? 'Play again to win it' : stars < 3 ? 'Play again for 3 stars' : 'Play again'}
              </button>
            </p>
            <p className="label lab-sum-title">{skipped ? 'The best picks' : 'Your picks'}</p>
            <ul className="lab-summary">
              {decisions.map((x) => {
                const fixed = !skipped && (tried[x.id] || [])[0] !== best(x);
                return (
                  <li key={x.id}>
                    <span className={'lab-sum-icon' + (fixed ? ' is-fixed' : '')}>
                      {fixed ? <RotateCcw size={12} strokeWidth={2} aria-hidden /> : <Check size={12} strokeWidth={2.5} aria-hidden />}
                    </span>
                    <span>
                      <span className="lab-sum-q">{x.label}</span>
                      <strong>{x.options[best(x)].label}</strong>
                      {fixed && <span className="lab-sum-note">Fixed after a miss</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
