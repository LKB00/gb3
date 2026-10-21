import { ClipboardList, FileText, Palette, PenLine, Plus, Quote, RotateCcw, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { useTypewriter } from './useTypewriter';

const starters = [
  { icon: PenLine, text: 'Write a friendly welcome email for new users' },
  { icon: FileText, text: 'Summarize this report in 5 bullet points' },
  { icon: Palette, text: 'Suggest 3 color palettes for a calm health app' },
  { icon: ClipboardList, text: 'Give me 5 usability test questions for checkout' },
];

export function PromptStarters() {
  const [value, setValue] = useState('');
  const [sent, setSent] = useState('');

  return (
    <div className="demo-stack">
      {!sent && (
        <>
          <p className="demo-muted">What can I help you design today?</p>
          <div className="starter-grid">
            {starters.map((s) => (
              <button key={s.text} className="starter" onClick={() => setValue(s.text)}>
                <s.icon size={14} strokeWidth={1.75} aria-hidden /> {s.text}
              </button>
            ))}
          </div>
        </>
      )}
      {sent && (
        <div className="bubble bubble-user">{sent}</div>
      )}
      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) {
            setSent(value);
            setValue('');
          }
        }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask anything, or pick an example above…"
          aria-label="Prompt"
        />
        <button className="btn btn-primary" disabled={!value.trim()}>Send</button>
      </form>
      {sent && (
        <button className="btn btn-ghost" onClick={() => setSent('')}><RotateCcw size={14} strokeWidth={1.75} aria-hidden /> Start over</button>
      )}
      <p className="demo-note">Tap an example. It fills the box but doesn’t send, so you can still edit it.</p>
    </div>
  );
}

const answers = {
  Customers: 'Here is a short, warm launch post for customers: "Meet the new dashboard. Find what matters at a glance, with fewer clicks."',
  'Internal team': 'Here is a launch note for the team: "Dashboard v2 ships Monday. Key changes: new filters, faster load, and saved views. Questions → #dashboard."',
  Investors: 'Here is an investor update line: "We launched Dashboard v2, cutting the time to find answers by about 40% in beta and lifting weekly active use."',
};

export function ClarifyingQuestion() {
  const [step, setStep] = useState('ask');
  const [choice, setChoice] = useState(null);
  const tw = useTypewriter(35);

  const pick = (c) => {
    setChoice(c);
    setStep('answer');
    tw.start(c === 'Just guess' ? 'I assumed customers. ' + answers.Customers + ' Meant someone else? Just tell me.' : answers[c]);
  };

  return (
    <div className="demo-stack">
      <div className="bubble bubble-user">Write a launch announcement for our new dashboard.</div>
      <div className="bubble bubble-ai">
        <p>Quick question so I get the tone right: <strong>who is this for?</strong></p>
        <div className="chips">
          {['Customers', 'Internal team', 'Investors', 'Just guess'].map((c) => (
            <button key={c} className={'chip' + (choice === c ? ' chip-on' : '')} disabled={step !== 'ask'} onClick={() => pick(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>
      {step === 'answer' && <div className="bubble bubble-ai">{tw.output}{tw.running && <span className="caret" />}</div>}
      {step === 'answer' && !tw.running && (
        <button className="btn btn-ghost" onClick={() => { setStep('ask'); setChoice(null); }}><RotateCcw size={14} strokeWidth={1.75} aria-hidden /> Pick another answer</button>
      )}
    </div>
  );
}

/* ---------- Visible context ---------- */

const files = {
  'Q3-report.pdf': 'Sales grew 12% in Q3.',
  'Q2-report-OLD.pdf': 'Sales fell 3% in Q2.',
  'Team-notes.doc': 'The team wants one more designer.',
};

export function VisibleContext() {
  const [using, setUsing] = useState(['Q3-report.pdf', 'Q2-report-OLD.pdf']);
  const [answer, setAnswer] = useState('');
  const spare = Object.keys(files).filter((f) => !using.includes(f));

  const ask = () =>
    setAnswer(using.length ? `From ${using.join(' + ')}: ${using.map((f) => files[f]).join(' ')}` : 'I can’t see any files yet. Add one so I know what “this” is.');

  return (
    <div className="demo-stack">
      {answer && <div className="bubble bubble-ai">{answer}</div>}
      <div className="chips" aria-label="Files the AI can see">
        {using.map((f) => (
          <span key={f} className="dm-io-tag">
            <FileText size={14} strokeWidth={1.75} aria-hidden /> {f}
            <button onClick={() => setUsing((u) => u.filter((x) => x !== f))} aria-label={`Remove ${f}`}>
              <X size={14} strokeWidth={1.75} aria-hidden />
            </button>
          </span>
        ))}
        {spare.map((f) => (
          <button key={f} className="chip dm-io-add-chip" onClick={() => setUsing((u) => [...u, f])}>
            <Plus size={14} strokeWidth={1.75} aria-hidden /> {f}
          </button>
        ))}
      </div>
      <div className="composer">
        <input value="Summarize this." readOnly aria-label="Prompt" />
        <button className="btn btn-primary" onClick={ask}>Ask</button>
      </div>
      <p className="demo-note">Tap Ask. Then remove the OLD file and ask again. The answer follows the tags.</p>
    </div>
  );
}

/* ---------- Structured controls ---------- */

const replies = {
  Friendly: [
    'Hi Sam! Friday works. See you then!',
    'Hi Sam, thanks for the update! Friday works great for me. See you then!',
    'Hi Sam, thanks so much for the update! Friday works great for me. I’ll bring the new mockups so we can look at them together. See you then!',
  ],
  Formal: [
    'Dear Sam, Friday suits me. Regards.',
    'Dear Sam, thank you for the update. Friday suits me well. Kind regards.',
    'Dear Sam, thank you for the update. Friday suits me well. I will bring the latest mockups for us to review together. Kind regards.',
  ],
};
const lengths = ['Short', 'Medium', 'Long'];

export function StructuredControls() {
  const [tone, setTone] = useState('Friendly');
  const [len, setLen] = useState(1);

  return (
    <div className="demo-stack">
      <div className="bubble bubble-ai">{replies[tone][len]}</div>
      <div className="row">
        <span className="label">Tone</span>
        <div className="chips">
          {Object.keys(replies).map((t) => (
            <button key={t} className={'chip' + (tone === t ? ' chip-on' : '')} aria-pressed={tone === t} onClick={() => setTone(t)}>{t}</button>
          ))}
        </div>
      </div>
      <label className="row dm-io-range">
        <span className="label">Length</span>
        <input type="range" min={0} max={2} step={1} value={len} onChange={(e) => setLen(Number(e.target.value))} aria-valuetext={lengths[len]} />
        <span className="small">{lengths[len]}</span>
      </label>
      <p className="demo-note">Tap a tone or slide the length. No magic words needed.</p>
    </div>
  );
}

/* ---------- Contextual nudge ---------- */

const thread = ['Ana: Can we move launch to Nov 4?', 'Ben: Fine by me. Who owns pricing?', 'Ana: I’ll take pricing. Dark mode still open.'];

export function ContextualNudge() {
  const [state, setState] = useState('offer'); // offer | summary | closed

  return (
    <div className="demo-stack">
      <strong>Re: Q3 roadmap (14 replies)</strong>
      <ul className="dm-io-thread">
        {thread.map((m) => <li key={m}>{m}</li>)}
        <li className="demo-muted">+ 11 more replies</li>
      </ul>
      {state === 'offer' && (
        <div className="chips">
          <button className="chip" onClick={() => setState('summary')}><Sparkles size={14} strokeWidth={1.75} aria-hidden /> Summarize this thread</button>
          <button className="chip" onClick={() => setState('closed')} aria-label="No thanks, hide this idea"><X size={14} strokeWidth={1.75} aria-hidden /></button>
        </div>
      )}
      {state === 'summary' && <div className="bubble bubble-ai">3 things: launch moves to Nov 4. Ana owns pricing. Dark mode is still open.</div>}
      {state === 'closed' && <p className="demo-muted">Got it. No more ideas on this thread.</p>}
      <p className="demo-note">The idea shows up only on long threads. Try it, or close it for good.</p>
    </div>
  );
}

/* ---------- Reply to a part ---------- */

const plan = [
  { text: 'Interview 5 users about how they plan their week.', short: 'Interview 5 users.', why: '5 talks find most big problems fast, and cost little.' },
  { text: 'Run an online survey with 200 people to check the ideas.', short: 'Survey 200 people.', why: 'The survey checks if what 5 people said is true for many.' },
  { text: 'Build a clickable prototype and test it with the same users.', short: 'Test a prototype.', why: 'People can try the idea before anyone builds it for real.' },
];

export function ReplyToPart() {
  const [parts, setParts] = useState(plan.map((p) => p.text));
  const [sel, setSel] = useState(null);
  const [reply, setReply] = useState('');

  const shorten = () => { setParts((ps) => ps.map((p, i) => (i === sel ? plan[i].short : p))); setReply(''); };

  return (
    <div className="demo-stack">
      <div className="bubble bubble-ai">
        {parts.map((p, i) => (
          <button key={i} className={'dm-io-part' + (sel === i ? ' dm-io-part-on' : '')} aria-pressed={sel === i} onClick={() => { setSel(i); setReply(''); }}>
            {i + 1}) {p}
          </button>
        ))}
      </div>
      {sel !== null && (
        <>
          <p className="dm-io-quote"><Quote size={14} strokeWidth={1.75} aria-hidden /> {parts[sel]}</p>
          <div className="row">
            <button className="btn btn-ghost btn-sm" onClick={() => setReply(plan[sel].why)}><Sparkles size={14} strokeWidth={1.75} aria-hidden /> Explain</button>
            <button className="btn btn-ghost btn-sm" onClick={shorten} disabled={parts[sel] === plan[sel].short}>Shorten</button>
          </div>
        </>
      )}
      {reply && <div className="bubble bubble-ai">{reply}</div>}
      <p className="demo-note">Tap one step, then Explain or Shorten. Only that part changes.</p>
    </div>
  );
}
