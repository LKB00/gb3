import { Check, ChevronLeft, ChevronRight, Play, RotateCcw, Square } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTypewriter } from './useTypewriter';

const steps = ['Reading your 3 interview notes', 'Finding repeated themes', 'Writing the summary'];
const summary =
  'Top themes: (1) People can’t find saved items: all 3 users looked in the wrong menu. (2) Onboarding feels long; two users skipped it. (3) Users love the dark mode and asked for it on mobile. Suggested next step: test a "Saved" tab in the main navigation.';

export function StreamingResponse() {
  const [phase, setPhase] = useState('idle'); // idle | steps | writing | done | stopped
  const [stepIdx, setStepIdx] = useState(0);
  const tw = useTypewriter(60);
  const timer = useRef(null);

  const run = () => {
    setPhase('steps');
    setStepIdx(0);
    tw.setOutput('');
    let i = 0;
    timer.current = setInterval(() => {
      i += 1;
      setStepIdx(i);
      if (i >= steps.length - 1) {
        clearInterval(timer.current);
        setPhase('writing');
        tw.start(summary, () => setPhase('done'));
      }
    }, 900);
  };

  const stop = () => {
    clearInterval(timer.current);
    tw.stop();
    setPhase('stopped');
  };

  useEffect(() => () => clearInterval(timer.current), []);

  const busy = phase === 'steps' || phase === 'writing';

  return (
    <div className="demo-stack">
      <div className="bubble bubble-user">Summarize my 3 user interview notes.</div>
      {phase !== 'idle' && (
        <div className="bubble bubble-ai">
          <ul className="steps">
            {steps.map((s, i) => {
              const state = i < stepIdx || phase === 'done' ? 'done' : i === stepIdx && busy ? 'active' : phase === 'stopped' && i >= stepIdx ? 'skipped' : 'todo';
              return (
                <li key={s} className={'step step-' + state}>
                  <span className="step-dot" aria-hidden />
                  {s}
                </li>
              );
            })}
          </ul>
          {tw.output && <p className="stream-text">{tw.output}{phase === 'writing' && <span className="caret" />}</p>}
          {phase === 'stopped' && <p className="demo-muted">Stopped. What I wrote so far is kept.</p>}
        </div>
      )}
      <div className="row">
        {busy ? (
          <button className="btn btn-danger" onClick={stop}><Square size={14} strokeWidth={1.75} aria-hidden /> Stop</button>
        ) : (
          <button className="btn btn-primary" onClick={run}>{phase === 'idle' ? <><Play size={14} strokeWidth={1.75} aria-hidden /> Run</> : <><RotateCcw size={14} strokeWidth={1.75} aria-hidden /> Run again</>}</button>
        )}
      </div>
    </div>
  );
}

const variants = {
  A: { label: 'Clear', text: 'Track every project in one place.' },
  B: { label: 'Friendly', text: 'Your projects, finally organized.' },
  C: { label: 'Bold', text: 'Stop chasing updates. Start shipping.' },
};
const moreVariants = {
  A: { label: 'Clear', text: 'See project status at a glance.' },
  B: { label: 'Friendly', text: 'Less chaos, more done, together.' },
  C: { label: 'Bold', text: 'Deadlines, handled.' },
};

export function MultipleVariants() {
  const [set, setSet] = useState(variants);
  const [picked, setPicked] = useState(null);

  return (
    <div className="demo-stack">
      <div className="bubble bubble-user">Write a headline for our project management app.</div>
      <div className="variant-grid">
        {Object.entries(set).map(([key, v]) => (
          <button key={key} className={'variant' + (picked === key ? ' variant-on' : '')} onClick={() => setPicked(key)} aria-pressed={picked === key}>
            <span className="variant-tag">{key} · {v.label}</span>
            <span className="variant-text">{v.text}</span>
          </button>
        ))}
      </div>
      <div className="row">
        <button className="btn btn-ghost" onClick={() => { setSet(set === variants ? moreVariants : variants); setPicked(null); }}>
          <RotateCcw size={14} strokeWidth={1.75} aria-hidden /> Show 3 more
        </button>
        {picked && <span className="demo-ok"><Check size={14} strokeWidth={1.75} aria-hidden /> Using option {picked}: “{set[picked].text}”</span>}
      </div>
    </div>
  );
}

/* ---------- Versions & retry ---------- */

const retries = {
  '': ['Good coffee, good mornings.', 'Your daily cup of calm.', 'Brewed slow, served warm.'],
  Shorter: ['Pure bean joy.', 'Sip. Smile. Repeat.', 'Warm cups.'],
  Funnier: ['Espresso yourself.', 'We’ve bean waiting for you.', 'Deja brew, every day.'],
};

export function RegenerateHistory() {
  const [versions, setVersions] = useState([{ text: 'Fresh beans, warm hearts.', hint: '' }]);
  const [idx, setIdx] = useState(0);

  const retry = (hint) => {
    const used = versions.filter((v) => v.hint === hint).length;
    const pool = retries[hint];
    setVersions((vs) => [...vs, { text: pool[used % pool.length], hint }]);
    setIdx(versions.length);
  };

  const v = versions[idx];

  return (
    <div className="demo-stack">
      <div className="bubble bubble-user">Tagline for a coffee shop</div>
      <div className="bubble bubble-ai">
        <strong>{v.text}</strong>
        {v.hint && <span className="demo-muted"> · asked: {v.hint.toLowerCase()}</span>}
      </div>
      <div className="row">
        <button className="icon-btn dm-io-nav" onClick={() => setIdx(idx - 1)} disabled={idx === 0} aria-label="Older version"><ChevronLeft size={16} strokeWidth={1.75} aria-hidden /></button>
        <span className="small" aria-live="polite">{idx + 1} / {versions.length}</span>
        <button className="icon-btn dm-io-nav" onClick={() => setIdx(idx + 1)} disabled={idx === versions.length - 1} aria-label="Newer version"><ChevronRight size={16} strokeWidth={1.75} aria-hidden /></button>
        <button className="btn btn-ghost btn-sm" onClick={() => retry('')}><RotateCcw size={14} strokeWidth={1.75} aria-hidden /> Retry</button>
      </div>
      <div className="chips">
        {['Shorter', 'Funnier'].map((h) => (
          <button key={h} className="chip" onClick={() => retry(h)}>{h}</button>
        ))}
      </div>
      <p className="demo-note">Tap Retry or Funnier a few times, then flip back with the arrows. Nothing gets lost.</p>
    </div>
  );
}
