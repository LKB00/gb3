import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { getCategory, getPattern, patterns } from '../data/patterns';
import { visuals } from '../data/visuals';
import { lessons } from '../data/lessons';
import { usePassed } from '../progress';
import DemoFrame from '../components/DemoFrame';
import Compare from '../components/Compare';
import Lab from '../components/Lab';
import RealExamples from '../components/RealExamples';
import PrincipleList from '../components/PrincipleList';
import { useTitle } from '../useTitle';
import NotFound from './NotFound';

const ICON = { size: 14, strokeWidth: 2, 'aria-hidden': true };

// Section headings, each with one line saying why it is on the page.
function Section({ id, title, sub, children }) {
  return (
    <section className="block" id={id}>
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
  const { hash } = useLocation();
  const passed = usePassed();
  const p = getPattern(id);
  useTitle(p?.title);

  useEffect(() => {
    if (hash === '#lab') document.getElementById('lab')?.scrollIntoView();
  }, [id, hash]);

  if (!p) return <NotFound />;

  const v = visuals[p.id];
  const cat = getCategory(p.category);
  const idx = patterns.indexOf(p);
  const prev = patterns[idx - 1];
  const next = patterns[idx + 1];
  const relatedLessons = lessons.filter((l) => l.patterns.includes(p.id));
  const sections = [
    { id: 'lab', label: 'Build it' },
    { id: 'difference', label: 'Answer' },
    { id: 'examples', label: 'Real examples' },
    { id: 'principles', label: 'Principles' },
    p.demo && { id: 'try', label: 'Try it' },
    { id: 'rules', label: 'Rules' },
    { id: 'details', label: 'Details' },
  ].filter(Boolean);
  // The router uses the URL hash, so in-page jumps scroll directly.
  const jump = (sid) => document.getElementById(sid)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <article className="page">
      <header className="page-head">
        <div className="row">
          <Link to={`/patterns?category=${p.category}`} className={`tag tag-${p.category}`}>{cat.name}</Link>
          {passed.includes(p.id) && <span className="tag tag-done"><Check size={10} strokeWidth={2.5} aria-hidden /> Lab passed</span>}
        </div>
        <h1 className="display">{p.title}</h1>
        <p className="lead">{p.summary}</p>
        <div className="why">
          <p className="label">Why it matters</p>
          <p>{p.problem}</p>
        </div>
      </header>

      <nav className="on-page" aria-label="On this page">
        <span className="label">On this page</span>
        {sections.map((s) => (
          <button key={s.id} className="on-page-link" onClick={() => jump(s.id)}>{s.label}</button>
        ))}
      </nav>

      <Section id="lab" title="Build it first" sub="Start by doing. Make the design decisions yourself; the lab checks them and explains every mistake. The answer is further down.">
        <Lab key={p.id} id={p.id} lab={v.lab} />
      </Section>

      <Section id="difference" title="Compare with the expert answer" sub="The same moment designed two ways. Did your design avoid the mistakes on the left?">
        <Compare data={v.compare} />
      </Section>

      <Section id="examples" title="Real examples" sub="Products you may already use that follow this pattern.">
        <RealExamples id={p.id} />
      </Section>

      <Section id="principles" title="Principles behind it" sub="The UX and psychology ideas that make this pattern work.">
        <PrincipleList id={p.id} />
      </Section>

      {p.demo && (
        <Section id="try" title="Try it live" sub="A working version of the better design. Click around and feel the difference.">
          <DemoFrame name={p.demo} />
        </Section>
      )}

      <Section id="rules" title="Rules of thumb" sub="A short checklist to use in your own work.">
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

      <Section id="details" title="Details">
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

      <nav className="pager" aria-label="More patterns">
        {prev ? (
          <Link to={`/patterns/${prev.id}`} className="pager-link">
            <span className="label">Previous</span>
            <span><ArrowLeft size={14} strokeWidth={1.75} aria-hidden /> {prev.title}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`/patterns/${next.id}`} className="pager-link pager-next">
            <span className="label">Next</span>
            <span>{next.title} <ArrowRight size={14} strokeWidth={1.75} aria-hidden /></span>
          </Link>
        ) : (
          <Link to="/practice" className="pager-link pager-next">
            <span className="label">Next</span>
            <span>Practice <ArrowRight size={14} strokeWidth={1.75} aria-hidden /></span>
          </Link>
        )}
      </nav>
    </article>
  );
}
