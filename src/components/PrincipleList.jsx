import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { getPrinciple, patternPrinciples } from '../data/principles';

export const TYPE_LABEL = { heuristic: 'Heuristic', law: 'Law of UX', psychology: 'Psychology' };

// The principles a pattern relies on, each with how it applies here.
export default function PrincipleList({ id }) {
  const items = patternPrinciples[id] || [];
  return (
    <ul className="pr-list">
      {items.map(([pid, how]) => {
        const pr = getPrinciple(pid);
        return (
          <li key={pid}>
            <Link to={`/principles?focus=${pid}`} className="pr-item">
              <span className={`pr-type pr-${pr.type}`}>{TYPE_LABEL[pr.type]}</span>
              <span className="pr-name">
                {pr.name}
                <ArrowUpRight size={13} strokeWidth={1.75} aria-hidden />
              </span>
              <span className="pr-how">{how}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
