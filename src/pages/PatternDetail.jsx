import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getCategory, getPattern, patterns } from '../data/patterns';
import { visuals } from '../data/visuals';
import { lessons } from '../data/lessons';
import { usePassed } from '../progress';
import DemoFrame from '../components/DemoFrame';
import Compare from '../components/Compare';
import Lab from '../components/Lab';
import NotFound from './NotFound';

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
    <article className="container page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/patterns">Patterns</Link> / <Link to={`/patterns?category=${p.category}`}>{cat.name}</Link>
      </nav>
      <div className="row">
        <span className={`tag tag-${p.category}`}>{cat.name}</span>
        {passed.includes(p.id) && <span className="tag tag-done">✓ Lab passed</span>}
      </div>
      <h1>{p.title}</h1>
      <p className="lead">{p.summary}</p>

      <section aria-labelledby="see">
        <h2 id="see" className="step-heading"><span>1</span> See the difference</h2>
        <Compare data={v.compare} />
      </section>

      {p.demo && (
        <section aria-labelledby="try">
          <h2 id="try" className="step-heading"><span>2</span> Try it live</h2>
          <DemoFrame name={p.demo} />
        </section>
      )}

      <section id="lab" aria-labelledby="lab-h">
        <h2 id="lab-h" className="step-heading"><span>{p.demo ? 3 : 2}</span> Design Lab: build it yourself</h2>
        <Lab key={p.id} id={p.id} lab={v.lab} />
      </section>

      <section aria-labelledby="rules">
        <h2 id="rules" className="step-heading"><span>{p.demo ? 4 : 3}</span> Quick rules</h2>
        <div className="two-col rules">
          <ul className="rule-list rule-do">{p.dos.map((d) => <li key={d}>{d}</li>)}</ul>
          <ul className="rule-list rule-dont">{p.donts.map((d) => <li key={d}>{d}</li>)}</ul>
        </div>
      </section>

      <details className="more">
        <summary>Read more: problem, solution, when to use</summary>
        <div className="two-col">
          <div>
            <h3>The problem</h3>
            <p>{p.problem}</p>
          </div>
          <div>
            <h3>The solution</h3>
            <p>{p.solution}</p>
          </div>
          <div>
            <h3>Use it when</h3>
            <ul className="list list-check">{p.when.map((w) => <li key={w}>{w}</li>)}</ul>
          </div>
          <div>
            <h3>Avoid it when</h3>
            <ul className="list list-dash">{p.avoid.map((w) => <li key={w}>{w}</li>)}</ul>
          </div>
        </div>
        <h3>Where you see it</h3>
        <ul className="list list-dash">{p.examples.map((e) => <li key={e}>{e}</li>)}</ul>
      </details>

      {relatedLessons.length > 0 && (
        <div className="row wrap related">
          <span className="demo-muted">Learn more in:</span>
          {relatedLessons.map((l) => (
            <Link key={l.id} to={`/learn/${l.id}`} className="chip">{l.title}</Link>
          ))}
        </div>
      )}

      <nav className="pager" aria-label="More patterns">
        {prev ? <Link to={`/patterns/${prev.id}`}>← {prev.title}</Link> : <span />}
        {next ? <Link to={`/patterns/${next.id}`}>{next.title} →</Link> : <Link to="/practice">Go to Practice →</Link>}
      </nav>
    </article>
  );
}
