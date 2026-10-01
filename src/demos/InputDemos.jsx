import { ClipboardList, FileText, Palette, PenLine, RotateCcw } from 'lucide-react';
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
        <button className="btn btn-ghost" onClick={() => setSent('')}><RotateCcw size={14} strokeWidth={1.75} aria-hidden /> Reset demo</button>
      )}
      <p className="demo-note">Notice: clicking an example fills the box but does not send. You can still edit it.</p>
    </div>
  );
}

const answers = {
  Customers: 'Here is a short, warm launch post for customers: "Meet the new dashboard — find what matters in one glance, with less clicking."',
  'Internal team': 'Here is a launch note for the team: "Dashboard v2 ships Monday. Key changes: new filters, faster load, and saved views. Questions → #dashboard."',
  Investors: 'Here is an investor update line: "We launched Dashboard v2, cutting time-to-insight by ~40% in beta and lifting weekly active use."',
};

export function ClarifyingQuestion() {
  const [step, setStep] = useState('ask');
  const [choice, setChoice] = useState(null);
  const tw = useTypewriter(35);

  const pick = (c) => {
    setChoice(c);
    setStep('answer');
    tw.start(c === 'Just guess' ? 'I assumed customers. ' + answers.Customers + ' (Tell me if you meant a different audience.)' : answers[c]);
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
        <button className="btn btn-ghost" onClick={() => { setStep('ask'); setChoice(null); }}><RotateCcw size={14} strokeWidth={1.75} aria-hidden /> Try another answer</button>
      )}
    </div>
  );
}
