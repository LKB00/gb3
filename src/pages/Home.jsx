import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Brain, Check, ChevronRight, Circle, Layers, ScanSearch, ShieldAlert } from 'lucide-react';
import { categories, patterns } from '../data/patterns';
import { lessons } from '../data/lessons';
import { hunts } from '../data/hunts';
import { visuals } from '../data/visuals';
import { useHuntsDone, usePassed } from '../progress';
import Lab from '../components/Lab';
import { useTitle } from '../useTitle';

const ARROW = { size: 15, strokeWidth: 1.75, 'aria-hidden': true };
const FIRST = 'streaming-response';

export default function Home() {
  useTitle(null);
  const passed = usePassed();
  const huntsDone = useHuntsDone();
  const next = patterns.find((p) => !passed.includes(p.id));

  return (
    <div className="page">
      <header className="page-head">
        <p className="label">Learn AI interaction design by doing</p>
        <h1 className="display">Don’t just read about AI design. Practice it.</h1>
        <p className="lead">
          Make real design decisions for AI features, get told the moment you make a common mistake, then see why. {patterns.length} hands-on labs, no sign-up.
        </p>
        <div className="actions">
          {passed.length === 0 ? (
            <a href="#first-lab" className="btn btn-primary" onClick={(e) => { e.preventDefault(); document.getElementById('first-lab')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Start your first lab <ArrowRight {...ARROW} />
            </a>
          ) : next ? (
            <Link to={`/patterns/${next.id}#lab`} className="btn btn-primary">Continue: {next.title} <ArrowRight {...ARROW} /></Link>
          ) : (
            <Link to="/practice" className="btn btn-primary">Keep practicing <ArrowRight {...ARROW} /></Link>
          )}
          <Link to="/practice" className="btn btn-ghost">Find the mistakes</Link>
        </div>
        {passed.length + huntsDone.length > 0 && (
          <p className="small muted">You’ve passed {passed.length} of {patterns.length} labs and finished {huntsDone.length} of {hunts.length} hunts.</p>
        )}
      </header>

      <section className="block" id="first-lab">
        <div className="section-head">
          <p className="label">Your first lab · about 1 minute</p>
          <h2>Design the waiting state for an AI answer</h2>
          <p className="section-sub">Pick one option for each decision, then press “Check my design”.</p>
        </div>
        <Lab id={FIRST} lab={visuals[FIRST].lab} />
        <Link to={`/patterns/${FIRST}`} className="text-link">
          Why these answers? Open the full pattern <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
        </Link>
      </section>

      <section className="block">
        <h2>How you learn here</h2>
        <ol className="steps-how">
          <li>
            <span className="index-num">1</span>
            <strong>Do it</strong>
            <span>Make the design decisions yourself in a Design Lab, or hunt for mistakes in a real-looking screen.</span>
          </li>
          <li>
            <span className="index-num">2</span>
            <strong>Get feedback</strong>
            <span>Each choice is checked right away. Mistakes are marked and explained in plain words.</span>
          </li>
          <li>
            <span className="index-num">3</span>
            <strong>Understand why</strong>
            <span>Compare with the expert answer, real products and the principles behind it.</span>
          </li>
        </ol>
      </section>

      <section className="block">
        <div className="section-head">
          <h2>All labs</h2>
          <p className="section-sub">One lab per pattern. A check means you passed it.</p>
        </div>
        {categories.map((c) => (
          <div key={c.id} className="index-group">
            <div className="index-head">
              <span className={`tag tag-${c.id}`}>{c.name}</span>
              <span className="muted">{c.blurb}</span>
              <span className="muted small index-count">
                {patterns.filter((p) => p.category === c.id && passed.includes(p.id)).length}/{patterns.filter((p) => p.category === c.id).length} passed
              </span>
            </div>
            <ul className="index-list">
              {patterns.filter((p) => p.category === c.id).map((p) => (
                <li key={p.id}>
                  <Link to={`/patterns/${p.id}#lab`} className={'index-row index-row-icon' + (passed.includes(p.id) ? ' index-done' : '')}>
                    {passed.includes(p.id) ? (
                      <Check size={16} strokeWidth={2} className="index-check-on" aria-label="Passed" />
                    ) : (
                      <Circle size={16} strokeWidth={1.5} className="index-check-off" aria-label="Not done yet" />
                    )}
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
        <h2>More ways to practice and learn</h2>
        <ul className="index-list">
          <li>
            <Link to="/practice" className="index-row index-row-icon">
              <ScanSearch size={18} strokeWidth={1.5} aria-hidden />
              <span className="index-title">Mistake Hunt</span>
              <span className="index-sum">Find the mistakes in {hunts.length} real-looking AI screens.</span>
              <ChevronRight size={16} strokeWidth={1.75} className="index-chev" aria-hidden />
            </Link>
          </li>
          <li>
            <Link to="/learn" className="index-row index-row-icon">
              <BookOpen size={18} strokeWidth={1.5} aria-hidden />
              <span className="index-title">Learning path</span>
              <span className="index-sum">{lessons.length} short lessons, each ending with labs to do.</span>
              <ChevronRight size={16} strokeWidth={1.75} className="index-chev" aria-hidden />
            </Link>
          </li>
          <li>
            <Link to="/teardowns" className="index-row index-row-icon">
              <Layers size={18} strokeWidth={1.5} aria-hidden />
              <span className="index-title">Teardowns</span>
              <span className="index-sum">How ChatGPT, Perplexity, GitHub Copilot and Claude Code use the patterns.</span>
              <ChevronRight size={16} strokeWidth={1.75} className="index-chev" aria-hidden />
            </Link>
          </li>
          <li>
            <Link to="/anti-patterns" className="index-row index-row-icon">
              <ShieldAlert size={18} strokeWidth={1.5} aria-hidden />
              <span className="index-title">Anti-patterns</span>
              <span className="index-sum">Eight AI dark patterns, why they harm people, and what to do instead.</span>
              <ChevronRight size={16} strokeWidth={1.75} className="index-chev" aria-hidden />
            </Link>
          </li>
          <li>
            <Link to="/principles" className="index-row index-row-icon">
              <Brain size={18} strokeWidth={1.5} aria-hidden />
              <span className="index-title">Principles</span>
              <span className="index-sum">The psychology behind the patterns, and Microsoft’s 18 guidelines.</span>
              <ChevronRight size={16} strokeWidth={1.75} className="index-chev" aria-hidden />
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
