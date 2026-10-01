import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';

/* ---------- Autonomy levels (L1–L5) ---------- */

// Levels follow the widely used "user role" framing for agent autonomy:
// operator → collaborator → consultant → approver → observer.
const levels = [
  {
    n: 1,
    role: 'Operator',
    you: 'You do the task. The AI helps only when you ask.',
    ai: 'Suggests a reply when you click “Help me write”.',
    risk: 'Lowest risk. Lowest time saved.',
  },
  {
    n: 2,
    role: 'Collaborator',
    you: 'You and the AI work side by side.',
    ai: 'Drafts replies as you type; you edit and send.',
    risk: 'Low risk. Every send is still yours.',
  },
  {
    n: 3,
    role: 'Consultant',
    you: 'The AI leads; you give direction and answer questions.',
    ai: 'Drafts all replies and asks you about unclear ones.',
    risk: 'Medium risk. Check its questions carefully.',
  },
  {
    n: 4,
    role: 'Approver',
    you: 'The AI does the work; you approve important steps.',
    ai: 'Sends routine replies, asks before anything unusual.',
    risk: 'Higher risk. Needs clear approval moments.',
  },
  {
    n: 5,
    role: 'Observer',
    you: 'The AI works alone; you watch the log.',
    ai: 'Handles your inbox end to end and reports back.',
    risk: 'Highest risk. Needs a log, undo and an off switch.',
  },
];

export function AutonomyLevels() {
  const [n, setN] = useState(2);
  const l = levels[n - 1];

  return (
    <div className="demo-stack">
      <p className="demo-muted">An email agent at five levels of autonomy. Move the dial.</p>
      <div className="autonomy">
        <input
          type="range"
          id="autonomy-level"
          min="1"
          max="5"
          step="1"
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          aria-label="Autonomy level"
          aria-valuetext={`Level ${n}: ${l.role}`}
        />
        <div className="autonomy-scale" aria-hidden>
          {levels.map((x) => (
            <button key={x.n} className={x.n === n ? 'on' : ''} onClick={() => setN(x.n)} tabIndex={-1}>
              L{x.n}
            </button>
          ))}
        </div>
      </div>
      <dl className="autonomy-card">
        <dt>Your role</dt>
        <dd><strong>{l.role}</strong> · {l.you}</dd>
        <dt>The agent</dt>
        <dd>{l.ai}</dd>
        <dt>Risk</dt>
        <dd>{l.risk}</dd>
      </dl>
      <p className="demo-note">Good products let people pick the level per task, and start low.</p>
    </div>
  );
}

/* ---------- Pause & redirect ---------- */

const all = ['Acme Corp (USA)', 'Brightly (India)', 'Northwind (UK)', 'Kite Labs (India)', 'Orbit (Germany)', 'Sutra AI (India)', 'Lumen (USA)', 'Tara Systems (India)'];

export function PauseRedirect() {
  const [found, setFound] = useState([]);
  const [state, setState] = useState('idle'); // idle | running | paused | done
  const [rule, setRule] = useState('');
  const [applied, setApplied] = useState('');
  const timer = useRef(null);
  const idx = useRef(0);

  const tick = (filter) => {
    timer.current = setInterval(() => {
      const next = all[idx.current];
      idx.current += 1;
      if (!next) {
        clearInterval(timer.current);
        setState('done');
        return;
      }
      if (!filter || next.includes(filter)) setFound((f) => [...f, next]);
    }, 700);
  };

  const start = () => {
    idx.current = 0;
    setFound([]);
    setApplied('');
    setState('running');
    tick('');
  };
  const pause = () => {
    clearInterval(timer.current);
    setState('paused');
  };
  const resume = () => {
    const filter = rule.toLowerCase().includes('india') ? 'India' : '';
    setApplied(filter ? 'Only companies in India' : '');
    if (filter) setFound((f) => f.filter((x) => x.includes(filter)));
    setState('running');
    tick(filter);
  };

  useEffect(() => () => clearInterval(timer.current), []);

  return (
    <div className="demo-stack">
      <div className="bubble bubble-user">Find competitors for our design tool.</div>
      {state !== 'idle' && (
        <div className="bubble bubble-ai">
          <p>
            {state === 'running' && 'Searching…'}
            {state === 'paused' && 'Paused. Nothing is lost.'}
            {state === 'done' && 'Done.'} Found {found.length}:
            {applied && <span className="ai-badge applied">New rule: {applied}</span>}
          </p>
          <ul className="found-list">
            {found.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </div>
      )}
      {state === 'paused' && (
        <input
          className="redirect-input"
          id="redirect-rule"
          value={rule}
          onChange={(e) => setRule(e.target.value)}
          placeholder="Add a correction, e.g. only companies in India"
          aria-label="Correction"
        />
      )}
      <div className="row">
        {state === 'idle' && <button className="btn btn-primary" onClick={start}><Play size={14} strokeWidth={1.75} aria-hidden /> Start</button>}
        {state === 'running' && <button className="btn btn-ghost" onClick={pause}><Pause size={14} strokeWidth={1.75} aria-hidden /> Pause</button>}
        {state === 'paused' && <button className="btn btn-primary" onClick={resume}><Play size={14} strokeWidth={1.75} aria-hidden /> Resume</button>}
        {state === 'done' && <button className="btn btn-ghost" onClick={start}><RotateCcw size={14} strokeWidth={1.75} aria-hidden /> Run again</button>}
      </div>
      <p className="demo-note">Pause while it runs, type “only India”, then Resume. The good results so far are kept.</p>
    </div>
  );
}
