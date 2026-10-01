import { useState } from 'react';
import { Link } from 'react-router-dom';
import MockFrame, { MockBlock } from '../mock/Mock';
import { getPattern } from '../data/patterns';

// Mistake Hunt: click the parts of the screen that are wrong.
export default function Hunt({ scenario }) {
  const [found, setFound] = useState([]); // block indexes, in the order found
  const [fine, setFine] = useState(null); // last "this part is fine" click
  const [revealed, setRevealed] = useState(false);

  const mistakes = scenario.blocks.map((b, i) => (b.mistake ? i : -1)).filter((i) => i >= 0);
  const done = found.length === mistakes.length;
  const shown = revealed ? [...found, ...mistakes.filter((i) => !found.includes(i))] : found;

  const click = (i) => {
    const b = scenario.blocks[i];
    if (b.mistake) {
      if (!found.includes(i)) setFound((f) => [...f, i]);
      setFine(null);
    } else {
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
                pin={fine === i ? '✓ This part is fine' : undefined}
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
          <strong>{found.length} / {mistakes.length} found</strong>
        </div>

        {shown.length === 0 && (
          <p className="demo-muted hunt-hint">👆 Tap any part of the screen that looks wrong.</p>
        )}

        <ol className="hunt-list">
          {shown.map((i, n) => {
            const m = scenario.blocks[i].mistake;
            const p = getPattern(m.pattern);
            return (
              <li key={i} className={found.includes(i) ? 'hunt-item-found' : 'hunt-item-missed'}>
                <span className="hunt-num">{n + 1}</span>
                <div>
                  <p>{m.text}</p>
                  <Link to={`/patterns/${p.id}`} className="hunt-fix">Fix: {p.title} →</Link>
                </div>
              </li>
            );
          })}
        </ol>

        {done && !revealed && <p className="demo-ok">🎉 You found every mistake!</p>}
        {!done && !revealed && (
          <button className="btn btn-ghost btn-sm" onClick={() => setRevealed(true)}>Show the ones I missed</button>
        )}
      </div>
    </div>
  );
}
