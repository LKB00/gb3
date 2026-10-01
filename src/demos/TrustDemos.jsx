import { Check, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

/* ---------- Citations ---------- */

const sources = [
  { id: 1, title: 'Q3 user research report', quote: '"7 of 10 participants could not find the export button."' },
  { id: 2, title: 'Support tickets — September', quote: '"Export" was the 2nd most common topic, with 312 tickets.' },
  { id: 3, title: 'Analytics dashboard', quote: 'Only 4% of weekly users opened the export menu.' },
];

export function Citations() {
  const [open, setOpen] = useState(null);
  const Cite = ({ n }) => (
    <button className={'cite' + (open === n ? ' cite-on' : '')} onClick={() => setOpen(open === n ? null : n)} aria-label={`Source ${n}`}>
      {n}
    </button>
  );

  return (
    <div className="demo-stack">
      <div className="bubble bubble-user">Why do people struggle with export?</div>
      <div className="bubble bubble-ai">
        <p>
          Most people cannot find it: in testing, 7 of 10 participants missed the export button <Cite n={1} />. It is also a top support topic <Cite n={2} />, and very few users ever open the export menu <Cite n={3} />.
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
  { label: 'Total', value: '₹ 48,500', level: 'medium', hint: 'Blurry digit — may be 46,500' },
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
      <p className="demo-note">Words + icon + color, not color only. People know where to look first.</p>
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
      <p className="demo-note">Edit the text — the label changes from “AI generated” to “AI-assisted”. Tap the label to learn more.</p>
    </div>
  );
}
