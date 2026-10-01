import { Link } from 'react-router-dom';
import { Lock, Star } from 'lucide-react';
import { getCategory } from '../data/patterns';
import { visuals } from '../data/visuals';
import MockFrame, { MockBlock } from '../mock/Mock';

// A collectible pattern card: number, picture of the better design, stars won.
// Not collected yet = soft and grey, with a hint to play it.
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
        <div className="row space-between">
          <span className={`tag tag-${pattern.category}`}>{getCategory(pattern.category).name}</span>
          {passed ? (
            <span className="card-stars" aria-label={`${stars} of 3 stars`}>
              {[1, 2, 3].map((n) => <Star key={n} size={13} strokeWidth={1.75} className={n <= stars ? 'is-on' : ''} aria-hidden />)}
            </span>
          ) : (
            <span className="card-lock"><Lock size={12} strokeWidth={1.75} aria-hidden /> Play to collect</span>
          )}
        </div>
        <h3 aria-level="2">{pattern.title}</h3>
        <p>{pattern.summary}</p>
      </div>
    </Link>
  );
}
