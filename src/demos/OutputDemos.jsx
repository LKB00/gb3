import { Check, Play, RotateCcw, Square } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTypewriter } from './useTypewriter';

const steps = ['Reading your 3 interview notes', 'Finding repeated themes', 'Writing the summary'];
const summary =
  'Top themes: (1) People cannot find saved items — 3 of 3 users looked in the wrong menu. (2) Onboarding feels long; two users skipped it. (3) Users love the dark mode and asked for it on mobile. Suggested next step: test a "Saved" tab in the main navigation.';

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
          {phase === 'stopped' && <p className="demo-muted">Stopped. Partial result kept.</p>}
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
  B: { label: 'Friendly', text: 'Less chaos, more done — together.' },
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
