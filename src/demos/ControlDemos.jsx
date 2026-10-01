import { useEffect, useRef, useState } from 'react';

/* ---------- Editable output ---------- */

const draft = [
  'Hi Priya, thanks for joining our design review yesterday.',
  'Your notes on the checkout flow were very helpful, and we already changed the button order.',
  'Could you share the research file before Friday so we can plan the next test?',
];
const rewrites = [
  ['Hi Priya, great to see you at yesterday\'s design review!', 'Hi Priya — thank you for your time at the review.'],
  ['Your checkout feedback helped a lot; the new button order is already live in the prototype.', 'We used your checkout notes right away.'],
  ['Could you send the research file by Friday? It will help us plan the next test.', 'Please share the research file before Friday if you can.'],
];

export function EditableOutput() {
  const [lines, setLines] = useState(draft);
  const [history, setHistory] = useState([]);
  const [edited, setEdited] = useState(false);
  const turn = useRef([0, 0, 0]);

  const change = (i, text, byUser) => {
    setHistory((h) => [...h, lines]);
    setLines((ls) => ls.map((l, j) => (j === i ? text : l)));
    if (byUser) setEdited(true);
  };

  const rewrite = (i) => {
    const n = turn.current[i] % rewrites[i].length;
    turn.current[i] += 1;
    change(i, rewrites[i][n], false);
  };

  const undo = () => {
    setLines(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
  };

  return (
    <div className="demo-stack">
      <div className="row space-between">
        <span className="ai-badge">✨ {edited ? 'AI draft · edited by you' : 'AI draft'}</span>
        <button className="btn btn-ghost btn-sm" onClick={undo} disabled={!history.length}>↶ Undo</button>
      </div>
      <div className="editable-doc">
        {lines.map((line, i) => (
          <div key={i} className="editable-line">
            <textarea
              rows={2}
              value={line}
              aria-label={`Sentence ${i + 1}`}
              onFocus={() => setHistory((h) => (h[h.length - 1] === lines ? h : [...h, lines]))}
              onChange={(e) => {
                setLines((ls) => ls.map((l, j) => (j === i ? e.target.value : l)));
                setEdited(true);
              }}
            />
            <button className="btn btn-ghost btn-sm" onClick={() => rewrite(i)} title="Rewrite only this sentence">✨ Rewrite this</button>
          </div>
        ))}
      </div>
      <p className="demo-note">Type in any sentence, or rewrite just one part. The rest stays the same.</p>
    </div>
  );
}

/* ---------- Inline suggestion (ghost text) ---------- */

const phrases = [
  'Thanks for the feedback, I will update the design today.',
  'Hi team, here is the latest version of the onboarding flow.',
  'Can we move the design review to Friday afternoon?',
];

export function InlineSuggestion() {
  const [value, setValue] = useState('');
  const [dismissed, setDismissed] = useState(false);
  const [accepted, setAccepted] = useState(0);

  const match = value.length >= 2 && !dismissed ? phrases.find((p) => p.toLowerCase().startsWith(value.toLowerCase()) && p.length > value.length) : null;
  const ghost = match ? match.slice(value.length) : '';

  const accept = () => {
    setValue(value + ghost);
    setAccepted((n) => n + 1);
  };

  return (
    <div className="demo-stack">
      <p className="demo-muted">Try typing <kbd>Th</kbd>, <kbd>Hi</kbd> or <kbd>Can</kbd>…</p>
      <div className="ghost-field">
        <div className="ghost-layer" aria-hidden>
          <span className="ghost-hidden">{value}</span>
          <span className="ghost-text">{ghost}</span>
        </div>
        <input
          value={value}
          onChange={(e) => { setValue(e.target.value); setDismissed(false); }}
          onKeyDown={(e) => {
            if (e.key === 'Tab' && ghost) { e.preventDefault(); accept(); }
            if (e.key === 'Escape') setDismissed(true);
          }}
          placeholder="Write a message…"
          aria-label="Message"
          spellCheck={false}
        />
      </div>
      <div className="row">
        {ghost ? (
          <>
            <button className="btn btn-primary btn-sm" onClick={accept}>Accept <kbd>Tab</kbd></button>
            <button className="btn btn-ghost btn-sm" onClick={() => setDismissed(true)}>Ignore <kbd>Esc</kbd></button>
          </>
        ) : (
          <span className="demo-muted">{accepted ? `Accepted ${accepted} suggestion${accepted > 1 ? 's' : ''}.` : 'No suggestion right now.'}</span>
        )}
      </div>
      <p className="demo-note">The grey text is only an idea. Nothing changes until you accept it.</p>
    </div>
  );
}

/* ---------- Stop & undo ---------- */

const messyLayers = ['Rectangle 42', 'Group 7 copy', 'Frame 118', 'Ellipse 3', 'Text copy 2'];
const cleanLayers = ['Card / background', 'Header / nav', 'Screen / home', 'Avatar', 'Title'];

export function StopAndUndo() {
  const [layers, setLayers] = useState(messyLayers);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(null); // number of renamed layers
  const timer = useRef(null);
  const count = useRef(0);

  const start = () => {
    setDone(null);
    setRunning(true);
    count.current = 0;
    timer.current = setInterval(() => {
      const i = count.current;
      setLayers((ls) => ls.map((l, j) => (j === i ? cleanLayers[j] : l)));
      count.current += 1;
      if (count.current >= messyLayers.length) finish();
    }, 700);
  };

  const finish = () => {
    clearInterval(timer.current);
    setRunning(false);
    setDone(count.current);
  };

  const undo = () => {
    setLayers(messyLayers);
    setDone(null);
  };

  useEffect(() => () => clearInterval(timer.current), []);

  return (
    <div className="demo-stack">
      <ul className="layers">
        {layers.map((l, i) => (
          <li key={i} className={l === cleanLayers[i] ? 'layer-new' : ''}>
            <span aria-hidden>▢</span> {l}
            {running && count.current === i && <span className="layer-working">renaming…</span>}
          </li>
        ))}
      </ul>
      <div className="row">
        {running ? (
          <button className="btn btn-danger" onClick={finish}>■ Stop</button>
        ) : (
          <button className="btn btn-primary" onClick={start} disabled={done !== null}>✨ Rename layers with AI</button>
        )}
      </div>
      {done !== null && (
        <div className="toast" role="status">
          <span>Renamed {done} of {messyLayers.length} layers.</span>
          <button className="btn btn-ghost btn-sm" onClick={undo}>↶ Undo all</button>
        </div>
      )}
    </div>
  );
}
