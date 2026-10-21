import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Check, FlaskConical, RotateCcw, Send } from 'lucide-react';

/* ---------- Try it safely first (practice run before a real send) ---------- */

const icon = { size: 14, strokeWidth: 1.75, 'aria-hidden': true };

export function SandboxPreview() {
  const [state, setState] = useState('idle'); // idle | running | practice | sent
  const [fixed, setFixed] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const practice = (fix) => {
    setFixed(fix);
    setState('running');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('practice'), 700);
  };
  const reset = () => {
    clearTimeout(timer.current);
    setFixed(false);
    setState('idle');
  };

  const rows = [
    { who: 'Asha Rao', says: 'Hi Asha,', ok: true },
    { who: 'Ben Ito', says: 'Hi Ben,', ok: true },
    { who: '3 people with no first name', says: fixed ? 'Hi there,' : 'Hi ,', ok: fixed },
  ];

  return (
    <div className="demo-stack">
      <div className="bubble bubble-user">Send the welcome email to our 40 new members.</div>

      {state === 'idle' && (
        <div className="bubble bubble-ai">I’ll do a practice run first. It builds every email, but sends none.</div>
      )}

      {state === 'running' && (
        <p className="bubble bubble-ai" aria-live="polite">Building 40 emails. Nothing goes out…</p>
      )}

      {state === 'practice' && (
        <div className="dm-sb-run" aria-live="polite">
          <span className="ai-badge"><FlaskConical {...icon} /> Practice run · nothing sent yet</span>
          <ul className="dm-sb-list">
            {rows.map((r) => (
              <li key={r.who} className={r.ok ? '' : 'dm-sb-odd'}>
                <span className="dm-sb-who">{r.who}</span>
                <span className="dm-sb-says">“{r.says}”</span>
                <span className={'dm-sb-tag ' + (r.ok ? 'dm-sb-tag-ok' : 'dm-sb-tag-warn')}>
                  {r.ok ? <Check {...icon} /> : <AlertTriangle {...icon} />}
                  {r.ok ? 'OK' : 'No name'}
                </span>
              </li>
            ))}
            <li className="dm-sb-more">+ 35 more, all OK</li>
          </ul>
          <p className="small muted">{fixed ? '40 emails ready. All look good.' : '40 emails ready. 3 look odd.'}</p>
        </div>
      )}

      {state === 'sent' && (
        <div aria-live="polite">
          <p className="demo-ok"><Check {...icon} /> Sent to 40 members.</p>
          <p className="small muted">
            {fixed ? 'Every email went out just as you saw it.' : '3 people got “Hi ,”. The practice run tried to warn you.'}
          </p>
        </div>
      )}

      <div className="row">
        {state === 'idle' && (
          <button type="button" className="btn btn-primary" onClick={() => practice(false)}>
            <FlaskConical {...icon} /> Start practice run
          </button>
        )}
        {state === 'practice' && !fixed && (
          <button type="button" className="btn btn-ghost" onClick={() => practice(true)}>
            <RotateCcw {...icon} /> Fix and rerun
          </button>
        )}
        {state === 'practice' && (
          <button type="button" className="btn btn-primary" onClick={() => setState('sent')}>
            <Send {...icon} /> Send 40 for real
          </button>
        )}
        {state === 'sent' && (
          <button type="button" className="btn btn-ghost" onClick={reset}>
            <RotateCcw {...icon} /> Start over
          </button>
        )}
      </div>
      <p className="demo-note">Start the practice run. Spot the odd emails, fix them, then send for real.</p>
    </div>
  );
}
