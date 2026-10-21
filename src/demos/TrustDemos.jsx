import { Ban, Bookmark, Check, Flag, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

/* ---------- Citations ---------- */

const sources = [
  { id: 1, title: 'Q3 user research report', quote: '"7 of 10 participants could not find the export button."' },
  { id: 2, title: 'Support tickets, September', quote: '"Export" was the 2nd most common topic, with 312 tickets.' },
  { id: 3, title: 'Analytics dashboard', quote: 'Only 4% of weekly users opened the export menu.' },
];

// Outside Citations so it is not a new component each render (that would drop focus).
function Cite({ n, open, setOpen }) {
  return (
    <button className={'cite' + (open === n ? ' cite-on' : '')} onClick={() => setOpen(open === n ? null : n)} aria-label={`Source ${n}`}>
      {n}
    </button>
  );
}

export function Citations() {
  const [open, setOpen] = useState(null);

  return (
    <div className="demo-stack">
      <div className="bubble bubble-user">Why do people struggle with export?</div>
      <div className="bubble bubble-ai">
        <p>
          Most people cannot find it: in testing, 7 of 10 participants missed the export button <Cite n={1} open={open} setOpen={setOpen} />. It is also a top support topic <Cite n={2} open={open} setOpen={setOpen} />, and very few users ever open the export menu <Cite n={3} open={open} setOpen={setOpen} />.
        </p>
        <p className="demo-muted small">I found no source about export <em>speed</em>, so I did not include it.</p>
      </div>
      {open && (
        <div className="source-card" role="region" aria-label="Source preview">
          <div className="row space-between">
            <strong>[{open}] {sources[open - 1].title}</strong>
            <button className="btn btn-ghost btn-sm" onClick={() => setOpen(null)} aria-label="Close source"><X size={14} strokeWidth={1.75} aria-hidden /></button>
          </div>
          <p>{sources[open - 1].quote}</p>
          <span className="link-like">Open original →</span>
        </div>
      )}
      <p className="demo-note">Tap a number to check the source right next to the claim.</p>
    </div>
  );
}

/* ---------- Confidence signals ---------- */

const fields = [
  { label: 'Vendor', value: 'Pixel Studio Ltd.', level: 'high' },
  { label: 'Invoice date', value: '12 Sep 2026', level: 'high' },
  { label: 'Total', value: '₹ 48,500', level: 'medium', hint: 'Blurry digit. Could be 46,500' },
  { label: 'Tax ID', value: '29AB…C1Z?', level: 'low', hint: 'Part of the text is missing' },
];
const levelText = { high: 'Sure', medium: 'Check this', low: 'Not sure' };

export function ConfidenceSignals() {
  const [onlyReview, setOnlyReview] = useState(false);
  const [checked, setChecked] = useState({});
  const shown = onlyReview ? fields.filter((f) => f.level !== 'high') : fields;

  return (
    <div className="demo-stack">
      <div className="row space-between">
        <span className="demo-muted">AI read your invoice:</span>
        <label className="toggle">
          <input type="checkbox" checked={onlyReview} onChange={(e) => setOnlyReview(e.target.checked)} /> Only show “needs review”
        </label>
      </div>
      <table className="conf-table">
        <tbody>
          {shown.map((f) => (
            <tr key={f.label}>
              <th scope="row">{f.label}</th>
              <td>
                <div>{f.value}</div>
                {f.hint && <div className="small demo-muted">{f.hint}</div>}
              </td>
              <td>
                <div className="conf-cell">
                  {checked[f.label] ? (
                    <span className="conf conf-high"><Check size={12} strokeWidth={2} aria-hidden /> Checked</span>
                  ) : (
                    <span className={'conf conf-' + f.level}>{levelText[f.level]}</span>
                  )}
                  {f.level !== 'high' && !checked[f.label] && (
                    <button className="btn btn-ghost btn-sm" onClick={() => setChecked({ ...checked, [f.label]: true })}>Mark OK</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="demo-note">Words and color, not color alone. Your eye goes straight to what needs checking.</p>
    </div>
  );
}

/* ---------- AI disclosure ---------- */

export function AiDisclosure() {
  const [text, setText] = useState('Our new onboarding cuts setup time in half. Try it today and tell us what you think!');
  const [edited, setEdited] = useState(false);
  const [info, setInfo] = useState(false);

  return (
    <div className="demo-stack">
      <article className="post">
        <header className="row space-between">
          <div className="row">
            <span className="avatar" aria-hidden>AK</span>
            <div>
              <strong>Asha K.</strong>
              <div className="small demo-muted">Product designer</div>
            </div>
          </div>
          <span className="disclose-wrap">
            <button className="ai-badge" onClick={() => setInfo(!info)} aria-expanded={info}>
              <Sparkles size={12} strokeWidth={2} aria-hidden /> {edited ? 'AI-assisted' : 'AI generated'}
            </button>
            {info && (
              <span className="disclose-pop" role="tooltip">
                {edited ? 'Written with AI, then edited by Asha.' : 'This text was written by AI. Asha has not edited it yet.'}
              </span>
            )}
          </span>
        </header>
        <textarea
          rows={3}
          value={text}
          aria-label="Post text"
          onChange={(e) => { setText(e.target.value); setEdited(true); }}
        />
      </article>
      <p className="demo-note">Edit the text and watch the label switch to “AI-assisted”. Tap the label to see why.</p>
    </div>
  );
}

/* ---------- Set expectations ---------- */

const tasks = [
  { ask: 'Summarize my 5 interviews', reply: 'Done! 3 big themes: setup is slow, export is hidden, people love templates.' },
  { ask: 'Open my Figma file', reply: 'I can’t see Figma files, like I said up top. Paste a screenshot and I’ll take a look.' },
];

export function SetExpectations() {
  const [picked, setPicked] = useState(null);

  return (
    <div className="demo-stack">
      <div>
        <strong>Hi! I’m your research helper.</strong>
        <ul className="dm-tr-list small">
          <li><Check size={14} strokeWidth={1.75} aria-hidden /> I can summarize interviews and find themes.</li>
          <li><Ban size={14} strokeWidth={1.75} aria-hidden /> I can’t see your Figma files.</li>
        </ul>
      </div>
      <div className="chips">
        {tasks.map((t, i) => (
          <button key={t.ask} className={'chip' + (picked === i ? ' chip-on' : '')} aria-pressed={picked === i} onClick={() => setPicked(i)}>{t.ask}</button>
        ))}
      </div>
      {picked !== null && (
        <>
          <div className="bubble bubble-user">{tasks[picked].ask}</div>
          <div className="bubble bubble-ai" role="status">{tasks[picked].reply}</div>
        </>
      )}
      <p className="small demo-muted">Can make mistakes. Check important info.</p>
      <p className="demo-note">Ask for something it can’t do. No surprise: it told you up front.</p>
    </div>
  );
}

/* ---------- Explain why ---------- */

const courseReasons = [
  { id: 'basics', text: 'You finished “Figma Basics”', pick: 'Figma: Next Steps' },
  { id: 'proto', text: 'You opened 4 prototyping videos', pick: 'Prototyping for Beginners' },
];

export function ExplainWhy() {
  const [wrong, setWrong] = useState([]);
  const left = courseReasons.filter((r) => !wrong.includes(r.id));
  const pick = left.length === 2 ? 'Advanced Prototyping' : left.length === 1 ? left[0].pick : 'Design Tour: Start Here';

  return (
    <div className="demo-stack">
      <div className="row space-between">
        <strong>{pick}</strong>
        <span className="conf conf-high">Picked for you</span>
      </div>
      <ul className="dm-tr-list small" aria-label="Why we picked this">
        {courseReasons.map((r) => {
          const off = wrong.includes(r.id);
          return (
            <li key={r.id}>
              <span className={'dm-tr-grow' + (off ? ' dm-tr-off' : '')}>{r.text}</span>
              {off ? <span className="demo-muted">Not used</span> : (
                <button className="btn btn-ghost btn-sm" onClick={() => setWrong([...wrong, r.id])}>That’s not right</button>
              )}
            </li>
          );
        })}
      </ul>
      {wrong.length > 0 && <span className="demo-ok" role="status"><Check size={14} strokeWidth={1.75} aria-hidden /> Got it. New pick above.</span>}
      <p className="demo-note">Tap “That’s not right” on a reason. Watch the pick change.</p>
    </div>
  );
}

/* ---------- Memory you control ---------- */

const startMemories = [
  { id: 'veg', text: 'Is vegetarian' },
  { id: 'short', text: 'Likes short answers' },
];

export function MemoryControls() {
  const [mems, setMems] = useState(startMemories);
  const [on, setOn] = useState(true);
  const has = (id) => on && mems.some((m) => m.id === id);
  const dish = has('veg') ? 'Paneer tikka wraps' : 'Chicken tikka wraps';
  const extra = has('short') ? '' : ' They take 20 minutes, use one pan, and keep well for lunch the next day.';

  return (
    <div className="demo-stack">
      <div className="bubble bubble-user">What should I cook tonight?</div>
      <div className="bubble bubble-ai" role="status">{dish}.{extra}</div>
      <div className="dm-tr-panel">
        <div className="row space-between">
          <span className="label"><Bookmark size={12} strokeWidth={1.75} aria-hidden /> What I remember</span>
          <label className="toggle"><input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} /> Memory on</label>
        </div>
        <ul className="dm-tr-list small">
          {mems.map((m) => (
            <li key={m.id}>
              <span className={'dm-tr-grow' + (on ? '' : ' dm-tr-off')}>{m.text}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setMems(mems.filter((x) => x.id !== m.id))} aria-label={`Delete memory: ${m.text}`}>Delete</button>
            </li>
          ))}
          {mems.length === 0 && <li className="demo-muted">Nothing saved. A clean slate.</li>}
        </ul>
      </div>
      <p className="demo-note">Delete “Is vegetarian” and see the answer change.</p>
    </div>
  );
}

/* ---------- Show what it can access ---------- */

const apps = [
  { id: 'gmail', name: 'Gmail', access: 'Can read' },
  { id: 'cal', name: 'Calendar', access: 'Can read and act', note: 'Asks first' },
];

export function ConnectedApps() {
  const [paused, setPaused] = useState([]);
  const flip = (id) => setPaused(paused.includes(id) ? paused.filter((x) => x !== id) : [...paused, id]);
  const calOn = !paused.includes('cal');

  return (
    <div className="demo-stack">
      <ul className="dm-tr-list small" aria-label="Connected apps">
        {apps.map((a) => {
          const off = paused.includes(a.id);
          return (
            <li key={a.id}>
              <span className="dm-tr-grow"><strong>{a.name}</strong> <span className="demo-muted">· {off ? 'Paused' : a.access}</span></span>
              {!off && a.note && <span className="conf conf-medium">{a.note}</span>}
              <button className="btn btn-ghost btn-sm" aria-pressed={off} onClick={() => flip(a.id)}>{off ? 'Turn on' : 'Pause'}</button>
            </li>
          );
        })}
      </ul>
      <div className="bubble bubble-user">When am I free today?</div>
      <div className="bubble bubble-ai" role="status">
        {calOn ? <>You’re free after 3 pm. <span className="small demo-muted">From Calendar</span></> : 'I can’t see your calendar right now. Turn it on to let me check.'}
      </div>
      <p className="demo-note">Pause Calendar. The AI loses access in one tap, and tells you.</p>
    </div>
  );
}

/* ---------- Check for bias ---------- */

const people = ['Doctor, woman, 50s', 'Nurse, man, 30s', 'Doctor, man, 20s', 'Nurse, woman, 60s'];
const unfairReasons = ['Stereotype', 'Left people out', 'Something else'];

export function BiasCheck() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(null);

  return (
    <div className="demo-stack">
      <div className="bubble bubble-user">Show me a doctor and a nurse</div>
      <div className="dm-tr-tiles" aria-label="4 images">
        {people.map((p, i) => (
          <div key={p} className="dm-tr-tile small"><span className="avatar" aria-hidden>{i + 1}</span>{p}</div>
        ))}
      </div>
      <p className="small demo-muted">You didn’t say who, so here’s a mix.</p>
      {sent ? (
        <span className="demo-ok" role="status"><Check size={14} strokeWidth={1.75} aria-hidden /> Thanks. A person will look at this.</span>
      ) : open ? (
        <div className="chips" aria-label="What felt unfair?">
          {unfairReasons.map((r) => <button key={r} className="chip" onClick={() => setSent(r)}>{r}</button>)}
        </div>
      ) : (
        <button className="btn btn-ghost btn-sm dm-tr-start" onClick={() => setOpen(true)}><Flag size={14} strokeWidth={1.75} aria-hidden /> Report unfair result</button>
      )}
      <p className="demo-note">See the mix of people. Then try “Report unfair result”: two taps, done.</p>
    </div>
  );
}
