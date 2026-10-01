import { ArrowLeft, ArrowRight, Check, RotateCcw, Star, TriangleAlert } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import MockFrame, { MockBlock, MockSlot } from '../mock/Mock';
import { markPassed, markPlayed, saveStars, useStars, XP } from '../progress';
import Burst, { XpPop } from './Burst';
import FlipCard from './FlipCard';
import { fx } from '../game/fx';
import { track } from '../game/track';
import Disagree from './Disagree';

// Challenge ("Fix it"), built as a guided flow:
//   one decision at a time → instant feedback → fix mistakes → next step → summary.
// Why: showing every question at once, with feedback only after a "Check" button,
// made people unsure what to do first and which part of the preview they were changing.
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
  const best = (dec) => dec.options.findIndex((o) => o.ok);
  const mistakes = decisions.reduce((n, x) => n + (tried[x.id] || []).filter((k) => !x.options[k].ok).length, 0);
  const stars = mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1;

  const pick = (i) => {
    markPlayed();
    fx(d.options[i].ok ? 'right' : 'wrong');
    setChoice((c) => ({ ...c, [d.id]: i }));
    setTried((t) => ({ ...t, [d.id]: (t[d.id] || []).includes(i) ? t[d.id] : [...(t[d.id] || []), i] }));
  };

  const goTo = (n) => {
    setStep(n);
    setReached((r) => Math.max(r, n));
  };

  const advance = () => {
    if (step < total - 1) return goTo(step + 1);
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
        <p className="label">The brief</p>
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
        <p className="label">Live preview</p>
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
            <h3 className="lab-q lab-q-step" aria-level="2" key={`q-${d.id}`}>{d.label}</h3>
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

            {!pickedOpt && <p className="lab-hint">Pick one. You’ll see it in the preview and get feedback right away.</p>}

            {pickedOpt && (
              <div className={'lab-why ' + (pickedOpt.ok ? 'lab-why-good' : 'lab-why-bad')}>
                <strong>
                  {pickedOpt.ok ? <Check size={14} strokeWidth={2.25} aria-hidden /> : <TriangleAlert size={14} strokeWidth={2} aria-hidden />}
                  {pickedOpt.ok ? 'Good choice' : 'Common mistake'}
                </strong>
                <span>{pickedOpt.why}</span>
                {!pickedOpt.ok && <span className="lab-why-try">Try another option.</span>}
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
                  {step < total - 1 ? 'Next step' : 'Finish'} <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
                </button>
              )}
              <button type="button" className="lab-skip" onClick={skip}>Reveal the answer (no card)</button>
            </div>
          </>
        ) : (
          <>
            {!skipped && <Burst count={stars === 3 ? 26 : 16} />}
            <p className="lab-count">{skipped ? 'The answer' : 'Card collected'}</p>
            <h3 className="lab-q" aria-level="2">
              {skipped ? 'Here’s the winning design.' : stars === 3 ? 'Perfect run!' : stars === 2 ? 'Nice save!' : 'Got there!'}
              {gained > 0 && <XpPop amount={gained} />}
            </h3>
            {!skipped && (
              <p className="lab-stars" aria-label={`${stars} of 3 stars`}>
                {[1, 2, 3].map((n) => (
                  <Star key={n} size={22} strokeWidth={1.5} className={n <= stars ? 'is-on' : ''} style={{ animationDelay: `${n * 120}ms` }} aria-hidden />
                ))}
                <span>{mistakes === 0 ? 'No mistakes' : `${mistakes} mistake${mistakes > 1 ? 's' : ''} fixed`}</span>
              </p>
            )}
            {!skipped && <FlipCard id={id} stars={stars} />}
            {skipped && <p className="lab-hint">No card this time. Play again to collect it.</p>}
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
                      {fixed && <span className="lab-sum-note">Fixed after a slip</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="lab-nav">
              {next}
              <button type="button" className="btn btn-ghost" onClick={restart}>
                <RotateCcw size={14} strokeWidth={1.75} aria-hidden /> Try again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
