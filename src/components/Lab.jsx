import { useState } from 'react';
import MockFrame, { MockBlock, MockSlot } from '../mock/Mock';
import { markPassed } from '../progress';

// Design Lab: people make design decisions, see a live preview,
// then "Check my design" marks each part as good or a common mistake.
export default function Lab({ id, lab, title }) {
  const [choice, setChoice] = useState({});
  const [checked, setChecked] = useState(false);

  const decisions = lab.decisions;
  const allPicked = decisions.every((d) => choice[d.id] !== undefined);
  const score = decisions.filter((d) => d.options[choice[d.id]]?.ok).length;
  const perfect = score === decisions.length;
  const indexOf = (dId) => decisions.findIndex((d) => d.id === dId);

  const pick = (dId, i) => {
    setChoice((c) => ({ ...c, [dId]: i }));
    setChecked(false);
  };

  const runCheck = () => {
    setChecked(true);
    if (perfect) markPassed(id);
  };

  const showBest = () => {
    setChoice(Object.fromEntries(decisions.map((d) => [d.id, d.options.findIndex((o) => o.ok)])));
    setChecked(true);
  };

  // Frame blocks + one slot per decision (slots not placed in the frame go at the end).
  const placed = new Set(lab.frame.filter((f) => f.slot).map((f) => f.slot));
  const layout = [...lab.frame, ...decisions.filter((d) => !placed.has(d.id)).map((d) => ({ slot: d.id }))];

  return (
    <div className="lab">
      <div className="lab-controls">
        <p className="lab-goal">
          <span className="lab-goal-tag">Your task</span>
          {lab.goal}
        </p>

        {decisions.map((d, n) => {
          const picked = choice[d.id];
          return (
            <fieldset key={d.id} className="lab-decision">
              <legend>
                <span className="lab-num">{n + 1}</span>
                {d.label}
              </legend>
              <div className="lab-options" role="radiogroup" aria-label={d.label}>
                {d.options.map((o, i) => {
                  const on = picked === i;
                  const verdict = checked && on ? (o.ok ? ' lab-opt-good' : ' lab-opt-bad') : '';
                  return (
                    <button
                      key={i}
                      role="radio"
                      aria-checked={on}
                      className={'lab-opt' + (on ? ' lab-opt-on' : '') + verdict}
                      onClick={() => pick(d.id, i)}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
              {checked && picked !== undefined && (
                <p className={'lab-why ' + (d.options[picked].ok ? 'lab-why-good' : 'lab-why-bad')}>
                  {d.options[picked].ok ? (
                    <strong>✓ Good choice. </strong>
                  ) : (
                    <strong>⚠ Common mistake. </strong>
                  )}
                  {d.options[picked].why}
                </p>
              )}
            </fieldset>
          );
        })}

        <div className="lab-actions">
          <button className="btn btn-primary" onClick={runCheck} disabled={!allPicked}>
            {allPicked ? 'Check my design' : `Pick all ${decisions.length} to check`}
          </button>
          <button className="btn btn-ghost" onClick={showBest}>Show best design</button>
          {Object.keys(choice).length > 0 && (
            <button className="btn btn-ghost" onClick={() => { setChoice({}); setChecked(false); }}>↺ Start over</button>
          )}
        </div>

        {checked && (
          <div className={'lab-score ' + (perfect ? 'lab-score-good' : 'lab-score-bad')} role="status">
            <span className="lab-score-num">{score}/{decisions.length}</span>
            {perfect
              ? 'Great design! No common mistakes. Lab passed ✓'
              : `${decisions.length - score} common mistake${decisions.length - score > 1 ? 's' : ''} found. Look at the red parts and try again.`}
          </div>
        )}
      </div>

      <div className="lab-preview">
        <p className="lab-preview-label">Live preview</p>
        <MockFrame title={title}>
          {layout.map((item, i) => {
            if (!item.slot) return <MockBlock key={i} b={item} />;
            const d = decisions[indexOf(item.slot)];
            const o = d.options[choice[d.id]];
            const state = checked && o ? (o.ok ? 'good' : 'bad') : o ? 'on' : undefined;
            return (
              <MockSlot
                key={i}
                blocks={o?.blocks}
                state={state}
                marker={o ? indexOf(item.slot) + 1 : undefined}
                placeholder={`${indexOf(item.slot) + 1} · ${d.label}`}
              />
            );
          })}
        </MockFrame>
      </div>
    </div>
  );
}
