import { useEffect, useRef, useState } from 'react';
import { Check, Hand, History, Pause, Play, RotateCcw, Send, Undo2, UserRound, X } from 'lucide-react';

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
      <p className="demo-muted">One email helper, five levels of freedom. Slide to see each one.</p>
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
          placeholder="Add a correction, like “only India”"
          aria-label="Correction"
        />
      )}
      <div className="row">
        {state === 'idle' && <button className="btn btn-primary" onClick={start}><Play size={14} strokeWidth={1.75} aria-hidden /> Start</button>}
        {state === 'running' && <button className="btn btn-ghost" onClick={pause}><Pause size={14} strokeWidth={1.75} aria-hidden /> Pause</button>}
        {state === 'paused' && <button className="btn btn-primary" onClick={resume}><Play size={14} strokeWidth={1.75} aria-hidden /> Resume</button>}
        {state === 'done' && <button className="btn btn-ghost" onClick={start}><RotateCcw size={14} strokeWidth={1.75} aria-hidden /> Run again</button>}
      </div>
      <p className="demo-note">Press Pause, type “only India”, then Resume. It keeps the matches it already found.</p>
    </div>
  );
}

/* ---------- Shared bits for the small agent demos ---------- */

const ico = { size: 14, strokeWidth: 1.75, 'aria-hidden': true };

/* ---------- Show the plan first ---------- */

const planSteps = [
  { t: 'Find unused components', min: 1 },
  { t: 'Rename layers to match', min: 2 },
  { t: 'Group colors into styles', min: 1 },
  { t: 'Delete unused components', min: 1 },
];

export function PlanFirst() {
  const [kept, setKept] = useState(planSteps);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(0);
  const finished = running && done >= kept.length;
  const mins = kept.reduce((sum, x) => sum + x.min, 0);

  useEffect(() => {
    if (!running || done >= kept.length) return undefined;
    const t = setTimeout(() => setDone((d) => d + 1), 700);
    return () => clearTimeout(t);
  }, [running, done, kept.length]);

  return (
    <div className="demo-stack">
      <div className="bubble bubble-user">Clean up our design system file.</div>
      <div className="bubble bubble-ai">
        <p className="label">{!running ? `My plan · about ${mins} min` : finished ? 'All done' : 'Working on it'}</p>
        <ul className="steps dm-ag-steps">
          {kept.map((s, i) => {
            const st = !running ? 'todo' : i < done ? 'done' : i === done ? 'active' : 'todo';
            return (
              <li key={s.t} className={'step step-' + st}>
                <span className="step-dot" aria-hidden />
                <span className="dm-ag-grow">{s.t}</span>
                {!running && kept.length > 1 && (
                  <button className="icon-btn dm-ag-x" onClick={() => setKept((k) => k.filter((x) => x !== s))} aria-label={`Remove step: ${s.t}`}>
                    <X {...ico} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      {!running && (
        <div className="row">
          <button className="btn btn-primary" onClick={() => setRunning(true)}><Play {...ico} /> Start</button>
        </div>
      )}
      {finished && <p className="demo-ok"><Check {...ico} /> Done. It did only the steps you kept.</p>}
      <p className="demo-note">Remove a step you don’t want, then press Start. It does only what’s left.</p>
    </div>
  );
}

/* ---------- Ask before risky actions ---------- */

export function ActionApproval() {
  const [asking, setAsking] = useState(false);
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);
  const answer = (ok) => {
    setAsking(false);
    setSent(ok);
    setMsg(ok ? 'Sent to 240 customers.' : 'Cancelled. Nothing was sent.');
  };

  return (
    <div className="demo-stack">
      <div className="bubble bubble-ai">I wrote the “Price update in October” email for your 240 customers.</div>
      {asking ? (
        <div className="dm-ag-box" role="group" aria-label="Check before sending">
          <strong>Send email to 240 customers?</strong>
          <span className="small muted">Subject: “Price update in October”. Emails can’t be unsent.</span>
          <div className="row">
            <button className="btn btn-ghost" onClick={() => answer(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={() => answer(true)}><Send {...ico} /> Send to 240</button>
          </div>
        </div>
      ) : (
        !sent && (
          <div className="row">
            <button className="btn btn-ghost" onClick={() => setMsg('Draft saved. Low risk, so I didn’t ask.')}>Save draft</button>
            <button className="btn btn-primary" onClick={() => { setMsg(''); setAsking(true); }}><Send {...ico} /> Send</button>
          </div>
        )
      )}
      {msg && <p className={sent ? 'demo-ok' : 'demo-muted'}>{sent && <Check {...ico} />}{msg}</p>}
      <p className="demo-note">Tap Save draft: it just happens. Tap Send: it stops and asks first.</p>
    </div>
  );
}

/* ---------- Background tasks & handoff ---------- */

const statusText = { run: 'Running', need: 'Needs you', done: 'Done' };

export function TaskStatus() {
  const [tasks, setTasks] = useState([
    { name: 'Competitor research', s: 'run' },
    { name: 'Survey summary', s: 'need' },
    { name: 'Interview tags', s: 'done' },
  ]);
  const [asking, setAsking] = useState(false);
  const [human, setHuman] = useState(false);
  const runIdx = tasks.findIndex((x) => x.s === 'run');

  useEffect(() => {
    if (runIdx < 0) return undefined;
    const t = setTimeout(() => setTasks((list) => list.map((x, j) => (j === runIdx ? { ...x, s: 'done' } : x))), 2500);
    return () => clearTimeout(t);
  }, [runIdx]);

  const pick = () => {
    setAsking(false);
    setTasks((list) => list.map((x, j) => (j === 1 ? { ...x, s: 'run' } : x)));
  };

  return (
    <div className="demo-stack">
      <ul className="dm-ag-list">
        {tasks.map((x) => (
          <li key={x.name}>
            <span className="dm-ag-grow">{x.name}</span>
            <span className={'dm-ag-pill dm-ag-' + x.s}>{statusText[x.s]}</span>
          </li>
        ))}
      </ul>
      {tasks[1].s === 'need' && !asking && (
        <div className="toast">
          Survey summary needs your input
          <button className="btn btn-ghost btn-sm" onClick={() => setAsking(true)}>Answer</button>
        </div>
      )}
      {asking && (
        <div className="dm-ag-box">
          <span>Which survey answers should I use?</span>
          <div className="row">
            <button className="chip" onClick={pick}>Last 30 days</button>
            <button className="chip" onClick={pick}>All time</button>
          </div>
        </div>
      )}
      {human ? (
        <p className="demo-muted">Sam from support is joining. Sam can see the whole chat.</p>
      ) : (
        <div className="row">
          <button className="btn btn-ghost" onClick={() => setHuman(true)}><UserRound {...ico} /> Talk to a person</button>
        </div>
      )}
      <p className="demo-note">Tap Answer on the task that needs you. Then watch it finish on its own.</p>
    </div>
  );
}

/* ---------- Activity log & undo ---------- */

const logItems = [
  { time: '10:02', t: 'Renamed 24 layers' },
  { time: '10:03', t: 'Merged 6 color styles' },
  { time: '10:04', t: 'Moved 3 icons to Assets' },
];

export function ActionLog() {
  const [undone, setUndone] = useState([]);
  const allBack = undone.length === logItems.length;
  const toggle = (i) => setUndone((u) => (u.includes(i) ? u.filter((x) => x !== i) : [...u, i]));

  return (
    <div className="demo-stack">
      <p className="demo-muted">The AI tidied your design file. Here is what it did.</p>
      <ul className="dm-ag-list">
        {logItems.map((x, i) => {
          const off = undone.includes(i);
          return (
            <li key={x.t}>
              <span className="dm-ag-time">{x.time}</span>
              <span className={off ? 'dm-ag-grow dm-ag-off' : 'dm-ag-grow'}>{x.t}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => toggle(i)} aria-label={`${off ? 'Redo' : 'Undo'}: ${x.t}`}>
                {off ? 'Redo' : <><Undo2 {...ico} /> Undo</>}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="row">
        <button className="btn btn-ghost" disabled={allBack} onClick={() => setUndone(logItems.map((_, i) => i))}>
          <History {...ico} /> Restore to 10:00
        </button>
      </div>
      {undone.length > 0 && (
        <p className="demo-ok"><Check {...ico} />{allBack ? 'Back to 10:00, like it never happened.' : 'Undone. The other steps stay.'}</p>
      )}
      <p className="demo-note">Tap Undo on one step. Only that step goes back.</p>
    </div>
  );
}

/* ---------- Show the cost first ---------- */

const costOpts = {
  draft: { label: 'Draft preview', est: 10, real: 8 },
  full: { label: 'Video, 30 sec', est: 120, real: 112 },
};

export function CostEstimate() {
  const [left, setLeft] = useState(250);
  const [busy, setBusy] = useState(null);
  const [last, setLast] = useState(null);
  const fullFits = left >= costOpts.full.est;

  useEffect(() => {
    if (!busy) return undefined;
    const t = setTimeout(() => {
      const o = costOpts[busy];
      setLeft((l) => l - o.real);
      setLast(o);
      setBusy(null);
    }, 900);
    return () => clearTimeout(t);
  }, [busy]);

  return (
    <div className="demo-stack">
      <div className="bubble bubble-user">Make a 30-second video of our new app.</div>
      <ul className="dm-ag-list">
        {Object.values(costOpts).map((o) => (
          <li key={o.label}><span className="dm-ag-grow">{o.label}</span><span className="muted">~{o.est} credits</span></li>
        ))}
      </ul>
      <div className="row">
        <button className="btn btn-ghost" disabled={!!busy} onClick={() => setBusy('draft')}>Draft · ~10</button>
        <button className="btn btn-primary" disabled={!!busy || !fullFits} onClick={() => setBusy('full')}>Generate · ~120 credits</button>
      </div>
      {busy && <p className="demo-muted">Making your {costOpts[busy].label.toLowerCase()}…</p>}
      {!busy && last && <p className="demo-ok"><Check {...ico} /> Done. It really used {last.real} credits.</p>}
      {!fullFits && <p className="dm-ag-warn">Not enough credits for a full video. A draft still fits.</p>}
      <p className="small muted">{left} credits left this month</p>
      <p className="demo-note">Try a cheap draft first. After each run, see what it really cost.</p>
    </div>
  );
}

/* ---------- Show which agent is working ---------- */

const crew = [
  { name: 'Research agent', job: 'finds sources', doing: 'Reading sources…', hand: 'Gave 24 sources to the Writer', work: 'Read 24 sources. The top 3 apps are Notion, Mem and Reflect.' },
  { name: 'Writer agent', job: 'writes the report', doing: 'Drafting the report…', hand: 'Gave the draft to the Checker', work: 'Wrote 5 sections, about 1,200 words.' },
  { name: 'Checker agent', job: 'checks the numbers', doing: 'Checking numbers…', hand: 'Gave the checked report to the Lead', work: 'Checked 14 numbers. Fixed 1 wrong price.' },
];

export function AgentHandoff() {
  const [at, setAt] = useState(-1); // -1 = not started, crew.length = all done
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (at < 0 || at >= crew.length) return undefined;
    const t = setTimeout(() => setAt((a) => a + 1), 1100);
    return () => clearTimeout(t);
  }, [at]);

  return (
    <div className="demo-stack">
      <div className="bubble bubble-user">Write a market report on AI note apps.</div>
      {at < 0 ? (
        <div className="row"><button className="btn btn-primary" onClick={() => setAt(0)}><Play {...ico} /> Start</button></div>
      ) : (
        <ul className="steps dm-ag-steps">
          {crew.map((c, i) => {
            const st = i < at ? 'done' : i === at ? 'active' : 'todo';
            return (
              <li key={c.name} className={'step step-' + st}>
                <span className="step-dot" aria-hidden />
                <span className="dm-ag-grow"><strong>{c.name}</strong> · {st === 'active' ? c.doing : st === 'done' ? c.hand : c.job}</span>
                {st === 'done' && (
                  <button className="btn btn-ghost btn-sm" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                    {open === i ? 'Close' : 'Open'}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {open !== null && <div className="source-card"><strong>{crew[open].name}’s work</strong><p>{crew[open].work}</p></div>}
      {at >= crew.length && <p className="demo-ok"><Check {...ico} /> Lead agent: Your report is ready. I own it, so ask me anything.</p>}
      <p className="demo-note">Press Start and watch each hand-off. Then open a helper to check its work.</p>
    </div>
  );
}

/* ---------- Ask before using your screen ---------- */

const screenSteps = ['Searching for A4 paper', 'Adding 5 packs to the cart', 'Going to checkout'];

export function ScreenControl() {
  const [phase, setPhase] = useState('ask'); // ask | ai | you | pay | paid | no
  const [n, setN] = useState(0);

  useEffect(() => {
    if (phase !== 'ai') return undefined;
    const t = setTimeout(() => (n + 1 >= screenSteps.length ? setPhase('pay') : setN(n + 1)), 1100);
    return () => clearTimeout(t);
  }, [phase, n]);

  return (
    <div className="demo-stack">
      <div className="bubble bubble-user">Order more printer paper.</div>
      {phase === 'ask' && (
        <div className="dm-ag-box" role="group" aria-label="Access request">
          <strong>Let the AI use officesupply.com?</strong>
          <span className="small muted">Only this site. It will find paper and add it to your cart.</span>
          <div className="row">
            <button className="btn btn-ghost" onClick={() => setPhase('no')}>Not now</button>
            <button className="btn btn-primary" onClick={() => setPhase('ai')}>Allow this site</button>
          </div>
        </div>
      )}
      {(phase === 'ai' || phase === 'you') && (
        <div className={'dm-ag-box' + (phase === 'ai' ? ' dm-ag-live' : '')}>
          <div className="dm-ag-bar">
            {phase === 'ai' ? 'AI is in control of officesupply.com' : 'You are in control. The AI waits.'}
            <button className={'btn btn-sm ' + (phase === 'ai' ? 'btn-primary' : 'btn-ghost')} onClick={() => setPhase(phase === 'ai' ? 'you' : 'ai')}>
              {phase === 'ai' ? <><Hand {...ico} /> Take over</> : 'Hand back'}
            </button>
          </div>
          <span className={'step ' + (phase === 'ai' ? 'step-active' : '')}><span className="step-dot" aria-hidden />{screenSteps[n]}</span>
        </div>
      )}
      {phase === 'pay' && (
        <div className="dm-ag-box" role="group" aria-label="Payment">
          <strong>Ready to pay ₹4,200?</strong>
          <span className="small muted">I stopped at checkout. Payments are yours to make.</span>
          <div className="row">
            <button className="btn btn-ghost" onClick={() => setPhase('no')}>Cancel</button>
            <button className="btn btn-primary" onClick={() => setPhase('paid')}>Pay myself</button>
          </div>
        </div>
      )}
      {phase === 'paid' && <p className="demo-ok"><Check {...ico} /> You paid. The paper is on its way.</p>}
      {phase === 'no' && <p className="demo-muted">No problem. Nothing was bought.</p>}
      <p className="demo-note">Allow the site, then tap Take over any time. It stops before paying.</p>
    </div>
  );
}
