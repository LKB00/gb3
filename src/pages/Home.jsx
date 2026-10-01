import { Link } from 'react-router-dom';
import { categories, patterns } from '../data/patterns';
import { lessons } from '../data/lessons';
import { visuals } from '../data/visuals';
import { usePassed } from '../progress';
import PatternCard from '../components/PatternCard';
import Compare from '../components/Compare';
import MockFrame, { MockBlock, MockSlot } from '../mock/Mock';

const featured = ['streaming-response', 'citations', 'plan-first', 'graceful-errors'];

export default function Home() {
  const passed = usePassed();
  const hero = visuals['streaming-response'].compare;

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-pill">✦ For designers · Free · Hands-on</p>
            <h1>Learn to design <span className="grad-text">great AI experiences</span></h1>
            <p className="lead">
              {patterns.length} AI design patterns, shown as pictures — not walls of text. Build each one yourself, and get told when you make a common mistake.
            </p>
            <div className="row">
              <Link to="/practice" className="btn btn-primary btn-lg">Start practicing</Link>
              <Link to="/patterns" className="btn btn-ghost btn-lg">Browse patterns</Link>
            </div>
          </div>
          <div className="hero-demo">
            <Compare data={hero} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Learn by doing</h2>
          <p className="section-lead">Two ways to practice. Both point out the mistakes designers and builders make most.</p>
          <div className="practice-cards">
            <Link to="/patterns/streaming-response#lab" className="card practice-card">
              <div className="practice-visual" aria-hidden>
                <MockFrame mini>
                  <MockBlock b={{ type: 'user', text: 'Summarize my notes' }} />
                  <MockSlot state="bad" marker={1} blocks={[{ type: 'spinner', text: 'Loading…' }]} />
                  <MockSlot state="good" marker={2} blocks={[{ type: 'buttons', items: ['-■ Stop'] }]} />
                </MockFrame>
              </div>
              <h3>🧪 Design Lab</h3>
              <p>Pick options to build an AI feature. Press <strong>Check</strong>: wrong parts turn red, with the reason why.</p>
            </Link>
            <Link to="/practice" className="card practice-card">
              <div className="practice-visual" aria-hidden>
                <MockFrame mini>
                  <MockBlock b={{ type: 'banner', tone: 'info', title: 'Meet Max 🚀', text: 'Knows everything!' }} state="found" marker={1} />
                  <MockBlock b={{ type: 'user', text: 'What did users say?' }} />
                  <MockBlock b={{ type: 'ai', text: 'They love it. Sales +40%.' }} state="found" marker={2} />
                </MockFrame>
              </div>
              <h3>🔍 Mistake Hunt</h3>
              <p>Real-looking AI screens with hidden mistakes. Tap what is wrong and learn the pattern that fixes it.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2>Six things every AI feature needs</h2>
          <p className="section-lead">Every pattern belongs to one of these groups.</p>
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

      <section className="section">
        <div className="container">
          <div className="row space-between section-head">
            <h2>Popular patterns</h2>
            <Link to="/patterns" className="link-like">See all {patterns.length} →</Link>
          </div>
          <div className="card-grid">
            {featured.map((id) => (
              <PatternCard key={id} pattern={patterns.find((p) => p.id === id)} passed={passed.includes(id)} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="row space-between section-head">
            <h2>The learning path</h2>
            <Link to="/learn" className="link-like">Open path →</Link>
          </div>
          <p className="section-lead">{lessons.length} short visual lessons, about {lessons.reduce((n, l) => n + l.minutes, 0)} minutes in total.</p>
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
