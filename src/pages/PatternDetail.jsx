import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Gamepad2, Lightbulb, ScrollText, Star, X } from 'lucide-react';
import { getCategory, getPattern, patterns } from '../data/patterns';
import { visuals } from '../data/visuals';
import { lessons } from '../data/lessons';
import { usePassed, useStars } from '../progress';
import DemoFrame from '../components/DemoFrame';
import Compare from '../components/Compare';
import Lab from '../components/Lab';
import RealExamples from '../components/RealExamples';
import PrincipleList from '../components/PrincipleList';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTitle } from '../lib/useTitle';
import NotFound from './NotFound';

const ICON = { size: 14, strokeWidth: 2, 'aria-hidden': true };

// One pattern card = three short views instead of one long page:
//   Play          → the "Fix it" challenge (playing comes first)
//   Why it works  → the winning design, real products, principles
//   Cheat sheet   → rules of thumb and details, for later
const VIEWS = [
  { id: 'do', label: 'Play', icon: Gamepad2 },
  { id: 'understand', label: 'Why it works', icon: Lightbulb },
  { id: 'reference', label: 'Cheat sheet', icon: ScrollText },
];

function Section({ title, sub, children }) {
  return (
    <section className="block">
      <div className="section-head">
        <h2>{title}</h2>
        {sub && <p className="section-sub">{sub}</p>}
      </div>
      {children}
    </section>
  );
}

export default function PatternDetail() {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const passed = usePassed();
  const stars = useStars();
  const p = getPattern(id);
  useTitle(p?.title);
  if (!p) return <NotFound />;

  const view = VIEWS.some((v) => v.id === params.get('view')) ? params.get('view') : 'do';
  const go = (v) => {
    setParams(v === 'do' ? {} : { view: v }, { replace: true });
    window.scrollTo({ top: 0 });
  };

  const v = visuals[p.id];
  const cat = getCategory(p.category);
  const idx = patterns.indexOf(p);
  const prev = patterns[idx - 1];
  const next = patterns[idx + 1];
  const done = passed.includes(p.id);
  const relatedLessons = lessons.filter((l) => l.patterns.includes(p.id));

  return (
    <article className="page">
      <Breadcrumbs
        items={[
          { label: 'Cards', to: '/patterns' },
          { label: cat.name, to: `/patterns?category=${p.category}` },
          { label: p.title },
        ]}
      />

      <header className="page-head page-head-tight">
        <div className="row">
          <span className={`tag tag-${p.category}`}>{cat.name}</span>
          <span className="muted small">Card #{String(idx + 1).padStart(2, '0')}</span>
          {done && (
            <span className="card-stars" aria-label={`Collected, ${stars[p.id] || 1} of 3 stars`}>
              {[1, 2, 3].map((n) => <Star key={n} size={14} strokeWidth={1.75} className={n <= (stars[p.id] || 1) ? 'is-on' : ''} aria-hidden />)}
            </span>
          )}
        </div>
        <h1 className="display">{p.title}</h1>
        <p className="lead">{p.summary}</p>
      </header>

      <div className="tabs view-tabs" role="tablist" aria-label="Views">
        {VIEWS.map((t) => (
          <button key={t.id} role="tab" aria-selected={view === t.id} className={'tab' + (view === t.id ? ' active' : '')} onClick={() => go(t.id)}>
            <t.icon size={15} strokeWidth={1.75} aria-hidden />
            {t.label}
          </button>
        ))}
      </div>

      {view === 'do' && (
        <div className="view">
          <Lab
            key={p.id}
            id={p.id}
            lab={v.lab}
            next={
              <button type="button" className="btn btn-primary" onClick={() => go('understand')}>
                See why it works <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
              </button>
            }
          />
        </div>
      )}

      {view === 'understand' && (
        <div className="view">
          <div className="why">
            <p className="label">Why it matters</p>
            <p>{p.problem}</p>
          </div>
          <Section title="The winning design" sub="The same moment, designed two ways.">
            <Compare data={v.compare} />
          </Section>
          {p.demo && (
            <Section title="Try the better version" sub="A small working demo.">
              <DemoFrame name={p.demo} />
            </Section>
          )}
          {p.category === 'agents' && (
            <Link to="/autonomy" className="ladder-cta ladder-cta-sm">
              <span>
                <strong>How much power should an agent have?</strong>
                <span>See the 5-step autonomy ladder.</span>
              </span>
              <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
            </Link>
          )}
          <Section title="Seen in real products">
            <RealExamples id={p.id} />
          </Section>
          <Section title="Why it works" sub="The UX and psychology principles behind it.">
            <PrincipleList id={p.id} />
          </Section>
        </div>
      )}

      {view === 'reference' && (
        <div className="view">
          <Section title="Rules of thumb">
            <div className="rules">
              <div>
                <p className="label">Do</p>
                <ul className="rule-list rule-do">
                  {p.dos.map((d) => <li key={d}><Check {...ICON} />{d}</li>)}
                </ul>
              </div>
              <div>
                <p className="label">Don’t</p>
                <ul className="rule-list rule-dont">
                  {p.donts.map((d) => <li key={d}><X {...ICON} />{d}</li>)}
                </ul>
              </div>
            </div>
          </Section>
          <Section title="Details">
            <dl className="details">
              <dt>Solution</dt>
              <dd>{p.solution}</dd>
              <dt>Use it when</dt>
              <dd><ul>{p.when.map((w) => <li key={w}>{w}</li>)}</ul></dd>
              <dt>Avoid it when</dt>
              <dd><ul>{p.avoid.map((w) => <li key={w}>{w}</li>)}</ul></dd>
              {relatedLessons.length > 0 && (
                <>
                  <dt>Lessons</dt>
                  <dd className="row wrap">
                    {relatedLessons.map((l) => <Link key={l.id} to={`/learn/${l.id}`} className="chip">{l.title}</Link>)}
                  </dd>
                </>
              )}
            </dl>
          </Section>
        </div>
      )}

      <nav className="pager" aria-label="More cards">
        {prev ? (
          <Link to={`/patterns/${prev.id}`} className="pager-link">
            <span className="label">Previous</span>
            <span><ArrowLeft size={14} strokeWidth={1.75} aria-hidden /> {prev.title}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`/patterns/${next.id}`} className="pager-link pager-next">
            <span className="label">Next card</span>
            <span>{next.title} <ArrowRight size={14} strokeWidth={1.75} aria-hidden /></span>
          </Link>
        ) : (
          <Link to="/play" className="pager-link pager-next">
            <span className="label">Next</span>
            <span>More games <ArrowRight size={14} strokeWidth={1.75} aria-hidden /></span>
          </Link>
        )}
      </nav>
    </article>
  );
}
