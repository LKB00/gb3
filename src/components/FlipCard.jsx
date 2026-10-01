import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { getCategory, getPattern, patterns } from '../data/patterns';
import { visuals } from '../data/visuals';
import MockFrame, { MockBlock } from '../mock/Mock';
import { fx } from '../game/fx';

// The card you just won: shows its back first, then flips over to reveal it.
export default function FlipCard({ id, stars = 1 }) {
  const [flipped, setFlipped] = useState(false);
  const p = getPattern(id);
  const good = visuals[id].compare.good;
  const no = String(patterns.indexOf(p) + 1).padStart(2, '0');

  useEffect(() => {
    const t = setTimeout(() => {
      setFlipped(true);
      fx('flip');
    }, 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={'flip' + (flipped ? ' is-flipped' : '')} aria-label={`Card won: ${p.title}, ${stars} of 3 stars`}>
      <div className="flip-inner">
        <div className="flip-face flip-back" aria-hidden>
          <span className="logo-mark" />
          <span>AI PATTERNS</span>
        </div>
        <div className={`flip-face flip-front thumb-${p.category}`}>
          <div className="flip-thumb" aria-hidden>
            <span className="card-no">#{no}</span>
            <MockFrame mini>
              {good.blocks.map((b, i) => <MockBlock key={i} b={b} />)}
            </MockFrame>
          </div>
          <div className="flip-body">
            <span className={`tag tag-${p.category}`}>{getCategory(p.category).name}</span>
            <strong>{p.title}</strong>
            <span className="card-stars">
              {[1, 2, 3].map((n) => <Star key={n} size={14} strokeWidth={1.75} className={n <= stars ? 'is-on' : ''} aria-hidden />)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
