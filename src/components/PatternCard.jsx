import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { getCategory } from '../data/patterns';
import { visuals } from '../data/visuals';
import MockFrame, { MockBlock } from '../mock/Mock';

// Card with a small picture of the "better" design.
export default function PatternCard({ pattern, passed }) {
  const good = visuals[pattern.id].compare.good;
  return (
    <Link to={`/patterns/${pattern.id}`} className="card pattern-card">
      <div className={`thumb thumb-${pattern.category}`} aria-hidden>
        <MockFrame mini>
          {good.blocks.map((b, i) => <MockBlock key={i} b={b} />)}
        </MockFrame>
      </div>
      <div className="pattern-card-body">
        <div className="row">
          <span className={`tag tag-${pattern.category}`}>{getCategory(pattern.category).name}</span>
          {passed && <span className="tag tag-done"><Check size={10} strokeWidth={2.5} aria-hidden /> Passed</span>}
        </div>
        <h3>{pattern.title}</h3>
        <p>{pattern.summary}</p>
      </div>
    </Link>
  );
}
