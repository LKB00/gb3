import { Link } from 'react-router-dom';
import { Lock, Star } from 'lucide-react';
import { visuals } from '../data/visuals';
import MockFrame, { MockBlock } from '../mock/Mock';

// A collectible pattern card: number, picture of the better design, stars won.
// Collected = a lime ring and its stars. Not collected yet = soft and grey, with a small lock.
// No group tag: the page already shows the group (a heading, or the chosen group chip).
export default function PatternCard({ pattern, number, passed, stars = 0 }) {
  const good = visuals[pattern.id].compare.good;
  return (
    <Link to={`/patterns/${pattern.id}`} className={'card pattern-card' + (passed ? ' is-collected' : ' is-locked')}>
      <div className={`thumb thumb-${pattern.category}`} aria-hidden>
        <span className="card-no">#{String(number).padStart(2, '0')}</span>
        <MockFrame mini>
          {good.blocks.map((b, i) => <MockBlock key={i} b={b} />)}
        </MockFrame>
      </div>
      <div className="pattern-card-body">
        <div className="pattern-card-meta">
          {passed ? (
            <span className="card-stars" aria-label={`${stars} of 3 stars`}>
              {[1, 2, 3].map((n) => <Star key={n} size={13} strokeWidth={1.75} className={n <= stars ? 'is-on' : ''} aria-hidden />)}
            </span>
          ) : (
            <span className="card-lock" role="img" aria-label="Not collected yet" title="Play it to collect it"><Lock size={13} strokeWidth={1.75} aria-hidden /></span>
          )}
        </div>
        <h3 aria-level="2">{pattern.title}</h3>
        <p>{pattern.summary}</p>
      </div>
    </Link>
  );
}
