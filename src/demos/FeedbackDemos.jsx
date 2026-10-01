import { useState } from 'react';
import { useTypewriter } from './useTypewriter';

/* ---------- Feedback loop ---------- */

const reasons = ['Not accurate', 'Too long', 'Wrong tone', 'Not what I asked'];

export function FeedbackLoop() {
  const [vote, setVote] = useState(null);
  const [picked, setPicked] = useState([]);
  const [sent, setSent] = useState(false);
  const tw = useTypewriter(40);

  const toggle = (r) => setPicked((p) => (p.includes(r) ? p.filter((x) => x !== r) : [...p, r]));

  const reset = () => { setVote(null); setPicked([]); setSent(false); tw.setOutput(''); };

  return (
    <div className="demo-stack">
      <div className="bubble bubble-ai">
        <p>A good empty state has: a short title, one sentence on why it is empty, a clear main action, and optionally a helpful illustration. It should also explain what will appear here later, guide new users, and avoid blaming them, and it can include tips, links to docs, sample data, or a video tutorial for more complex features.</p>
        {tw.output && <p className="stream-text"><strong>Shorter:</strong> {tw.output}</p>}
        <div className="row feedback-row">
          <button className={'icon-btn' + (vote === 'up' ? ' icon-on' : '')} aria-label="Good answer" aria-pressed={vote === 'up'} onClick={() => { reset(); setVote('up'); }}>👍</button>
          <button className={'icon-btn' + (vote === 'down' ? ' icon-on' : '')} aria-label="Bad answer" aria-pressed={vote === 'down'} onClick={() => { reset(); setVote('down'); }}>👎</button>
          {vote === 'up' && <span className="demo-ok">Thanks! Glad it helped.</span>}
        </div>
      </div>
      {vote === 'down' && !sent && (
        <div className="feedback-box">
          <p><strong>What went wrong?</strong> <span className="demo-muted">(optional)</span></p>
          <div className="chips">
            {reasons.map((r) => (
              <button key={r} className={'chip' + (picked.includes(r) ? ' chip-on' : '')} aria-pressed={picked.includes(r)} onClick={() => toggle(r)}>{r}</button>
            ))}
          </div>
          <div className="row">
            <button className="btn btn-primary btn-sm" onClick={() => setSent(true)}>Send</button>
            <button className="btn btn-ghost btn-sm" onClick={reset}>Cancel</button>
          </div>
        </div>
      )}
      {sent && (
        <div className="toast" role="status">
          <span>Thanks — this helps us improve.</span>
          {picked.includes('Too long') && !tw.output && (
            <button className="btn btn-ghost btn-sm" onClick={() => tw.start('Title + one-line reason + one clear action. That\'s it.')}>✨ Make it shorter</button>
          )}
        </div>
      )}
      <p className="demo-note">Try 👎 and choose “Too long” — the AI offers a fix right away.</p>
    </div>
  );
}

/* ---------- Helpful errors ---------- */

const defaultPrompt = 'Create a mood board from my 45 MB brand-guide.pdf';

export function GracefulErrors() {
  const [mode, setMode] = useState('good');
  const [state, setState] = useState('idle'); // idle | loading | error | ok
  const [prompt, setPrompt] = useState(defaultPrompt);

  const send = () => {
    setState('loading');
    setTimeout(() => {
      setState('error');
      if (mode === 'bad') setPrompt(''); // the bad version loses the user's text
    }, 900);
  };

  const switchTo = (m) => {
    setMode(m);
    setState('idle');
    setPrompt(defaultPrompt);
  };

  return (
    <div className="demo-stack">
      <div className="segmented" role="tablist" aria-label="Error style">
        <button role="tab" aria-selected={mode === 'bad'} className={mode === 'bad' ? 'seg-on' : ''} onClick={() => switchTo('bad')}>❌ Bad error</button>
        <button role="tab" aria-selected={mode === 'good'} className={mode === 'good' ? 'seg-on' : ''} onClick={() => switchTo('good')}>✅ Good error</button>
      </div>
      <form className="composer" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <input value={prompt} onChange={(e) => setPrompt(e.target.value)} aria-label="Prompt" />
        <button className="btn btn-primary" disabled={state === 'loading'}>{state === 'loading' ? '…' : 'Send'}</button>
      </form>
      {state === 'error' && mode === 'bad' && (
        <div className="error-box error-bad">
          <strong>Error 413</strong>
          <p>Something went wrong. Request failed.</p>
        </div>
      )}
      {state === 'error' && mode === 'good' && (
        <div className="error-box error-good">
          <strong>That file is too big for me to read</strong>
          <p>I can read PDFs up to 20 MB. Your file is 45 MB. Your message is saved above.</p>
          <div className="row">
            <button className="btn btn-primary btn-sm" onClick={() => setState('ok')}>Use first 30 pages only</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setState('idle')}>Upload a smaller file</button>
          </div>
        </div>
      )}
      {state === 'ok' && <div className="toast" role="status">✓ Working with pages 1–30…</div>}
      <p className="demo-note">Switch between the two styles and press Send. Notice the bad one even clears your text.</p>
    </div>
  );
}
