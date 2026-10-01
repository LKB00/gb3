import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Bot, Gauge, UserRound } from 'lucide-react';
import { getLevel, levels, questions, suggestLevel } from '../data/autonomy';
import { getPattern } from '../data/patterns';
import { fx } from '../game/fx';
import MockFrame, { MockBlock } from '../mock/Mock';
import LibraryTabs from '../components/LibraryTabs';
import { useTitle } from '../lib/useTitle';

// The autonomy ladder: five levels of AI power, from "suggest" to "act alone".
// Tap a step to see what it looks like and which patterns it needs.
// The level finder turns four quick answers into a starting level.
export function Ladder({ value, onPick, hint }) {
  return (
    <ol className="ladder" aria-label="Autonomy levels">
      {levels.map((l) => (
        <li key={l.n} style={{ '--step': l.n }}>
          <button
            type="button"
            className={'ladder-step' + (value === l.n ? ' is-on' : '') + (hint === l.n ? ' is-hint' : '')}
            aria-pressed={value === l.n}
            onClick={() => onPick(l.n)}
          >
            <span className="ladder-n">{l.n}</span>
            <span className="ladder-text">
              <strong>{l.name}</strong>
              <span>{l.short}</span>
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}

function LevelDetail({ level }) {
  return (
    <div className="ladder-detail" key={level.n}>
      <div className="ladder-detail-text">
        <p className="label">Level {level.n}</p>
        <h2 className="ladder-title">{level.name}</h2>
        <p className="lead">{level.line}</p>
        <div className="ladder-who">
          <span><UserRound size={15} strokeWidth={1.75} aria-hidden /> Decides: <strong>{level.decides}</strong></span>
          <span><Bot size={15} strokeWidth={1.75} aria-hidden /> Does it: <strong>{level.acts}</strong></span>
        </div>
        <p className="label">Good for</p>
        <ul className="ladder-list">
          {level.use.map((u) => <li key={u}>{u}</li>)}
        </ul>
        <p className="label">Watch out</p>
        <p className="ladder-risk">{level.risk}</p>
        <p className="label">Patterns to build</p>
        <div className="row wrap">
          {level.patterns.map((id) => (
            <Link key={id} to={`/patterns/${id}`} className="chip chip-sm">{getPattern(id).title}</Link>
          ))}
        </div>
      </div>
      <div className="ladder-mock">
        <MockFrame title={level.app}>
          {level.screen.map((b, i) => <MockBlock key={i} b={b} />)}
        </MockFrame>
      </div>
    </div>
  );
}

function Finder({ onResult }) {
  const [answers, setAnswers] = useState({});
  const done = questions.every((q) => answers[q.id]);
  const result = done ? getLevel(suggestLevel(answers)) : null;
  const set = (id, v) => {
    const next = { ...answers, [id]: v };
    setAnswers(next);
    if (questions.every((q) => next[q.id])) {
      fx('right', { streak: 2 });
      onResult(suggestLevel(next));
    }
  };
  return (
    <div className="finder">
      {questions.map((q, i) => (
        <fieldset key={q.id} className="finder-q">
          <legend><span className="finder-n">{i + 1}</span> {q.q}</legend>
          <div className="finder-opts" role="radiogroup">
            {q.options.map(([v, label]) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={answers[q.id] === v}
                className={'finder-opt' + (answers[q.id] === v ? ' is-on' : '')}
                onClick={() => set(q.id, v)}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
      ))}
      <div className={'finder-result' + (result ? ' is-ready' : '')} aria-live="polite">
        {result ? (
          <>
            <span className="ladder-n">{result.n}</span>
            <span>
              Start at <strong>{result.name}</strong>: {result.short}.
              <span className="small muted"> A starting point, not a rule. Test it with real people.</span>
            </span>
          </>
        ) : (
          <span className="muted">Answer all four to see a starting level.</span>
        )}
      </div>
    </div>
  );
}

export default function Autonomy() {
  useTitle('Autonomy ladder');
  const [params, setParams] = useSearchParams();
  const n = Number(params.get('level')) || 3;
  const level = getLevel(n) || getLevel(3);
  const [hint, setHint] = useState(null);
  const pick = (k) => {
    fx('select');
    setParams({ level: String(k) }, { replace: true, preventScrollReset: true });
  };

  return (
    <div className="page page-wide page-lib-read">
      <LibraryTabs />
      <header className="page-head">
        <h1 className="display">How much power should the AI have?</h1>
        <p className="lead">
          Five levels, from “it only suggests” to “it just handles it”. The AI being <em>able</em> to do something doesn’t mean it <em>should</em>. Match the power to the risk.
        </p>
      </header>

      <section className="block ladder-block">
        <Ladder value={level.n} onPick={pick} hint={hint} />
        <LevelDetail level={level} />
      </section>

      <section className="block">
        <div className="section-head">
          <h2>Find the level</h2>
          <p className="section-sub">Four quick questions about your feature.</p>
        </div>
        <Finder
          onResult={(k) => {
            setHint(k);
            setParams({ level: String(k) }, { replace: true, preventScrollReset: true });
          }}
        />
      </section>

      <section className="block ladder-block">
        <ul className="ladder-rules">
          <li><strong>Start low, earn more.</strong> Begin at Confirm or Draft. Move up when people trust it and mistakes are rare.</li>
          <li><strong>One product, many levels.</strong> Sorting email can be Act alone while sending email stays Confirm.</li>
          <li><strong>Let people choose.</strong> An autonomy setting lets each person pick their own level per task.</li>
        </ul>
        <Link to="/play/power" className="ladder-cta">
          <Gauge size={22} strokeWidth={1.75} aria-hidden />
          <span>
            <strong>Test yourself: How much power?</strong>
            <span>8 real tasks. Pick the right level for each.</span>
          </span>
          <ArrowRight size={18} strokeWidth={1.75} aria-hidden />
        </Link>
      </section>
    </div>
  );
}
