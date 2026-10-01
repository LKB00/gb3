import { useTitle } from '../useTitle';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, ChevronRight, FlaskConical, ScanSearch } from 'lucide-react';
import { categories, patterns } from '../data/patterns';
import { lessons } from '../data/lessons';
import { visuals } from '../data/visuals';
import Compare from '../components/Compare';

const ARROW = { size: 15, strokeWidth: 1.75, 'aria-hidden': true };

export default function Home() {
  useTitle(null);
  return (
    <div className="page">
      <header className="page-head">
        <p className="label">AI interaction design</p>
        <h1 className="display">Design AI that people understand and trust.</h1>
        <p className="lead">
          {patterns.length} patterns for AI features. Each one is shown as a picture, with a hands-on lab that points out the mistakes designers make most.
        </p>
        <div className="actions">
          <Link to="/learn" className="btn btn-primary">Start learning <ArrowRight {...ARROW} /></Link>
          <Link to="/practice" className="btn btn-ghost">Practice</Link>
        </div>
      </header>

      <section className="block">
        <h2>How each pattern works</h2>
        <ol className="steps-how">
          <li>
            <span className="index-num">1</span>
            <strong>See the difference</strong>
            <span>A bad and a better screen, side by side.</span>
          </li>
          <li>
            <span className="index-num">2</span>
            <strong>Know why</strong>
            <span>The problem it solves, in one short paragraph.</span>
          </li>
          <li>
            <span className="index-num">3</span>
            <strong>Build it yourself</strong>
            <span>The Design Lab checks your choices for common mistakes.</span>
          </li>
        </ol>
        <div className="example">
          <p className="label">Example · Show progress</p>
          <Compare data={visuals['streaming-response'].compare} />
          <Link to="/patterns/streaming-response" className="text-link">
            Open this pattern <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      </section>

      <section className="block">
        <h2>Patterns</h2>
        {categories.map((c) => (
          <div key={c.id} className="index-group">
            <div className="index-head">
              <span className={`tag tag-${c.id}`}>{c.name}</span>
              <span className="muted">{c.blurb}</span>
            </div>
            <ul className="index-list">
              {patterns.filter((p) => p.category === c.id).map((p) => (
                <li key={p.id}>
                  <Link to={`/patterns/${p.id}`} className="index-row">
                    <span className="index-title">{p.title}</span>
                    <span className="index-sum">{p.summary}</span>
                    <ChevronRight size={16} strokeWidth={1.75} className="index-chev" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="block">
        <h2>Learn by doing</h2>
        <ul className="index-list">
          <li>
            <Link to="/practice" className="index-row index-row-icon">
              <ScanSearch size={18} strokeWidth={1.5} aria-hidden />
              <span className="index-title">Mistake Hunt</span>
              <span className="index-sum">Find the mistakes in real-looking AI screens.</span>
              <ChevronRight size={16} strokeWidth={1.75} className="index-chev" aria-hidden />
            </Link>
          </li>
          <li>
            <Link to="/patterns/streaming-response#lab" className="index-row index-row-icon">
              <FlaskConical size={18} strokeWidth={1.5} aria-hidden />
              <span className="index-title">Design Labs</span>
              <span className="index-sum">Build a feature, then check it for common mistakes.</span>
              <ChevronRight size={16} strokeWidth={1.75} className="index-chev" aria-hidden />
            </Link>
          </li>
          <li>
            <Link to="/learn" className="index-row index-row-icon">
              <BookOpen size={18} strokeWidth={1.5} aria-hidden />
              <span className="index-title">Learning path</span>
              <span className="index-sum">{lessons.length} short lessons, from basics to AI agents.</span>
              <ChevronRight size={16} strokeWidth={1.75} className="index-chev" aria-hidden />
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
