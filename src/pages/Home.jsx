import { Link } from 'react-router-dom';
import { categories, patterns } from '../data/patterns';
import { lessons } from '../data/lessons';
import PatternCard from '../components/PatternCard';
import DemoFrame from '../components/DemoFrame';

const featured = ['streaming-response', 'inline-suggestions', 'citations', 'feedback-loop'];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">For designers · Free · Hands-on</p>
            <h1>Learn to design great AI experiences</h1>
            <p className="lead">
              Clear, simple guides to AI design patterns and AI interaction design — with live demos you can click and try.
            </p>
            <div className="row">
              <Link to="/learn" className="btn btn-primary btn-lg">Start learning</Link>
              <Link to="/patterns" className="btn btn-ghost btn-lg">Browse {patterns.length} patterns</Link>
            </div>
          </div>
          <div className="hero-demo">
            <DemoFrame name="InlineSuggestion" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Five things every AI feature needs</h2>
          <p className="section-lead">Every pattern on this site belongs to one of these groups.</p>
          <div className="cat-grid">
            {categories.map((c) => (
              <Link key={c.id} to={`/patterns?category=${c.id}`} className={`card cat-card cat-${c.id}`}>
                <span className={`tag tag-${c.id}`}>{patterns.filter((p) => p.category === c.id).length} patterns</span>
                <h3>{c.name}</h3>
                <p>{c.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="row space-between section-head">
            <h2>Popular patterns</h2>
            <Link to="/patterns" className="link-like">See all →</Link>
          </div>
          <div className="card-grid">
            {featured.map((id) => (
              <PatternCard key={id} pattern={patterns.find((p) => p.id === id)} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="row space-between section-head">
            <h2>The learning path</h2>
            <Link to="/learn" className="link-like">Open path →</Link>
          </div>
          <p className="section-lead">{lessons.length} short lessons, about {lessons.reduce((n, l) => n + l.minutes, 0)} minutes in total.</p>
          <ol className="path-list">
            {lessons.map((l, i) => (
              <li key={l.id}>
                <Link to={`/learn/${l.id}`} className="path-item">
                  <span className="path-num">{i + 1}</span>
                  <span className="lesson-card-body">
                    <strong>{l.title}</strong>
                    <span className="small demo-muted">{l.level} · {l.minutes} min</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
