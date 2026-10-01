import { Link, useParams } from 'react-router-dom';
import { getCategory, getPattern, patterns } from '../data/patterns';
import { lessons } from '../data/lessons';
import DemoFrame from '../components/DemoFrame';
import NotFound from './NotFound';

export default function PatternDetail() {
  const { id } = useParams();
  const p = getPattern(id);
  if (!p) return <NotFound />;

  const idx = patterns.indexOf(p);
  const prev = patterns[idx - 1];
  const next = patterns[idx + 1];
  const relatedLessons = lessons.filter((l) => l.patterns.includes(p.id));

  return (
    <article className="container page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/patterns">Patterns</Link> / <Link to={`/patterns?category=${p.category}`}>{getCategory(p.category).name}</Link>
      </nav>
      <span className={`tag tag-${p.category}`}>{getCategory(p.category).name}</span>
      <h1>{p.title}</h1>
      <p className="lead">{p.summary}</p>

      <DemoFrame name={p.demo} />

      <div className="two-col">
        <section className="panel">
          <h2>The problem</h2>
          <p>{p.problem}</p>
        </section>
        <section className="panel panel-accent">
          <h2>The solution</h2>
          <p>{p.solution}</p>
        </section>
      </div>

      <div className="two-col">
        <section>
          <h2>Use it when</h2>
          <ul className="list list-check">{p.when.map((w) => <li key={w}>{w}</li>)}</ul>
        </section>
        <section>
          <h2>Avoid it when</h2>
          <ul className="list list-dash">{p.avoid.map((w) => <li key={w}>{w}</li>)}</ul>
        </section>
      </div>

      <div className="two-col">
        <section className="panel panel-do">
          <h2>✓ Do</h2>
          <ul className="list">{p.dos.map((d) => <li key={d}>{d}</li>)}</ul>
        </section>
        <section className="panel panel-dont">
          <h2>✕ Don't</h2>
          <ul className="list">{p.donts.map((d) => <li key={d}>{d}</li>)}</ul>
        </section>
      </div>

      <section>
        <h2>Where you see it</h2>
        <ul className="list list-dash">{p.examples.map((e) => <li key={e}>{e}</li>)}</ul>
      </section>

      {relatedLessons.length > 0 && (
        <section>
          <h2>Learn more in</h2>
          <div className="row wrap">
            {relatedLessons.map((l) => (
              <Link key={l.id} to={`/learn/${l.id}`} className="chip">📘 {l.title}</Link>
            ))}
          </div>
        </section>
      )}

      <nav className="pager" aria-label="More patterns">
        {prev ? <Link to={`/patterns/${prev.id}`}>← {prev.title}</Link> : <span />}
        {next ? <Link to={`/patterns/${next.id}`}>{next.title} →</Link> : <span />}
      </nav>
    </article>
  );
}
