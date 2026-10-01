import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { categories, patterns } from '../../data/patterns';
import { usePassed, useStars } from '../../progress';

// One badge per pattern group: collect every card to win it, all 3 stars for gold.
export default function Badges() {
  const passed = usePassed();
  const stars = useStars();
  return (
    <ul className="badges">
      {categories.map((c) => {
        const list = patterns.filter((p) => p.category === c.id);
        const got = list.filter((p) => passed.includes(p.id)).length;
        const gold = got === list.length && list.every((p) => stars[p.id] === 3);
        const won = got === list.length;
        return (
          <li key={c.id} className={'badge' + (won ? ' is-won' : '') + (gold ? ' is-gold' : '')}>
            <Link to={`/patterns?category=${c.id}`}>
              <span className={`badge-icon badge-${c.id}`} aria-hidden>{won ? <Check size={18} strokeWidth={2.25} /> : `${got}/${list.length}`}</span>
              <span className="badge-name">{c.name}</span>
              <span className="badge-sub">{gold ? 'Gold · all 3 stars' : won ? 'Complete' : `${list.length - got} to go`}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
