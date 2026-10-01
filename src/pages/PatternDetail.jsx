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
import NotFound from './NotFound';

const ICON = { size: 14, strokeWidth: 2, 'aria-hidden': true };

export default function PatternDetail() {
  const { id } = useParams();
  const { hash } = useLocation();
  const passed = usePassed();
  const p = getPattern(id);

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

  return (
    <article className="page">
      <header className="page-head">
        <div className="row">
          <Link to={`/patterns?category=${p.category}`} className={`tag tag-${p.category}`}>{cat.name}</Link>
          {passed.includes(p.id) && <span className="tag tag-done"><Check size={10} strokeWidth={2.5} aria-hidden /> Lab passed</span>}
        </div>
        <h1 className="display">{p.title}</h1>
        <p className="lead">{p.summary}</p>
      </header>

      <section className="block">
        <h2>See the difference</h2>
        <Compare data={v.compare} />
      </section>

      {p.demo && (
        <section className="block">
          <h2>Try it</h2>
          <DemoFrame name={p.demo} />
        </section>
      )}

      <section className="block" id="lab">
        <h2>Design Lab</h2>
        <p className="section-sub">Build it yourself. The lab checks your design for common mistakes.</p>
        <Lab key={p.id} id={p.id} lab={v.lab} />
      </section>

      <section className="block">
        <h2>Rules of thumb</h2>
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
      </section>

      <section className="block">
        <h2>Details</h2>
        <dl className="details">
          <dt>Problem</dt>
          <dd>{p.problem}</dd>
          <dt>Solution</dt>
          <dd>{p.solution}</dd>
          <dt>Use it when</dt>
          <dd><ul>{p.when.map((w) => <li key={w}>{w}</li>)}</ul></dd>
          <dt>Avoid it when</dt>
          <dd><ul>{p.avoid.map((w) => <li key={w}>{w}</li>)}</ul></dd>
          <dt>Seen in</dt>
          <dd><ul>{p.examples.map((e) => <li key={e}>{e}</li>)}</ul></dd>
          {relatedLessons.length > 0 && (
            <>
              <dt>Lessons</dt>
              <dd className="row wrap">
                {relatedLessons.map((l) => <Link key={l.id} to={`/learn/${l.id}`} className="chip">{l.title}</Link>)}
              </dd>
            </>
          )}
        </dl>
      </section>

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
